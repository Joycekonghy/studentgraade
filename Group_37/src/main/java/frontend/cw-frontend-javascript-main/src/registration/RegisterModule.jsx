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

function RegisterModule(props) {
  const [registration, setRegistration] = React.useState({});
  const [students, setStudents] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => setStudents(response.data._embedded.students))
      .catch((err) => setError("Failed to fetch students"));

    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => setModules(response.data._embedded.modules))
      .catch((err) => setError("Failed to fetch modules"));
  }, []);

  const handleRegisterModule = () => {
    // Ensure the IDs are converted to numbers before sending
    const payload = {
      ...registration,
      student_id: Number(registration.student_id),
      module_id: Number(registration.module_id),
    };

    axios
      .post(`${API_ENDPOINT}/registrations/registerModules`, payload)
      .then(() => {
        props.update(); // Refresh the grades table
        setRegistration({}); // Clear the form
        setError(""); // Clear errors
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to register module");
      });
  };

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">Register module </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <br />
      <Select
        sx={{ minWidth: "300px" }}
        value={registration.student_id ?? ""}
        onChange={(e) => setRegistration({ ...registration, student_id: e.target.value })}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Student
        </MenuItem>
        {students.map((student) => (
          <MenuItem key={student.id} value={student.id}>
            {`${student.firstName} ${student.lastName} (${student.id})`}
          </MenuItem>
        ))}
      </Select>
      <Select
        sx={{ minWidth: "300px", marginLeft: "10px" }}
        value={registration.module_id ?? ""}
        onChange={(e) => setRegistration({ ...registration, module_id: e.target.value })}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Module
        </MenuItem>
        {modules.map((module) => (
          <MenuItem key={module.id} value={module.id}>
            {`${module.code} ${module.name}`}
          </MenuItem>
        ))}
      </Select>
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={handleRegisterModule}
      >
        Register
      </Button>
    </Paper>
  );
}

export default RegisterModule;



// import React from "react";
// import axios from "axios";
// import {
//   Paper,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   TextField,
//   Alert,
// } from "@mui/material";
// import { API_ENDPOINT } from "../config";

// function AddGrade(props) {
//   const [grade, setGrade] = React.useState({});
//   const [students, setStudents] = React.useState([]);
//   const [modules, setModules] = React.useState();
//   const [error, setError] = React.useState();

//   React.useEffect(() => {
//     axios
//       .get(`${API_ENDPOINT}/students`)
//       .then((response) => {
//         setStudents(response.data._embedded.students);
//       })
//       .catch((response) => setError(response.message));

//     axios
//       .get(`${API_ENDPOINT}/modules`)
//       .then((response) => setModules(response.data._embedded.modules))
//       .catch((response) => setError(response.message));
//   }, []);

//   function request() {
//     axios
//       .post(`${API_ENDPOINT}/grades/addGrades`, grade)
//       .then(() => {
//         props.update();
//       })
//       .catch((response) => {
//         setError(response.message);
//       });
//   }

//   return (
//     <Paper sx={{ padding: "30px" }}>
//       <Typography variant="h5">Add Grade</Typography>
//       <br />
//       <br />
//       <Select
//         sx={{ minWidth: "300px" }}
//         value={grade.student_id ?? ""}
//         onChange={(e) => setGrade({ ...grade, student_id: e.target.value })}
//         label="Student"
//       >
//         {students &&
//           students.map((s) => {
//             return (
//               <MenuItem
//                 key={s.id}
//                 value={s.id}
//               >{`${s.firstName} ${s.lastName} (${s.id})`}</MenuItem>
//             );
//           })}
//       </Select>
//       <Select
//         sx={{ minWidth: "300px" }}
//         value={grade.module_id ?? ""}
//         onChange={(e) => setGrade({ ...grade, module_id: e.target.value })}
//         label="Module"
//       >
//         {modules &&
//           modules.map((m) => {
//             return (
//               <MenuItem
//                 key={m.id}
//                 value={m.id}
//               >{`${m.code} ${m.name}(${m.id})`}</MenuItem>
//             );
//           })}
//       </Select>
//       <TextField
//         label="Score"
//         value={grade.score ?? 0}
//         onChange={(e) => setGrade({ ...grade, score: parseInt(e.target.value, 10) })}
//       />
//       <br />
//       <br />
//       <Button onClick={request}>Add</Button>
//       <br />
//       <br />
//       {error && <Alert color="error">{error}</Alert>}
//     </Paper>
//   );
// }

// export default AddGrade;

