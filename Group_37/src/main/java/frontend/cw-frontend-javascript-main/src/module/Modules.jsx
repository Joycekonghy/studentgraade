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
  const [moduleToEdit, setModuleToEdit] = useState(null);

  useEffect(() => {
    updateModules();

    const intervalId = setInterval(() => {
      updateModules();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const updateModules = () => {
    console.log("Fetching modules...");
    axios
      .get(`${API_ENDPOINT}/Module`)
      .then(async (modulesResponse) => {
        console.log("Modules response:", modulesResponse.data);
        const modules = modulesResponse.data;
        setModules(modules);

        try {
          const registrationsResponse = await axios.get(
            `${API_ENDPOINT}/registrations`
          );
          console.log("Registrations response:", registrationsResponse.data);
          const registrations = registrationsResponse.data._embedded?.registrations || [];

          const counts = {};
          for (const registration of registrations) {
            if (registration._links.module) {
              const moduleUrl = registration._links.module.href;
              const moduleResponse = await axios.get(moduleUrl);
              const moduleId = moduleResponse.data.id;
              counts[moduleId] = (counts[moduleId] || 0) + 1;
            }
          }
          console.log("Registration counts:", counts);
          setRegistrationCounts(counts);
        } catch (err) {
          console.error("Error fetching registrations:", err);
        }
      })
      .catch((err) => {
        console.error("Error fetching modules:", err);
        setError(err.message || "Failed to fetch modules.");
      });
  };

  const handleEditModule = (module) => {
    setModuleToEdit(module);
  };

  const clearEdit = () => {
    setModuleToEdit(null);
  };

  return (
    <div className="modules-page">
      <div className="navbar">
        <div className="navbar-logo">
          <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
          <span className="navbar-text">MyGrades</span>
        </div>
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
        <AddModule
          update={updateModules}
          moduleToEdit={moduleToEdit}
          clearEdit={clearEdit}
        />
      </div>

      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && modules.length === 0 ? (
          <div className="warning-message">No modules available</div>
        ) : (
          !error && modules.length > 0 && (
            <>
              <div className="table-header">
                <h2>Modules List</h2>
              </div>
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
                    <ModuleRow
                      key={module.code}
                      module={module}
                      registrationCount={registrationCounts[module.id] || 0}
                      updateModules={updateModules}
                      onEdit={() => handleEditModule(module)}
                    />
                  ))}
                </tbody>
              </table>
            </>
          )
        )}
      </div>
    </div>
  );
}

const ModuleRow = ({ module, registrationCount, updateModules, onEdit }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete module "${module.name}"? All registrations for this module will also be deleted.`
    );
    if (!confirmDelete) return;

    try {
      console.log("Deleting registrations for module:", module);

      const registrationsResponse = await axios.get(`${API_ENDPOINT}/registrations`);
      const registrations = registrationsResponse.data._embedded?.registrations || [];
      const moduleRegistrations = registrations.filter(
        (reg) => reg._links.module?.href.endsWith(`/${module.id}`)
      );

      if (moduleRegistrations.length > 0) {
        await Promise.all(
          moduleRegistrations.map((registration) =>
            axios.delete(registration._links.self.href)
          )
        );
      }

      const deleteModuleUrl = `${API_ENDPOINT}/modules/${module.id}`;
      console.log("DELETE URL:", deleteModuleUrl);
      await axios.delete(deleteModuleUrl);

      updateModules();
      alert(`Module "${module.name}" and its registrations have been successfully deleted.`);
    } catch (err) {
      console.error("Failed to delete module or its registrations", err);

      if (err.response?.status === 405) {
        alert("Delete operation is not allowed. Check API permissions or backend logic.");
      } else {
        alert(
          `An error occurred while deleting the module. Please check the console for details.`
        );
      }
    }
  };

  return (
    <tr>
      <td>{module.code}</td>
      <td>{module.name}</td>
      <td>{module.mnc ? "Yes" : "No"}</td>
      <td className="registration-count">{registrationCount}</td>
      <td>
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button
          className="delete-button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Modules;