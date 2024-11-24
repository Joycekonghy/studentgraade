import React from "react";
import axios from "axios";
import {
  Paper,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import { API_ENDPOINT } from "../config";

function AddGrade(props) {
  const [grade, setGrade] = React.useState({});
  const [students, setStudents] = React.useState([]);
  const [modules, setModules] = React.useState();
  const [error, setError] = React.useState();

  React.useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        setStudents(response.data._embedded.students);
      })
      .catch((response) => setError(response.message));

    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => setModules(response.data._embedded.modules))
      .catch((response) => setError(response.message));
  }, []);

  function request() {
    axios
      .post(`${API_ENDPOINT}/grades/addGrade`, grade)
      .then(() => {
        props.update();
      })
      .catch((response) => {
        setError(response.message);
      });
  }

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">Add Grade</Typography>
      <br />
      <br />
      <Select
        sx={{ minWidth: "300px" }}
        value={grade.student_id ?? ""}
        onChange={(e) => setGrade({ ...grade, student_id: e.target.value })}
        label="Student"
      >
        {students &&
          students.map((s) => {
            return (
              <MenuItem
                key={s.id}
                value={s.id}
              >{`${s.firstName} ${s.lastName} (${s.id})`}</MenuItem>
            );
          })}
      </Select>
      <Select
        sx={{ minWidth: "300px" }}
        value={grade.module_code ?? ""}
        onChange={(e) => setGrade({ ...grade, module_code: e.target.value })}
        label="Module"
      >
        {modules &&
          modules.map((m) => {
            return (
              <MenuItem
                key={m.code}
                value={m.code}
              >{`${m.code} ${m.name}`}</MenuItem>
            );
          })}
      </Select>
      <TextField
        label="Score"
        value={grade.score ?? 0}
        onChange={(e) => setGrade({ ...grade, score: e.target.value })}
      />
      <br />
      <br />
      <Button onClick={request}>Add</Button>
      <br />
      <br />
      {error && <Alert color="error">{error}</Alert>}
    </Paper>
  );
}

export default AddGrade;

// UN COMMENT THIS CODE TO SEE IMPORVED UI USING mockApiGrades.js (COMMENT CODE ABOVE)

// import React from "react";
// import { Paper, TextField, Button, Typography, Alert } from "@mui/material";
// import { addGrade, updateGrade } from "../mockApiGrades";

// function AddGrade({ update, gradeToEdit }) {
//   const [grade, setGrade] = React.useState(gradeToEdit || {});
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     if (gradeToEdit) {
//       setGrade(gradeToEdit);
//     } else {
//       setGrade({});
//     }
//   }, [gradeToEdit]);

//   function request() {
//     if (!grade.studentId || !grade.moduleCode || grade.score === undefined) {
//       setError("All fields are required.");
//       return;
//     }

//     const apiFunction = gradeToEdit ? updateGrade : addGrade;
//     apiFunction(grade)
//       .then(() => {
//         update();
//         setGrade({});
//         setError(null);
//       })
//       .catch((err) => setError(err.message));
//   }

//   return (
//     <Paper sx={{ padding: "30px", marginTop: "20px" }}>
//       <Typography variant="h5">Add/Update Grade</Typography>
//       <br />
//       <TextField
//         label="Student ID"
//         value={grade.studentId || ""}
//         onChange={(e) => setGrade({ ...grade, studentId: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <TextField
//         label="Module Code"
//         value={grade.moduleCode || ""}
//         onChange={(e) => setGrade({ ...grade, moduleCode: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <TextField
//         label="Score"
//         type="number"
//         value={grade.score || ""}
//         onChange={(e) => setGrade({ ...grade, score: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={request}
//         sx={{ marginTop: "16px" }}
//       >
//         Submit
//       </Button>
//       {error && <Alert severity="error" sx={{ marginTop: "16px" }}>{error}</Alert>}
//     </Paper>
//   );
// }

// export default AddGrade;
