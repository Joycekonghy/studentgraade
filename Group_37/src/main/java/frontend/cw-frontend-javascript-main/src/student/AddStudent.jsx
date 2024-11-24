import React from "react";
import axios from "axios";
import { Paper, TextField, Button, Typography, Alert } from "@mui/material";
import { API_ENDPOINT } from "../config";

function AddStudent(props) {
  const [student, setStudent] = React.useState({});
  const [error, setError] = React.useState();

  function request() {
    axios
      .post(`${API_ENDPOINT}/students`, student)
      .then(() => {
        props.update();
      })
      .catch((response) => {
        setError(response.message);
      });
  }

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">Add/Update Student</Typography>
      <br />
      <TextField
        label="Student ID"
        onChange={(e) => {
          setStudent({ ...student, id: Number(e.target.value) });
        }}
      />
      <TextField
        label="Username"
        onChange={(e) => {
          setStudent({ ...student, username: e.target.value });
        }}
      />
      <TextField
        label="email"
        onChange={(e) => {
          setStudent({ ...student, email: e.target.value });
        }}
      />
      <br />
      <br />
      <TextField
        label="First Name"
        onChange={(e) => {
          setStudent({ ...student, firstName: e.target.value });
        }}
      />
      <TextField
        label="Last Name"
        onChange={(e) => {
          setStudent({ ...student, lastName: e.target.value });
        }}
      />
      <br />
      <br />
      <Button onClick={request}>Add/Update</Button>
      <br />
      <br />
      {error && <Alert color="error">{error}</Alert>}
    </Paper>
  );
}

export default AddStudent;

// UN COMMENT THIS CODE TO SEE IMPORVED UI USING mockApiStudents.js (COMMENT CODE ABOVE)

// import React from "react";
// import { Paper, TextField, Button, Typography, Alert } from "@mui/material";
// import { addStudent, updateStudent } from "../mockApiStudents";

// function AddStudent({ update, studentToEdit }) {
//   const [student, setStudent] = React.useState(studentToEdit || {});
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     if (studentToEdit) {
//       setStudent(studentToEdit);
//     } else {
//       setStudent({});
//     }
//   }, [studentToEdit]);

//   function request() {
//     if (!student.firstName || !student.lastName || !student.email) {
//       setError("All fields are required.");
//       return;
//     }

//     const apiFunction = studentToEdit ? updateStudent : addStudent;
//     apiFunction(student)
//       .then(() => {
//         update();
//         setStudent({});
//         setError(null);
//       })
//       .catch((err) => setError(err.message));
//   }

//   return (
//     <Paper sx={{ padding: "30px", marginTop: "20px" }}>
//       <Typography variant="h5">Add/Update Student</Typography>
//       <br />
//       <TextField
//         label="First Name"
//         value={student.firstName || ""}
//         onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <TextField
//         label="Last Name"
//         value={student.lastName || ""}
//         onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <TextField
//         label="Email"
//         value={student.email || ""}
//         onChange={(e) => setStudent({ ...student, email: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <TextField
//         label="Username"
//         value={student.username || ""}
//         onChange={(e) => setStudent({ ...student, username: e.target.value })}
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

// export default AddStudent;
