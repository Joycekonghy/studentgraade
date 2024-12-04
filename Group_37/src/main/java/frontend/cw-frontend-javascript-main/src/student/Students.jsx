import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import AddStudent from "./AddStudent";

function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [studentToEdit, setStudentToEdit] = useState(null);

  useEffect(() => {
    updateStudents();
  }, []);

  const updateStudents = () => {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        const students = response.data._embedded?.students || [];
        setStudents(students);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(err.message || "Failed to fetch students.");
      });
  };

  const handleToggleExpand = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
  };

  const clearEdit = () => {
    setStudentToEdit(null);
  };

  return (
    <div className="registration-page">
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students" className="active-link">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      <div className="add-student-section">
        <AddStudent
          update={updateStudents}
          studentToEdit={studentToEdit}
          clearEdit={clearEdit}
        />
      </div>

      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && students.length === 0 ? (
          <div className="warning-message">No students available</div>
        ) : (
          !error && students.length > 0 && (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    updateStudents={updateStudents}
                    onEdit={() => handleEditStudent(student)}
                  />
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

const StudentRow = ({ student, updateStudents, onEdit }) => {
  const handleDelete = () => {
    axios
      .delete(`${API_ENDPOINT}/students/${student.id}`)
      .then(() => updateStudents())
      .catch((err) => console.error("Failed to delete student", err));
  };

  return (
    <tr>
      <td>{student.id}</td>
      <td>{student.firstName}</td>
      <td>{student.lastName}</td>
      <td>{student.username}</td>
      <td>{student.email}</td>
      <td>
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Students;