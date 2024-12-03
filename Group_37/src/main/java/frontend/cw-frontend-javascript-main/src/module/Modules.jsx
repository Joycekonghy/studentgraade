import React from "react";
import axios from "axios";
import { Typography, Alert, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../config";
import AddModule from "./AddModule";
import graduateStudent from "../Icons/graduate_student.png"; 
import "../styles/modules.css";



function Modules() {
  const [modules, setModules] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    updateModules();
  }, []);


  function updateModules() {
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        const modules = response.data._embedded?.modules || []; // Fallback to empty array
        setModules(modules);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to fetch modules.");
      });
  }

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

    

      {error && <Alert color="error">{error}</Alert>}
      {!error && modules.length < 1 && (
        <Alert color="warning">No modules</Alert>
      )}
      {modules.length > 0 && (
        <>
          <Grid container style={{ padding: "10px 0" }}>
            <Grid item xs={2}>
              Module Code
            </Grid>
            <Grid item xs={8}>
              Module Name
            </Grid>
            <Grid item xs={2}>
              Is MNC
            </Grid>
          </Grid>
          {modules.map((m) => {
            return (
              <Grid container key={m.code} style={{ padding: "10px 0" }}>
                <Grid item xs={2}>
                  {m.code}
                </Grid>
                <Grid item xs={8}>
                  {m.name}
                </Grid>
                <Grid item xs={2}>
                  {m.mnc ? "Yes" : "No"}
                </Grid>
              </Grid>
            );
          })}
        </>
      )}
      <br />
      <br />
      <AddModule update={updateModules} />
    </div>
  );
}

export default Modules;

// import React from "react";
// import axios from "axios";
// import { Breadcrumbs, Link, Typography, Alert, Grid } from "@mui/material";
// import App from "../App.jsx";
// import { API_ENDPOINT } from "../config";
// import AddModule from "./AddModule";

// function Modules() {
//   const [modules, setModules] = React.useState([]);
//   const [error, setError] = React.useState();

//   React.useEffect(() => {
//     updateModules();
//   }, []);

//   function updateModules() {
//     axios
//       .get(`${API_ENDPOINT}/modules`)
//       .then((response) => {
//         const modules = response.data._embedded?.modules || []; // Fallback to empty array
//         setModules(modules);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.message || err.message || "Failed to fetch modules.");
//       });
//   }

//   return (
//     <App>
//       <Breadcrumbs sx={{ marginBottom: "30px" }}>
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//         <Typography sx={{ color: "text.primary" }}>Modules</Typography>
//       </Breadcrumbs>
//       {error && <Alert color="error">{error}</Alert>}
//       {!error && modules.length < 1 && (
//         <Alert color="warning">No modules</Alert>
//       )}
//       {modules.length > 0 && (
//         <>
//           <Grid container style={{ padding: "10px 0" }}>
//             <Grid item xs={2}>
//               Module Code
//             </Grid>
//             <Grid item xs={8}>
//               Module Name
//             </Grid>
//             <Grid item xs={2}>
//               Is MNC
//             </Grid>
//           </Grid>
//           {modules.map((m) => {
//             return (
//               <Grid container key={m.code} style={{ padding: "10px 0" }}>
//                 <Grid item xs={2}>
//                   {m.code}
//                 </Grid>
//                 <Grid item xs={8}>
//                   {m.name}
//                 </Grid>
//                 <Grid item xs={2}>
//                   {m.mnc ? "Yes" : "No"}
//                 </Grid>
//               </Grid>
//             );
//           })}
//         </>
//       )}
//       <br />
//       <br />
//       <AddModule update={updateModules} />
//     </App>
//   );
// }

// export default Modules;

// UN COMMENT THIS CODE TO SEE IMPORVED UI USING mockAPI.js (COMMENT CODE ABOVE)

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
// import AddModule from "./AddModule";
// import { getModules, deleteModule } from "../mockApi"; // Import Mock API functions

// function Modules() {
//   const [modules, setModules] = React.useState([]);
//   const [error, setError] = React.useState(null);
//   const [moduleToEdit, setModuleToEdit] = React.useState(null);

//   // Fetch the modules when the component mounts
//   React.useEffect(() => {
//     updateModules();
//   }, []);

//   // Function to fetch modules from the mock API
//   function updateModules() {
//     getModules()
//       .then((data) => {
//         setModules(data); // Set the fetched modules
//         setError(null); // Clear any errors
//       })
//       .catch((response) => {
//         setError(response.message); // Display API error
//       });
//   }

//   // Function to handle editing a module
//   function handleEdit(module) {
//     setModuleToEdit(module); // Pass the module to AddModule for editing
//   }

//   // Function to handle deleting a module
//   function handleDelete(moduleCode) {
//     deleteModule(moduleCode)
//       .then(() => {
//         updateModules(); // Refresh the module list after deletion
//       })
//       .catch((response) => {
//         setError(response.message); // Display any API error during deletion
//       });
//   }

//   return (
//     <App>
//       <Breadcrumbs sx={{ marginBottom: "30px" }}>
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//         <Typography sx={{ color: "text.primary" }}>Modules</Typography>
//       </Breadcrumbs>
//       {error && <Alert severity="error">{error}</Alert>}
//       {!error && modules.length < 1 && (
//         <Alert severity="warning">No modules available.</Alert>
//       )}
//       {modules.length > 0 && (
//         <Table component={Paper} sx={{ marginTop: "20px" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Module Code</TableCell>
//               <TableCell>Module Name</TableCell>
//               <TableCell>Is MNC</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {modules.map((m) => (
//               <TableRow key={m.code}>
//                 <TableCell>{m.code}</TableCell>
//                 <TableCell>{m.name}</TableCell>
//                 <TableCell>{m.mnc ? "Yes" : "No"}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     onClick={() => handleEdit(m)}
//                     sx={{ marginRight: "8px" }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     color="error"
//                     onClick={() => handleDelete(m.code)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//       <AddModule update={updateModules} moduleToEdit={moduleToEdit} />
//     </App>
//   );
// }

// export default Modules;

