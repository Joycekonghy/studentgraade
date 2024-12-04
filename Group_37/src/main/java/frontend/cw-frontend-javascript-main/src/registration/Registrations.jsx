import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RegisterModule from "./RegisterModule";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import "../styles/registration.css";

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [expandedStudents, setExpandedStudents] = useState({});
  const [students, setStudents] = useState({});

  useEffect(() => {
    updateRegistrations();
  }, []);

  const updateRegistrations = async () => {
    try {
      console.log("Fetching registrations...");
      const response = await axios.get(`${API_ENDPOINT}/registrations`);
      const registrations = response.data._embedded?.registrations || [];

      if (registrations.length === 0) {
        setRegistrations([]);
        setStudents({});
        setError(""); // Clear any existing error
        return;
      }

      // Get unique student URLs
      const studentUrls = [...new Set(registrations.map((reg) => reg._links.student.href))];
      console.log("Student URLs:", studentUrls);

      // Fetch all student details in parallel
      const studentDetails = await Promise.all(
        studentUrls.map((url) =>
          axios.get(url).catch((err) => {
            console.error(`Failed to fetch student details for ${url}`, err);
            return null;
          })
        )
      ).then(results => results.filter(detail => detail !== null));

      // Create student map
      const studentMap = studentUrls.reduce((acc, url, index) => {
        if (studentDetails[index]) {
          acc[url] = studentDetails[index].data;
        } else {
          console.warn(`No student data for URL: ${url}`);
        }
        return acc;
      }, {});
      console.log("Student map:", studentMap);

      // Update state
      setRegistrations(registrations);
      setStudents(studentMap);
      setError("");
    } catch (err) {
      const errorMessage =
        err.code === "ERR_NETWORK"
          ? "Could not connect to server. Please check if the server is running."
          : err.response?.data?.message || err.message || "Failed to fetch registrations.";
      setError(errorMessage);
      console.error("Error fetching registrations:", err);
    }
  };

  // Group registrations by student
  const groupedRegistrations = registrations.reduce((acc, reg) => {
    const studentUrl = reg._links.student.href;
    const student = students[studentUrl];
    if (!student) return acc;
    const studentId = student.id;
    if (!acc[studentId]) {
      acc[studentId] = [];
    }
    acc[studentId].push(reg);
    return acc;
  }, {});

  const toggleExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  return (
    <div className="registration-page">
      <div className="navbar">
        <div className="navbar-logo">
          <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
          <span className="navbar-text">MyGrades</span>
        </div>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations" className="active-link">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      <div className="add-student-section">
        <RegisterModule update={updateRegistrations} />
      </div>

      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && Object.keys(groupedRegistrations).length === 0 && (
          <div className="warning-message">No registrations available</div>
        )}

        {Object.entries(groupedRegistrations).map(([studentId, studentRegs]) => {
          const student = Object.values(students).find(s => s.id === Number(studentId));
          if (!student) return null;

          return (
            <div key={studentId} className="student-section">
              <div
                className="student-header"
                onClick={() => toggleExpand(studentId)}
              >
                <span className="student-info">
                  {student.firstName} {student.lastName} (ID: {student.id})
                </span>
                <span className="module-count">
                  {studentRegs.length} module{studentRegs.length !== 1 ? 's' : ''} {expandedStudents[studentId] ? '▼' : '▶'}
                </span>
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
                      {studentRegs.map(registration => (
                        <ModuleRow
                          key={registration.id}
                          registration={registration}
                          updateRegistrations={updateRegistrations}
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

const ModuleRow = ({ registration, updateRegistrations }) => {
  const [module, setModule] = useState(null);

  useEffect(() => {
    if (registration._links.module) {
      axios.get(registration._links.module.href)
        .then(res => setModule(res.data))
        .catch(err => console.error("Error fetching module:", err));
    }
  }, [registration]);

  const handleDelete = async () => {
    try {
      await axios.delete(registration._links.self.href);
      updateRegistrations();
    } catch (err) {
      console.error("Failed to delete registration", err);
    }
  };

  return (
    <tr>
      <td>{module?.code || "Loading..."}</td>
      <td>{module?.name || "Loading..."}</td>
      <td>{registration.score || "N/A"}</td>
      <td>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Registrations;