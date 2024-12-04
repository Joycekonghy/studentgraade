import React, { useState, useEffect } from "react";
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
  const [grade, setGrade] = useState({});
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch students and modules data
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => setStudents(response.data._embedded.students))
      .catch((err) => setError("Failed to fetch students"));

    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => setModules(response.data._embedded.modules))
      .catch((err) => setError("Failed to fetch modules"));
  }, []);

  const handleAddGrade = () => {
    // Validate that required fields are not empty
    if (!grade.student_id || !grade.module_id) {
      setError("Please select both a student and a module");
      return;
    }

    // Validate score
    if (grade.score < 0 || grade.score > 100) {
      setError("Score must be between 0 and 100.");
      return;
    }

    // Prepare the payload
    const payload = {
      student_id: Number(grade.student_id),
      module_id: Number(grade.module_id),
      score: Number(grade.score)
    };

    // Send POST request to add the grade
    axios
      .post(`${API_ENDPOINT}/grades/addGrades`, payload)
      .then(() => {
        props.update(); // Refresh the grades table
        setGrade({}); // Clear the form
        setError(""); // Clear any existing errors
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to add grade");
      });
  };

  return (
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">Add Grade</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <br />
      <Select
        sx={{ minWidth: "300px" }}
        value={grade.student_id ?? ""}
        onChange={(e) => setGrade({ ...grade, student_id: e.target.value })}
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
        value={grade.module_id ?? ""}
        onChange={(e) => setGrade({ ...grade, module_id: e.target.value })}
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
      <br />
      <TextField
        sx={{ marginTop: "15px", minWidth: "620px" }}
        label="Score"
        type="number"
        value={grade.score ?? ""}
        onChange={(e) => setGrade({ ...grade, score: Number(e.target.value) })}
      />
      <br />
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={handleAddGrade}
      >
        Add
      </Button>
    </Paper>
  );
}

export default AddGrade;