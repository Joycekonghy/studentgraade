import React, { useState, useEffect } from "react";


  useEffect(() => {
    updateModules();
  }, []);

  const updateModules = () => {

    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        const modules = response.data._embedded?.modules || [];
        setModules(modules);


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


        <table className="students-table">
          <thead>
            <tr>
              <th>Module Code</th>
              <th>Module Name</th>

            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (

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
