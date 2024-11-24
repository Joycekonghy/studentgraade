import React from "react";
import axios from "axios";
import { Breadcrumbs, Link, Typography, Alert, Grid } from "@mui/material";
import App from "../App";
import { API_ENDPOINT } from "../config";
import AddGrade from "./AddGrade";

function GradeRow(props) {
  const { grade } = props;
  const [student, setStudent] = React.useState();
  const [module, setModule] = React.useState();

  React.useEffect(() => {
    axios
      .get(grade._links.module.href)
      .then((response) => setModule(response.data));

    axios
      .get(grade._links.student.href)
      .then((response) => setStudent(response.data));
  }, [grade]);

  return (
    <Grid key={grade.id} container style={{ padding: "10px 0" }}>
      <Grid item xs={4}>
        {student && `${student.firstName} ${student.lastName} (${student.id})`}
      </Grid>
      <Grid item xs={4}>
        {module && `${module.code} ${module.name}`}
      </Grid>
      <Grid item xs={4}>
        {grade.score}
      </Grid>
    </Grid>
  );
}

function Grades() {
  const [grades, setGrades] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    updateGrades();
  }, []);

  function updateGrades() {
    axios
      .get(`${API_ENDPOINT}/grades`)
      .then((response) => {
        const grades = response.data._embedded?.grades || []; // Fallback to empty array
        setGrades(grades);
      })
      .catch((err) => {
        console.error("Error fetching grades:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch grades.");
      });
  }  

  return (
    <App>
      <Breadcrumbs sx={{ marginBottom: "30px" }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography sx={{ color: "text.primary" }}>Grades</Typography>
      </Breadcrumbs>
      {error && <Alert color="error">{error}</Alert>}
      {!error && grades.length < 1 && <Alert color="warning">No grades</Alert>}
      {grades.length > 0 && (
        <>
          <Grid container style={{ padding: "10px 0" }}>
            <Grid item xs={4}>
              Student
            </Grid>
            <Grid item xs={4}>
              Module
            </Grid>
            <Grid item xs={4}>
              Score
            </Grid>
          </Grid>
          {grades.map((g) => {
            return <GradeRow grade={g} />;
          })}
        </>
      )}
      <br />
      <br />
      <AddGrade update={updateGrades} />
    </App>
  );
}

export default Grades;

// UN COMMENT THIS CODE TO SEE IMPORVED UI USING mockApiGrades.js (COMMENT CODE ABOVE)

// import React from "react";
// import {
//   Breadcrumbs,
//   Link,
//   Typography,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Collapse,
//   Box,
// } from "@mui/material";
// import App from "../App.jsx";
// import AddGrade from "./AddGrade";
// import { getGrades, deleteGrade } from "../mockApiGrades";

// function Grades() {
//   const [grades, setGrades] = React.useState([]);
//   const [groupedGrades, setGroupedGrades] = React.useState({});
//   const [expandedRows, setExpandedRows] = React.useState([]);
//   const [error, setError] = React.useState(null);
//   const [gradeToEdit, setGradeToEdit] = React.useState(null);

//   React.useEffect(() => {
//     updateGrades();
//   }, []);

//   function updateGrades() {
//     getGrades()
//       .then((data) => {
//         setGrades(data);
//         groupGradesByStudent(data);
//         setError(null);
//       })
//       .catch((err) => setError(err.message));
//   }

//   function groupGradesByStudent(grades) {
//     const grouped = grades.reduce((acc, grade) => {
//       const { studentId, score } = grade;
//       if (!acc[studentId]) {
//         acc[studentId] = { grades: [], average: 0 };
//       }
//       acc[studentId].grades.push(grade);

//       // Calculate average: Ensure all scores are numbers
//       const totalScore = acc[studentId].grades.reduce(
//         (sum, g) => sum + Number(g.score),
//         0
//       );
//       acc[studentId].average = totalScore / acc[studentId].grades.length;

//       return acc;
//     }, {});

//     setGroupedGrades(grouped);
//   }

//   function getClassification(average) {
//     if (average >= 70) {
//       return "First";
//     } else if (average >= 60) {
//       return "2:1";
//     } else if (average >= 50) {
//       return "2:2";
//     } else if (average >= 40) {
//       return "Third";
//     } else {
//       return "Fail";
//     }
//   }

//   function toggleRow(studentId) {
//     if (expandedRows.includes(studentId)) {
//       setExpandedRows(expandedRows.filter((id) => id !== studentId));
//     } else {
//       setExpandedRows([...expandedRows, studentId]);
//     }
//   }

//   function handleEdit(grade) {
//     setGradeToEdit(grade);
//   }

//   function handleDelete(gradeId) {
//     deleteGrade(gradeId)
//       .then(() => updateGrades())
//       .catch((err) => setError(err.message));
//   }

//   return (
//     <App>
//       <Breadcrumbs sx={{ marginBottom: "30px" }}>
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//         <Typography sx={{ color: "text.primary" }}>Grades</Typography>
//       </Breadcrumbs>
//       {error && <Alert severity="error">{error}</Alert>}
//       {!error && grades.length < 1 && (
//         <Alert severity="warning">No grades available.</Alert>
//       )}
//       {Object.keys(groupedGrades).length > 0 && (
//         <Table component={Paper} sx={{ marginTop: "20px" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Student ID</TableCell>
//               <TableCell>Average Grade</TableCell>
//               <TableCell>Classification</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {Object.entries(groupedGrades).map(([studentId, { grades, average }]) => (
//               <React.Fragment key={studentId}>
//                 {/* Header Row */}
//                 <TableRow
//                   onClick={() => toggleRow(studentId)}
//                   sx={{ cursor: "pointer", backgroundColor: "#f9f9f9" }}
//                 >
//                   <TableCell>{studentId}</TableCell>
//                   <TableCell>{average.toFixed(2)}</TableCell>
//                   <TableCell>{getClassification(average)}</TableCell>
//                 </TableRow>
//                 {/* Collapsible Rows */}
//                 <TableRow>
//                   <TableCell colSpan={3} style={{ padding: 0 }}>
//                     <Collapse in={expandedRows.includes(studentId)} timeout="auto" unmountOnExit>
//                       <Box sx={{ margin: 1 }}>
//                         <Table size="small">
//                           <TableHead>
//                             <TableRow>
//                               <TableCell>Module Code</TableCell>
//                               <TableCell align="center">Score</TableCell>
//                               <TableCell align="center">Actions</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {grades.map((g) => (
//                               <TableRow key={g.id}>
//                                 <TableCell>{g.moduleCode}</TableCell>
//                                 <TableCell align="center">{g.score}</TableCell>
//                                 <TableCell align="center">
//                                   <Button
//                                     variant="outlined"
//                                     onClick={() => handleEdit(g)}
//                                     sx={{ marginRight: "8px" }}
//                                   >
//                                     Edit
//                                   </Button>
//                                   <Button color="error" onClick={() => handleDelete(g.id)}>
//                                     Delete
//                                   </Button>
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </Box>
//                     </Collapse>
//                   </TableCell>
//                 </TableRow>
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//       <AddGrade update={updateGrades} gradeToEdit={gradeToEdit} />
//     </App>
//   );
// }

// export default Grades;
