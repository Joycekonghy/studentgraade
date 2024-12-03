import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, TextField, Button, Typography, Alert } from "@mui/material";
import { API_ENDPOINT } from "../config";

function AddStudent({ update, studentToEdit, clearEdit }) {
  const [student, setStudent] = useState(studentToEdit || {});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Populate the form with the student to edit, or reset if adding a new student
    if (studentToEdit) {
      setStudent(studentToEdit);
    } else {
      setStudent({});
    }
  }, [studentToEdit]);

  const handleInputChange = (field, value) => {
    setStudent({ ...student, [field]: value });
    setError(null); // Clear the error state
  };

  const handleSubmit = () => {
    if (!student.firstName || !student.lastName || !student.email) {
      setError("All fields are required.");
      return;
    }

    if (studentToEdit) {
      // Edit existing student
      axios
        .patch(`${API_ENDPOINT}/students/${student.id}`, student)
        .then(() => {
          update(); // Update the students list
          clearEdit(); // Reset the form
        })
        .catch((err) => {
          setError(err.response?.data?.error || "Failed to update student.");
        });
    } else {
      // Add new student
      axios
        .post(`${API_ENDPOINT}/students`, student)
        .then(() => {
          update(); // Update the students list
          setStudent({}); // Reset the form
        })
        .catch((err) => {
          setError(err.response?.data?.error || "Failed to add student.");
        });
    }
  };

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">{studentToEdit ? "Edit Student" : "Add Student"}</Typography>
      <br />
      <TextField
        label="Student ID"
        value={student.id || ""}
        onChange={(e) => handleInputChange("id", e.target.value)}
        disabled={!!studentToEdit} // Disable editing ID when editing a student
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Username"
        value={student.username || ""}
        onChange={(e) => handleInputChange("username", e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Email"
        value={student.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="First Name"
        value={student.firstName || ""}
        onChange={(e) => handleInputChange("firstName", e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Last Name"
        value={student.lastName || ""}
        onChange={(e) => handleInputChange("lastName", e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: "16px", marginRight: "16px" }}
      >
        {studentToEdit ? "Edit Student" : "Add Student"}
      </Button>
      {studentToEdit && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearEdit}
          sx={{ marginTop: "16px" }}
        >
          Cancel
        </Button>
      )}
      {error && <Alert severity="error" sx={{ marginTop: "16px" }}>{error}</Alert>}
    </Paper>
  );
}

export default AddStudent;
