import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddModule from "./AddModule";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import "../styles/modules.css";

function Modules() {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");
  const [editingModule, setEditingModule] = useState(null);

  useEffect(() => {
    updateModules();
  }, []);

  const updateModules = () => {
    console.log("Fetching modules...");
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        const modules = response.data._embedded?.modules || [];
        setModules(modules);
        console.log("Fetched modules:", modules);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch modules.";
        setError(errorMessage);
        console.error("Error fetching modules:", err);
      });
  };

  const handleDelete = (code) => {
    axios
      .delete(`${API_ENDPOINT}/modules/${code}`)
      .then(() => {
        updateModules();
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to delete module.";
        setError(errorMessage);
      });
  };

  const handleEdit = (module) => {
    setEditingModule(module);
  };

  const handleSave = (code, updatedModule) => {
    axios
      .put(`${API_ENDPOINT}/modules/${code}`, updatedModule)
      .then(() => {
        setEditingModule(null);
        updateModules();
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to update module.";
        setError(errorMessage);
      });
  };

  return (
    <div className="modules-page">
      {/* Navbar */}
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules" className="active-link">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      {/* Add Module Section */}
      <div className="add-student-section">
        <AddModule update={updateModules} />
      </div>

      {/* Main Content */}
      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && modules.length < 1 && (
          <div className="warning-message">No modules available</div>
        )}
        {/* Render Modules Table */}
        <table className="students-table">
          <thead>
            <tr>
              <th>Module Code</th>
              <th>Module Name</th>
              <th>Is MNC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.code}>
                <td>{module.code}</td>
                <td>
                  {editingModule?.code === module.code ? (
                    <input
                      type="text"
                      className="form-input"
                      defaultValue={module.name}
                      onChange={(e) => {
                        setEditingModule({
                          ...editingModule,
                          name: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    module.name
                  )}
                </td>
                <td>{module.mnc ? "Yes" : "No"}</td>
                <td className="action-buttons">
                  {editingModule?.code === module.code ? (
                    <button
                      className="edit-button"
                      onClick={() => handleSave(module.code, editingModule)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(module)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(module.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Modules;