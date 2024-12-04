import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddModule from "./AddModule";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import "../styles/modules.css";

function Modules() {
  const [modules, setModules] = useState([]);
  const [registrationCounts, setRegistrationCounts] = useState({});
  const [error, setError] = useState("");
  const [editingModule, setEditingModule] = useState(null);

  useEffect(() => {
    updateModules();
    
    const intervalId = setInterval(() => {
      updateModules();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const updateModules = async () => {
    try {
      const modulesResponse = await axios.get(`${API_ENDPOINT}/Module`);
      const modules = Array.isArray(modulesResponse.data) 
        ? modulesResponse.data 
        : modulesResponse.data._embedded?.modules || [];
      setModules(modules);

      const registrationsResponse = await axios.get(`${API_ENDPOINT}/registrations/registrations`);
      const registrations = Array.isArray(registrationsResponse.data)
        ? registrationsResponse.data
        : registrationsResponse.data._embedded?.registrations || [];
      
      const counts = {};
      for (const registration of registrations) {
        const moduleId = registration.module?.id || registration._links?.module?.href?.split('/').pop();
        if (moduleId) {
          counts[moduleId] = (counts[moduleId] || 0) + 1;
        }
      }
      
      setRegistrationCounts(counts);
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch data.";
      setError(errorMessage);
      console.error("Error fetching data:", err);
    }
  };

  const handleDelete = async (code) => {
    try {
      // First get the module to delete
      const moduleToDelete = modules.find(m => m.code === code);
      if (!moduleToDelete) {
        setError("Module not found");
        return;
      }

      // Check if there are any registrations
      if (registrationCounts[moduleToDelete.id] > 0) {
        setError("Cannot delete module with active registrations");
        return;
      }

      await axios.delete(`${API_ENDPOINT}/Module/${moduleToDelete.id}`);
      updateModules();
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete module.";
      setError(errorMessage);
      console.error("Error deleting module:", err);
    }
  };

  const handleEdit = (module) => {
    setEditingModule({
      id: module.id,
      code: module.code,
      name: module.name,
      mnc: module.mnc
    });
  };

  const handleSave = async (code, updatedModule) => {
    try {
      // Ensure we're sending the correct structure
      const moduleToUpdate = {
        id: updatedModule.id,
        code: updatedModule.code,
        name: updatedModule.name,
        mnc: updatedModule.mnc || false
      };

      await axios.post(`${API_ENDPOINT}/Module`, moduleToUpdate);
      setEditingModule(null);
      updateModules();
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update module.";
      setError(errorMessage);
      console.error("Error updating module:", err);
      console.error("Module data sent:", updatedModule);
    }
  };

  return (
    <div className="modules-page">
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

      <div className="add-student-section">
        <AddModule update={updateModules} />
      </div>

      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && modules.length < 1 && (
          <div className="warning-message">No modules available</div>
        )}
        <table className="students-table">
          <thead>
            <tr>
              <th>Module Code</th>
              <th>Module Name</th>
              <th>Is MNC</th>
              <th>Enrolled</th>
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
                <td className="registration-count">
                  {registrationCounts[module.id] || 0}
                </td>
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
                    disabled={registrationCounts[module.id] > 0}
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