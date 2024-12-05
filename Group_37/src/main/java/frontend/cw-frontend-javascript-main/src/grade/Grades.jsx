import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddGrade from "./AddGrade";
import UpdateGrade from "./UpdateGrade";
import GenerateReport from "./GenerateReport";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import { useTheme } from "../App";
import "../styles/grades.css";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");
  const [expandedStudents, setExpandedStudents] = useState({});
  const [students, setStudents] = useState({});

  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    updateGrades();
  }, []);

  const updateGrades = async () => {
    try {
      console.log("Fetching grades...");
      const response = await axios.get(`${API_ENDPOINT}/grades`);
      const grades = response.data._embedded?.grades || [];

      if (grades.length === 0) {
        setGrades([]);
        setStudents({});
        setError("");
        return;
      }

      const studentUrls = [...new Set(grades.map((grade) => grade._links.student.href))];

      const studentDetails = await Promise.all(
        studentUrls.map((url) =>
          axios.get(url).catch((err) => {
            console.error(`Failed to fetch student details for ${url}`, err);
            return null;
          })
        )
      ).then(results => results.filter(detail => detail !== null));

      const studentMap = {};
      studentDetails.forEach((detail, index) => {
        if (detail && detail.data) {
          studentMap[studentUrls[index]] = detail.data;
        }
      });

      setGrades(grades);
      setStudents(studentMap);
      setError("");
    } catch (err) {
      const errorMessage =
        err.code === "ERR_NETWORK"
          ? "Could not connect to server. Please check if the server is running."
          : err.response?.data?.message || err.message || "Failed to fetch grades.";
      setError(errorMessage);
      console.error("Error fetching grades:", err);
    }
  };

  const getUKClassification = (average) => {
    if (average >= 70) return "First Class (1st)";
    if (average >= 60) return "Upper Second Class (2:1)";
    if (average >= 50) return "Lower Second Class (2:2)";
    if (average >= 40) return "Third Class (3rd)";
    return "Fail";
  };

  const calculateAverage = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.score, 0);
    return (sum / grades.length).toFixed(1);
  };

  const groupedGrades = grades.reduce((acc, grade) => {
    const studentUrl = grade._links.student.href;
    const student = students[studentUrl];
    if (!student) return acc;
    if (!acc[student.id]) {
      acc[student.id] = {
        student,
        grades: []
      };
    }
    acc[student.id].grades.push(grade);
    return acc;
  }, {});

  const toggleExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  return (
    <div className={`grades-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="navbar">
        <div className="navbar-logo">
          <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
          <span className="navbar-text">MyGrades</span>
        </div>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades" className="active-link">Grades</Link>
          <Link to="/advice">Advice</Link>

          <button className="theme-toggle-button" onClick={toggleTheme}>
            <span className={`sun-icon ${isDarkMode ? 'hidden' : ''}`}>🌞</span>
            <span className={`moon-icon ${isDarkMode ? '' : 'hidden'}`}>🌑</span>
          </button>
        </nav>
      </div>

      <div className={`add-student-section ${isDarkMode ? 'dark-mode' : ''}`}>
        <AddGrade update={updateGrades} />
      </div>

      <div className={`students-table-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
        {error && <div className="error-message">{error}</div>}
        {!error && Object.keys(groupedGrades).length === 0 && (
          <div className="warning-message">No grades available</div>
        )}

        {Object.entries(groupedGrades).map(([studentId, { student, grades: studentGrades }]) => {
          const average = calculateAverage(studentGrades);
          const classification = getUKClassification(average);

          return (
            <div key={studentId} className="student-section">
              <div
                className="student-header"
                onClick={() => toggleExpand(studentId)}
              >
                <div className="header-content">
                  <span className="student-info">
                    {student.firstName} {student.lastName} (ID: {student.id})
                  </span>
                  <div className="grade-info">
                    <span className="average-grade">
                      Average: {average}%
                    </span>
                    <span
                      className="uk-classification"
                      data-classification={classification}
                    >
                      {classification}
                    </span>
                    <span className="module-count">
                      {studentGrades.length} grade{studentGrades.length !== 1 ? 's' : ''} {expandedStudents[studentId] ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
                <div className="download-report">
                  <GenerateReport studentId={studentId} />
                </div>
              </div>

              {expandedStudents[studentId] && (
                <div className="student-modules">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Module Code</th>
                        <th>Module Name</th>
                        <th>Score</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentGrades.map(grade => (
                        <GradeRow
                          key={grade.id}
                          grade={grade}
                          updateGrades={updateGrades}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const GradeRow = ({ grade, updateGrades }) => {
  const [module, setModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      if (grade._links.module) {
        try {
          const res = await axios.get(grade._links.module.href);
          setModule(res.data);
        } catch (err) {
          console.error("Error fetching module:", err);
        }
      }
    };
    fetchModule();
  }, [grade]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_ENDPOINT}/grades/${grade.id}`);
      updateGrades();
    } catch (err) {
      console.error("Error deleting grade:", err);
    }
  };

  const confirmDelete = () => {
    const confirmResult = window.confirm(
      `Are you sure you want to delete this grade for ${module?.name || 'this module'}?`
    );
    if (confirmResult) {
      handleDelete();
    }
  };

  return (
    <>
      <tr>
        <td>{module?.code || "Loading..."}</td>
        <td>{module?.name || "Loading..."}</td>
        <td>{grade.score}</td>
        <td>
          <div className="action-buttons">
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Update
            </button>
            <button
              className="delete-button"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
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
