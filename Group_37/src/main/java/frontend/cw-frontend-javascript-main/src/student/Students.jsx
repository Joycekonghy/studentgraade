import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import AddStudent from "./AddStudent";

function Students() {
  // State to store the list of students
  const [students, setStudents] = useState([]);
  // State to handle errors during API calls
  const [error, setError] = useState(null);
  // State to manage expanded student rows (if additional details needed)
  const [expandedStudents, setExpandedStudents] = useState({});
  // State to keep track of the student being edited
  const [studentToEdit, setStudentToEdit] = useState(null);

  // useEffect to fetch the student data on component mount
  useEffect(() => {
    updateStudents();
  }, []);

  // Function to fetch students from the API
  const updateStudents = () => {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        // Safely handle the response, ensuring the presence of student data
        const students = response.data._embedded?.students || [];
        setStudents(students); // Update state with fetched students
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        // Update error state if the API call fails
        setError(err.message || "Failed to fetch students.");
      });
  };

  // Toggle expanded/collapsed state for student details
  const handleToggleExpand = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev, // Retain the previous expanded states
      [studentId]: !prev[studentId], // Toggle the state for the given student ID
    }));
  };

  // Set the selected student for editing
  const handleEditStudent = (student) => {
    setStudentToEdit(student); // Populate the form with the selected student
  };

  // Clear the edit state when editing is complete or cancelled
  const clearEdit = () => {
    setStudentToEdit(null); // Clear the editing state
  };

  return (
    <div className="registration-page">
      {/* Navbar Section */}
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          {/* Links to other pages */}
          <Link to="/">Home</Link>
          <Link to="/students" className="active-link">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      {/* Add/Edit Student Section */}
      <div className="add-student-section">
        {/* AddStudent component is used for both adding and editing students */}
        <AddStudent
          update={updateStudents} // Pass function to refresh the student list
          studentToEdit={studentToEdit} // Pass the student being edited (if any)
          clearEdit={clearEdit} // Clear editing state after action
        />
      </div>

      {/* Main Content */}
      <div className="students-table-wrapper">
        {/* Display error message if API call failed */}
        {error && <div className="error-message">{error}</div>}
        {/* Display warning message if there are no students */}
        {!error && students.length < 1 && (
          <div className="warning-message">No students available</div>
        )}

        {/* Render Students Table */}
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
              // Render each student using the StudentRow component
              <StudentRow
                key={student.id} // Unique key for React's reconciliation
                student={student} // Pass student data
                updateStudents={updateStudents} // Pass function to refresh list after changes
                onEdit={() => handleEditStudent(student)} // Trigger edit action
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component for rendering a single row in the student table
const StudentRow = ({ student, updateStudents, onEdit }) => {
  // Handle student deletion
  const handleDelete = () => {
    axios
      .delete(`${API_ENDPOINT}/students/${student.id}`)
      .then(() => updateStudents()) // Refresh list on successful delete
      .catch((err) => console.error("Failed to delete student", err)); // Log error if deletion fails
  };

  return (
    <tr>
      <td>{student.id}</td>
      <td>{student.firstName}</td>
      <td>{student.lastName}</td>
      <td>{student.username}</td>
      <td>{student.email}</td>
      <td>
        {/* Button to trigger edit action */}
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        {/* Button to trigger delete action */}
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Students;
