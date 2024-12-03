import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddGrade from "./AddGrade";
import UpdateGrade from "./UpdateGrade";
import axios from "axios";
import graduateStudent from "../Icons/graduate_student.png";
import { API_ENDPOINT } from "../config";
import "../styles/grades.css";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]); // Fetch students for mapping
  const [error, setError] = useState("");
  const [expandedStudents, setExpandedStudents] = useState({});

  useEffect(() => {
    updateGrades();
    updateStudents(); // Fetch students on load
  }, []);

  const updateGrades = () => {
    axios
      .get(`${API_ENDPOINT}/grades`)
      .then((response) => {
        const grades = response.data._embedded?.grades || [];
        setGrades(grades);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to fetch grades.");
      });
  };

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

  const toggleStudent = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const calculateAverageGrade = (grades) => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    return (total / grades.length).toFixed(2);
  };

  const getUkGrade = (average) => {
    if (average >= 70) return "First";
    if (average >= 60) return "2:1";
    if (average >= 50) return "2:2";
    if (average >= 40) return "Third";
    return "Fail";
  };

  // Map student ID to full name
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id.toString() === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student ID: ${studentId}`;
  };

  // Group grades by student
  const groupedGrades = grades.reduce((grouped, grade) => {
    const studentId = grade._links.student.href.split("/").pop();
    if (!grouped[studentId]) grouped[studentId] = [];
    grouped[studentId].push(grade);
    return grouped;
  }, {});

  return (
    <div className="grades-page">
      {/* Navbar */}
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades" className="active-link">
            Grades
          </Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      {/* Add Grade Section */}
      <div className="add-grade-section">
        <AddGrade update={updateGrades} />
      </div>

      {/* Grouped Grades */}
      <div className="grades-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && grades.length < 1 && <div className="warning-message">No grades available</div>}

        {/* Render grouped student grades */}
        {Object.entries(groupedGrades).map(([studentId, studentGrades]) => {
          const averageGrade = calculateAverageGrade(studentGrades);
          const ukGrade = getUkGrade(averageGrade);

          return (
            <div key={studentId} className="student-group">
              {/* Student Header */}
              <div
                className="student-header"
                onClick={() => toggleStudent(studentId)}
              >
                <span>{getStudentName(studentId)}</span>
                <span>{`Average Score: ${averageGrade}%`}</span>
                <span>{`UK Grade: ${ukGrade}`}</span>
              </div>

              {/* Modules Table */}
              {expandedStudents[studentId] && (
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map((grade) => (
                      <ModuleRow
                        key={grade.id}
                        grade={grade}
                        updateGrades={updateGrades}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Component for each module row
const ModuleRow = ({ grade, updateGrades }) => {
  const [module, setModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get(grade._links.module.href).then((res) => setModule(res.data));
  }, [grade]);

  const handleDelete = () => {
    axios
      .delete(`${grade._links.self.href}`)
      .then(() => updateGrades())
      .catch((err) => console.error("Failed to delete grade", err));
  };

  return (
    <tr>
      <td>{module ? `${module.code} ${module.name}` : "Loading..."}</td>
      <td>{grade.score}</td>
      <td>
        <button className="update-button" onClick={() => setIsEditing(true)}>
          Update
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
        {isEditing && (
          <UpdateGrade
            grade={grade}
            onClose={() => setIsEditing(false)}
            onUpdate={updateGrades}
          />
        )}
      </td>
    </tr>
  );
};

export default Grades;


// import React from "react";
// import axios from "axios";
// import { Breadcrumbs, Link, Typography, Alert, Grid, Button } from "@mui/material";
// import { API_ENDPOINT } from "../config";
// import AddGrade from "./AddGrade";
// import UpdateGrade from "./UpdateGrade";

// function Grades() {
//   const [grades, setGrades] = React.useState([]);
//   const [error, setError] = React.useState();

//   React.useEffect(() => {
//     updateGrades();
//   }, []);

//   function updateGrades() {
//     axios
//       .get(`${API_ENDPOINT}/grades`)
//       .then((response) => {
//         const grades = response.data._embedded?.grades || [];
//         console.log("Fetched grades:", grades); // Debug log
//         setGrades(grades);
//       })
//       .catch((err) => {
//         console.error("Error fetching grades:", err);
//         setError(err.response?.data?.message || err.message || "Failed to fetch grades.");
//       });
//   }

//   // Inline GradeRow Component
//   function GradeRow({ grade }) {
//     const [student, setStudent] = React.useState();
//     const [module, setModule] = React.useState();
//     const [isEditing, setIsEditing] = React.useState(false);

//     React.useEffect(() => {
//       axios.get(grade._links.module.href).then((response) => setModule(response.data));
//       axios.get(grade._links.student.href).then((response) => setStudent(response.data));
//     }, [grade]);

//     return (
//       <>
//         <Grid container style={{ padding: "10px 0" }}>
//           <Grid item xs={3}>
//             {student ? `${student.firstName} ${student.lastName} (${student.id})` : "Loading..."}
//           </Grid>
//           <Grid item xs={3}>
//             {module ? `${module.code} ${module.name}` : "Loading..."}
//           </Grid>
//           <Grid item xs={3}>
//             {grade.score}
//           </Grid>
//           <Grid item xs={3}>
//             <Button variant="outlined" onClick={() => setIsEditing(true)}>
//               Update Grade
//             </Button>
//           </Grid>
//         </Grid>
//         {isEditing && (
//           <UpdateGrade
//             grade={grade}
//             onClose={() => setIsEditing(false)}
//             onUpdate={updateGrades}
//           />
//         )}
//       </>
//     );
//   }

//   return (
//     <>
//       <Breadcrumbs sx={{ marginBottom: "30px" }}>
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//         <Typography sx={{ color: "text.primary" }}>Grades</Typography>
//       </Breadcrumbs>
//       {error && <Alert severity="error">{error}</Alert>}
//       {!error && grades.length < 1 && <Alert severity="warning">No grades</Alert>}
//       {grades.length > 0 && (
//         <>
//           <Grid container style={{ padding: "10px 0" }}>
//             <Grid item xs={3}>Student</Grid>
//             <Grid item xs={3}>Module</Grid>
//             <Grid item xs={3}>Score</Grid>
//             <Grid item xs={3}>Actions</Grid>
//           </Grid>
//           {grades.map((g) => (
//             <GradeRow key={g.id} grade={g} />
//           ))}
//         </>
//       )}
//       <br />
//       <br />
//       <AddGrade update={updateGrades} />
//     </>
//   );
// }

// export default Grades;
