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
} from "@mui/material"; // Material UI components
import { API_ENDPOINT } from "../config";

function AddGrade(props) {
  // State to manage form data for a grade
  const [grade, setGrade] = React.useState({});
  // State to store the list of students and modules
  const [students, setStudents] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  // State to manage error messages
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // Fetch students data from the API
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => setStudents(response.data._embedded.students)) // Save students to state
      .catch((err) => setError("Failed to fetch students")); // Set error on failure

    // Fetch modules data from the API
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => setModules(response.data._embedded.modules)) // Save modules to state
      .catch((err) => setError("Failed to fetch modules")); // Set error on failure
  }, []); // Empty dependency array ensures this runs once on component mount
  
  const validateAndSubmit = () => {
    // Validate that required fields are not empty
    if (grade.score<0 || grade.score>100) {
      setError("Score must be between 0 and 100."); // Show an error message
      return;


    }
    setError(""); // Clear any existing error messages
    request(); // Submit the form
  };
  const handleAddGrade = () => {
    // Prepare the payload, ensuring IDs are converted to numbers
    const payload = {
      ...grade,
      student_id: Number(grade.student_id),
      module_id: Number(grade.module_id),
    };

    // Send a POST request to add the grade
    axios
      .post(`${API_ENDPOINT}/grades/addGrades`, payload)
      .then(() => {
        props.update(); // Refresh the grades table
        setGrade({}); // Clear the form
        setError(""); // Clear any existing errors
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to add grade"); // Handle API errors
      });
  };

  return (
    <Paper sx={{ padding: "30px" }}> {/* Container for the form */}
      <Typography variant="h5">Add Grade</Typography> {/* Form heading */}
      {error && <Alert severity="error">{error}</Alert>} {/* Display errors if any */}
      <br />
      {/* Select dropdown for choosing a student */}
      <Select
        sx={{ minWidth: "300px" }}
        value={grade.student_id ?? ""} // Controlled value
        onChange={(e) => setGrade({ ...grade, student_id: e.target.value })} // Update state
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Student
        </MenuItem>
        {students.map((student) => ( // Render students as dropdown options
          <MenuItem key={student.id} value={student.id}>
            {`${student.firstName} ${student.lastName} (${student.id})`}
          </MenuItem>
        ))}
      </Select>
      {/* Select dropdown for choosing a module */}
      <Select
        sx={{ minWidth: "300px", marginLeft: "10px" }}
        value={grade.module_id ?? ""} // Controlled value
        onChange={(e) => setGrade({ ...grade, module_id: e.target.value })} // Update state
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Module
        </MenuItem>
        {modules.map((module) => ( // Render modules as dropdown options
          <MenuItem key={module.id} value={module.id}>
            {`${module.code} ${module.name}`}
          </MenuItem>
        ))}
      </Select>
      <br />
      {/* Input field for entering the grade score */}
      <TextField
        sx={{ marginTop: "15px", minWidth: "620px" }}
        label="Score"
        type="number" // Number input for scores
        value={grade.score ?? ""} // Controlled value
        onChange={(e) => setGrade({ ...grade, score: Number(e.target.value) })} // Update state
      />
      <br />
      {/* Submit button */}
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={validateAndSubmit} // Handle form submission
      >
        Add
      </Button>
    </Paper>
  );
}

export default AddGrade;



