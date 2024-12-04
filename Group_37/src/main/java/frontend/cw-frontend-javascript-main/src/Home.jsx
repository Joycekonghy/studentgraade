import React from "react";
import { Link, useNavigate } from "react-router-dom";
import graduateBoy from "./Icons/graduate_boy.png";
import graduateStudent from "./Icons/graduate_student.png";
import "./styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">
          <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
          <span className="navbar-text">MyGrades</span>
        </div>
        <nav className="navbar-links">
          <Link to="/" className="active-link">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="text-container">
          <div className="text-content">
            <h1 className="main-heading">Grading System</h1>
            <p className="subtext">
              Add students, modules, and grades! <br />
              Keep track of your academic performance.
            </p>
            <button className="cta-button" onClick={() => navigate("/advice")}>
              Get Advice Now
            </button>
          </div>
        </div>
        <div className="image-container">
          <img src={graduateBoy} alt="Graduate Boy" className="main-image" />
        </div>
      </div>
    </div>
  );
}

export default Home;

