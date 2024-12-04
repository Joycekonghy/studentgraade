import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import AddModule from "./AddModule";
import "../styles/students.css";

function Modules() {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [moduleToEdit, setModuleToEdit] = useState(null);

  useEffect(() => {
    updateModules();
  }, []);

  const updateModules = () => {
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        const modules = response.data._embedded?.modules || [];
        setModules(modules);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch modules."
        );
      });
  };

  const handleToggleExpand = (moduleCode) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleCode]: !prev[moduleCode],
    }));
  };

  const handleEditModule = (module) => {
    setModuleToEdit(module);
  };

  const clearEdit = () => {
    setModuleToEdit(null);
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
          <Link to="/modules" className="active-link">
            Modules
          </Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      {/* Add/Edit Module Section */}
      <div className="add-module-section">
        <AddModule
          update={updateModules}
          moduleToEdit={moduleToEdit}
          clearEdit={clearEdit}
        />
      </div>

      {/* Main Content */}
      <div className="modules-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && modules.length < 1 && (
          <div className="warning-message">No modules available</div>
        )}

        <table className="students-table">
          <thead>
            <tr>
              <th>Module Code</th>
              <th>Module Name</th>
              <th>MNC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <ModuleRow
                key={module.id}
                module={module}
                updateModules={updateModules}
                onEdit={() => handleEditModule(module)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ModuleRow = ({ module, updateModules, onEdit }) => {
  const handleDelete = () => {
    axios
      .delete(`${API_ENDPOINT}/modules/${module.id}`)
      .then(() => updateModules())
      .catch((err) => console.error("Failed to delete module", err));
  };

  return (
    <tr>
      <td>{module.code}</td>
      <td>{module.name}</td>
      <td>{module.mnc ? "Yes" : "No"}</td>
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

export default Modules;
