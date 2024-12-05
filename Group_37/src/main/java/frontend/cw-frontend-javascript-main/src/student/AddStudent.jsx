import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, TextField, Button, Typography, Alert } from "@mui/material";
import { API_ENDPOINT } from "../config";
import { useTheme } from "../App";
import "../styles/students.css";

function AddStudent({ update, studentToEdit, clearEdit }) {
  const [student, setStudent] = useState(studentToEdit || {});
  const [error, setError] = useState(null);

  const { isDarkMode, toggleTheme } = useTheme();
  console.log('isDarkMode in AddStudents:', isDarkMode);


  useEffect(() => {
    if (studentToEdit) {
      setStudent(studentToEdit);
    } else {
      setStudent({});
    }
  }, [studentToEdit]);

  const handleInputChange = (field, value) => {
    setStudent({ ...student, [field]: value });
    setError(null);
  };

  const handleSubmit = () => {
    // Validation checks
    if (!student.id) {
      setError("Student ID is required.");
      return;
    }
    if (!student.firstName) {
      setError("First name is required.");
      return;
    }
    if (!student.lastName) {
      setError("Last name is required.");
      return;
    }
    if (!student.email) {
      setError("Email is required.");
      return;
    }
    if (!student.username) {
      setError("Username is required.");
      return;
    }
  
    const handleError = (err) => {
      if (err.response?.status === 409) {
        setError("Student username or email already exists.");
      } else {
        setError(err.response?.data?.error || "Failed to add student.");
      }
    };
  
    if (studentToEdit) {
      // Update existing student
      axios
        .patch(`${API_ENDPOINT}/students/${student.id}`, student)
        .then(() => {
          update();
          clearEdit();
        })
        .catch(handleError);
    } else {
      // Add new student
      axios
        .post(`${API_ENDPOINT}/students`, student)
        .then(() => {
          update();
          setStudent({});
        })
        .catch(handleError);
    }
  };
  

  return (
    <Paper
      className={`paper ${isDarkMode ? 'paper-dark' : 'paper-light'}`}
    >
      <Typography variant="h5"
        className={isDarkMode ? "header-dark" : "header-light"}
        sx={{ marginBottom: "16px" }}>
        {studentToEdit ? "Edit Student" : "Add Student"}
      </Typography>
      <TextField
        label="Student ID"
        value={student.id || ""}
        onChange={(e) => handleInputChange("id", e.target.value)}
        disabled={!!studentToEdit}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Username"
        value={student.username || ""}
        onChange={(e) => handleInputChange("username", e.target.value)}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Email"
        value={student.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="First Name"
        value={student.firstName || ""}
        onChange={(e) => handleInputChange("firstName", e.target.value)}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Last Name"
        value={student.lastName || ""}
        onChange={(e) => handleInputChange("lastName", e.target.value)}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={isDarkMode ? "button-dark" : "button-light"}
      >
        {studentToEdit ? "Edit Student" : "Add Student"}
      </Button>
      {studentToEdit && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearEdit}
          className={isDarkMode ? "button-dark" : "button-light"}
        >
          Cancel
        </Button>
      )}
      {error && (
        <Alert severity="error" className={isDarkMode ? "alert-dark" : "alert-light"}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}

export default AddStudent;

