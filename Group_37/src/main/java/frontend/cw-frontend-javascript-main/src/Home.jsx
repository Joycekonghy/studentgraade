import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import graduateBoy from "./Icons/graduate_boy.png";
import graduateStudent from "./Icons/graduate_student.png";
import "./styles/home.css";

function Home() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleButtonClick = () => {
    navigate("/grades"); // Navigate to the Grades page when the button is clicked
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          <a href="/" className="active-link">Home</a>
          <a href="/students">Students</a>
          <a href="/modules">Modules</a>
          <a href="/grades">Grades</a>
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
            <button className="cta-button" onClick={handleButtonClick}>
              Add A Grade Now
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
