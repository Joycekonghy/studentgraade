import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import AddStudent from "./AddStudent";
import { useTheme } from "../App";  // Импортируем хук из App.js
import "../styles/students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [studentToEdit, setStudentToEdit] = useState(null);

  const { isDarkMode, toggleTheme } = useTheme();  // Используем хук для темы
  console.log('isDarkMode in Students:', isDarkMode);  // Логируем состояние темы

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
    <div className={`students-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="navbar">
        <div className="navbar-logo">
          <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
          <span className="navbar-text">MyGrades</span>
        </div>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students" className="active-link">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>

          {/* Кнопка для переключения темы */}
          <button className="theme-toggle-button" onClick={() => {
            toggleTheme();
            console.log('Theme toggled, isDarkMode now:', isDarkMode);
          }}>
            <span className={`sun-icon ${isDarkMode ? 'hidden' : ''}`}>🌞</span>
            <span className={`moon-icon ${isDarkMode ? '' : 'hidden'}`}>🌑</span>
          </button>
        </nav>
      </div>

      <div className={`add-student-section ${isDarkMode ? 'dark-mode' : ''}`}>
        <AddStudent
          update={updateStudents}
          studentToEdit={studentToEdit}
          clearEdit={clearEdit}
        />
      </div>

      <div className={`students-table-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
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

