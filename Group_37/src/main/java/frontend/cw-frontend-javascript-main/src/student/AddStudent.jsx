import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, TextField, Button, Typography, Alert } from "@mui/material"; // Material UI components
import { API_ENDPOINT } from "../config";

function AddStudent({ update, studentToEdit, clearEdit }) {
  // State to hold form data for the student
  const [student, setStudent] = useState(studentToEdit || {});
  // State to manage form errors
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update the form when `studentToEdit` changes
    if (studentToEdit) {
      setStudent(studentToEdit); // Populate the form with the student's data if editing
    } else {
      setStudent({}); // Clear the form when adding a new student
    }
  }, [studentToEdit]);

  const handleInputChange = (field, value) => {
    // Update the corresponding field in the student object
    setStudent({ ...student, [field]: value });
    setError(null); // Clear any existing error messages
  };

  const handleSubmit = () => {
    // Validate that required fields are not empty
    if (!student.firstName || !student.lastName || !student.email) {
      setError("All fields are required."); // Show an error message
      return;
    }

    if (studentToEdit) {
      // Update an existing student
      axios
        .patch(`${API_ENDPOINT}/students/${student.id}`, student)
        .then(() => {
          update(); // Refresh the students list
          clearEdit(); // Clear the form and editing state
        })
        .catch((err) => {
          // Handle errors from the API call
          setError(err.response?.data?.error || "Failed to update student.");
        });
    } else {
      // Add a new student
      axios
        .post(`${API_ENDPOINT}/students`, student)
        .then(() => {
          update(); // Refresh the students list
          setStudent({}); // Reset the form
        })
        .catch((err) => {
          // Handle errors from the API call
          setError(err.response?.data?.error || "Failed to add student.");
        });
    }
  };

  return (
    <Paper sx={{ padding: "30px" }}>
      {/* Title changes based on whether adding or editing */}
      <Typography variant="h5">
        {studentToEdit ? "Edit Student" : "Add Student"}
      </Typography>
      <br />
      {/* Form fields for student details */}
      <TextField
        label="Student ID"
        value={student.id || ""}
        onChange={(e) => handleInputChange("id", e.target.value)}
        disabled={!!studentToEdit} // ID field is read-only when editing
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
      {/* Submit button to handle form submission */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: "16px", marginRight: "16px" }}
      >
        {studentToEdit ? "Edit Student" : "Add Student"} {/* Dynamic button label */}
      </Button>
      {/* Cancel button only shown when editing */}
      {studentToEdit && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearEdit} // Clear the editing state
          sx={{ marginTop: "16px" }}
        >
          Cancel
        </Button>
      )}
      {/* Display error messages, if any */}
      {error && (
        <Alert severity="error" sx={{ marginTop: "16px" }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}

export default AddStudent;
