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
        props.update(); // Call the update function on success
      })
      .catch((error) => {
        // Check if the error has a response from the server
        if (error.response && error.response.data) {
          setError(error.response.data.error); // Use the custom error message from the backend
        } else {
          setError("An unexpected error occurred."); // Fallback for unexpected errors
        }
      });
  }
  function handleInputChange(field, value) {
    setStudent({ ...student, [field]: value });
    setError(""); // Clear the error state
  }

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">Add/Update Student</Typography>
      <br />
      <TextField
        label="Student ID"
        onChange={(e) => handleInputChange("id", Number(e.target.value))}
      />
      <TextField
        label="Username"
        onChange={(e) => handleInputChange("username", e.target.value)}
      />
      <TextField
        label="email"
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="First Name"
        onChange={(e) => handleInputChange("firstName", e.target.value)}
      />
      <TextField
        label="Last Name"
        onChange={(e) => handleInputChange("lastName", e.target.value)}
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
