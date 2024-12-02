import React from "react";
import axios from "axios";
import { Breadcrumbs, Link, Typography, Alert, Grid } from "@mui/material";
import { API_ENDPOINT } from "../config";
import AddStudent from "./AddStudent";

function Students() {
  const [students, setStudents] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    updateStudents();
  }, []);

  function updateStudents() {
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
  }

  return (
    <>
      <Breadcrumbs sx={{ marginBottom: "30px" }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography sx={{ color: "text.primary" }}>Students</Typography>
      </Breadcrumbs>
      {error && <Alert color="error">{error}</Alert>}
      {!error && students.length < 1 && (
        <Alert color="warning">No students</Alert>
      )}
      {students.length > 0 && (
        <>
          <Grid container style={{ padding: "10px 0" }}>
            <Grid item xs={2}>
              Student ID
            </Grid>
            <Grid item xs={2}>
              First Name
            </Grid>
            <Grid item xs={2}>
              Last Name
            </Grid>
            <Grid item xs={2}>
              Username
            </Grid>
            <Grid item xs={4}>
              email
            </Grid>
          </Grid>
          {students.map((s) => {
            return (
              <Grid container key={s.id} style={{ padding: "10px 0" }}>
                <Grid item xs={2}>
                  {s.id}
                </Grid>
                <Grid item xs={2}>
                  {s.firstName}
                </Grid>
                <Grid item xs={2}>
                  {s.lastName}
                </Grid>
                <Grid item xs={2}>
                  {s.username}
                </Grid>
                <Grid item xs={4}>
                  {s.email}
                </Grid>
              </Grid>
            );
          })}
        </>
      )}
      <br />
      <br />
      <AddStudent update={updateStudents} />
    </>
  );
}

export default Students;


// import React from "react";
// import axios from "axios";
// import { Breadcrumbs, Link, Typography, Alert, Grid } from "@mui/material";
// import App from "../App";
// import { API_ENDPOINT } from "../config";
// import AddStudent from "./AddStudent";

// function Students() {
//   const [students, setStudents] = React.useState([]);
//   const [error, setError] = React.useState();

//   React.useEffect(() => {
//     updateStudents();
//   }, []);

//   function updateStudents() {
//     axios
//       .get(`${API_ENDPOINT}/students`)
//       .then((response) => {
//         const students = response.data._embedded?.students || [];
//         setStudents(students);
//       })
//       .catch((err) => {
//         console.error("Error fetching students:", err);
//         setError(err.message || "Failed to fetch students.");
//       });
//   }
  

//   return (
//     <App>
//       <Breadcrumbs sx={{ marginBottom: "30px" }}>
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//         <Typography sx={{ color: "text.primary" }}>Students</Typography>
//       </Breadcrumbs>
//       {error && <Alert color="error">{error}</Alert>}
//       {!error && students.length < 1 && (
//         <Alert color="warning">No students</Alert>
//       )}
//       {students.length > 0 && (
//         <>
//           <Grid container style={{ padding: "10px 0" }}>
//             <Grid item xs={2}>
//               Student ID
//             </Grid>
//             <Grid item xs={2}>
//               First Name
//             </Grid>
//             <Grid item xs={2}>
//               Last Name
//             </Grid>
//             <Grid item xs={2}>
//               Username
//             </Grid>
//             <Grid item xs={4}>
//               email
//             </Grid>
//           </Grid>
//           {students.map((s) => {
//             return (
//               <Grid container key={s.id} style={{ padding: "10px 0" }}>
//                 <Grid item xs={2}>
//                   {s.id}
//                 </Grid>
//                 <Grid item xs={2}>
//                   {s.firstName}
//                 </Grid>
//                 <Grid item xs={2}>
//                   {s.lastName}
//                 </Grid>
//                 <Grid item xs={2}>
//                   {s.username}
//                 </Grid>
//                 <Grid item xs={4}>
//                   {s.email}
//                 </Grid>
//               </Grid>
//             );
//           })}
//         </>
//       )}
//       <br />
//       <br />
//       <AddStudent update={updateStudents} />
//     </App>
//   );
// }

// export default Students;

// UN COMMENT THIS CODE TO SEE IMPORVED UI USING mockApiStudents.js (COMMENT CODE ABOVE)

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
// } from "@mui/material";
// import App from "../App.jsx";
// import AddStudent from "./AddStudent";
// import { getStudents, deleteStudent } from "../mockApiStudents"; // Import mock API functions

// function Students() {
//   const [students, setStudents] = React.useState([]);
//   const [error, setError] = React.useState(null);
//   const [studentToEdit, setStudentToEdit] = React.useState(null);

//   React.useEffect(() => {
//     updateStudents();
//   }, []);

//   function updateStudents() {
//     getStudents()
//       .then((data) => {
//         setStudents(data);
//         setError(null);
//       })
//       .catch((err) => setError(err.message));
//   }

//   function handleEdit(student) {
//     setStudentToEdit(student);
//   }

//   function handleDelete(studentId) {
//     deleteStudent(studentId)
//       .then(() => updateStudents())
//       .catch((err) => setError(err.message));
//   }

//   return (
//     <App>
//       <Breadcrumbs sx={{ marginBottom: "30px" }}>
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//         <Typography sx={{ color: "text.primary" }}>Students</Typography>
//       </Breadcrumbs>
//       {error && <Alert severity="error">{error}</Alert>}
//       {!error && students.length < 1 && (
//         <Alert severity="warning">No students available.</Alert>
//       )}
//       {students.length > 0 && (
//         <Table component={Paper} sx={{ marginTop: "20px" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>First Name</TableCell>
//               <TableCell>Last Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Username</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((s) => (
//               <TableRow key={s.id}>
//                 <TableCell>{s.firstName}</TableCell>
//                 <TableCell>{s.lastName}</TableCell>
//                 <TableCell>{s.email}</TableCell>
//                 <TableCell>{s.username}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     onClick={() => handleEdit(s)}
//                     sx={{ marginRight: "8px" }}
//                   >
//                     Edit
//                   </Button>
//                   <Button color="error" onClick={() => handleDelete(s.id)}>
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//       <AddStudent update={updateStudents} studentToEdit={studentToEdit} />
//     </App>
//   );
// }

// export default Students;
