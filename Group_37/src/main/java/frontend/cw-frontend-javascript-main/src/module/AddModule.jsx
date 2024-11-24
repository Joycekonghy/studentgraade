import React from "react";
import axios from "axios";
import {
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { API_ENDPOINT } from "../config";

function AddModule(props) {
  const [module, setModule] = React.useState({});
  const [error, setError] = React.useState();

  function request() {
    axios
      .post(`${API_ENDPOINT}/modules`, module)
      .then(() => {
        props.update();
      })
      .catch((response) => {
        setError(response.message);
      });
  }

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">Add/Update Module</Typography>
      <br />
      <TextField
        label="Module Code"
        onChange={(e) => {
          setModule({ ...module, code: e.target.value.toUpperCase() });
        }}
      />
      <TextField
        label="Module Name"
        onChange={(e) => {
          setModule({ ...module, name: e.target.value });
        }}
      />
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={module.mnc ?? false}
            id="is_mnc"
            onChange={(e) => {
              setModule({ ...module, mnc: e.target.checked });
            }}
          />
        }
        label="MNC?"
      />
      <br />
      <Button onClick={request}>Add/Update</Button>
      <br />
      <br />
      {error && <Alert color="error">{error}</Alert>}
    </Paper>
  );
}

export default AddModule;

// UN COMMENT THIS CODE TO SEE IMPORVED UI USING MOCK API (COMMENT CODE AHOVE)

// import React from "react";
// import { Paper, TextField, Switch, FormControlLabel, Button, Typography, Alert } from "@mui/material";
// import { addModule, updateModule } from "../mockApi"; // Mock API functions for Add and Update

// function AddModule({ update, moduleToEdit }) {
//   const [module, setModule] = React.useState(moduleToEdit || {});
//   const [error, setError] = React.useState(null);

//   // Populate the form if moduleToEdit changes (Edit functionality)
//   React.useEffect(() => {
//     if (moduleToEdit) {
//       setModule(moduleToEdit);
//     } else {
//       setModule({});
//     }
//   }, [moduleToEdit]);

//   function request() {
//     // Validate the form input
//     if (!module.code || !module.name) {
//       setError("Module Code and Name are required.");
//       return;
//     }

//     // Use addModule or updateModule based on whether editing or adding
//     const apiFunction = moduleToEdit ? updateModule : addModule;
//     apiFunction(module)
//       .then(() => {
//         update(); // Refresh the module list after adding/updating
//         setModule({}); // Reset the form
//         setError(null); // Clear any errors
//       })
//       .catch((response) => {
//         setError(response.message); // Display any API errors
//       });
//   }

//   return (
//     <Paper sx={{ padding: "30px", marginTop: "20px" }}>
//       <Typography variant="h5">Add/Update Module</Typography>
//       <br />
//       <TextField
//         label="Module Code"
//         value={module.code || ""}
//         onChange={(e) => setModule({ ...module, code: e.target.value.toUpperCase() })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <TextField
//         label="Module Name"
//         value={module.name || ""}
//         onChange={(e) => setModule({ ...module, name: e.target.value })}
//         fullWidth
//         sx={{ marginBottom: "16px" }}
//       />
//       <FormControlLabel
//         control={
//           <Switch
//             checked={module.mnc || false}
//             onChange={(e) => setModule({ ...module, mnc: e.target.checked })}
//           />
//         }
//         label="Mandatory Non-Condonable"
//       />
//       <br />
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

// export default AddModule;

