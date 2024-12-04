import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddGrade from "./AddGrade";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import "../styles/grades.css";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    updateGrades();
  }, []);

  const updateGrades = () => {
    console.log("Fetching grades...");
    axios
      .get(`${API_ENDPOINT}/grades`)
      .then((response) => {
        const grades = response.data._embedded?.grades || [];
        setGrades(grades);
        console.log("Fetched grades:", grades);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch grades.";
        setError(errorMessage);
        console.error("Error fetching grades:", err);
      });
  };

  return (
    <div className="grades-page">
      {/* Navbar */}
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades" className="active-link">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>
      

      {/* Add Grade Section */}
      <div className="add-student-section">
        <AddGrade update={updateGrades} />
      </div>

      {/* Main Content */}
      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && grades.length < 1 && (
          <div className="warning-message">No grades available</div>
        )}

        {/* Render Grades Table */}
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Module</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <GradeRow
                key={grade.id}
                grade={grade}
                updateGrades={updateGrades}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const GradeRow = ({ grade, updateGrades }) => {
  const [student, setStudent] = useState(null);
  const [module, setModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch student details
    if (grade._links.student) {
      axios.get(grade._links.student.href)
        .then(res => setStudent(res.data))
        .catch(err => console.error("Error fetching student:", err));
    }

    // Fetch module details
    if (grade._links.module) {
      axios.get(grade._links.module.href)
        .then(res => setModule(res.data))
        .catch(err => console.error("Error fetching module:", err));
    }
  }, [grade]);

  return (
    <>
      <tr>
        <td>{student ? `${student.firstName} ${student.lastName} (${student.id})` : "Loading..."}</td>
        <td>{module ? `${module.code} ${module.name}` : "Loading..."}</td>
        <td>{grade.score}</td>
        <td>
          <button 
            className="edit-button" 
            onClick={() => setIsEditing(true)}
          >
            Update Grade
          </button>
        </td>
      </tr>
      {isEditing && (
        <tr>
          <td colSpan="4">
            <div className="update-grade-form">
              <UpdateGrade
                grade={grade}
                onClose={() => setIsEditing(false)}
                onUpdate={updateGrades}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Grades;