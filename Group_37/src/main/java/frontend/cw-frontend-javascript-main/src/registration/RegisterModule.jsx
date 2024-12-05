import React, { useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { API_ENDPOINT } from "../config";
import { useTheme } from "../App";
import "../styles/registration.css";

function RegisterModule(props) {
  const [registration, setRegistration] = useState({});
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");

  const { isDarkMode, toggleTheme } = useTheme();
  console.log('isDarkMode in RegisterModule:', isDarkMode);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching students and modules...");
        const [studentsRes, modulesRes] = await Promise.all([
          axios.get(`${API_ENDPOINT}/students`),
          axios.get(`${API_ENDPOINT}/modules`)
        ]);

        setStudents(studentsRes.data._embedded?.students || []);
        setModules(modulesRes.data._embedded?.modules || []);
        setError("");
      } catch (err) {
        const errorMessage = err.code === "ERR_NETWORK"
          ? "Could not connect to server. Please check if the server is running."
          : "Failed to fetch data. Please try again.";
        setError(errorMessage);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleRegisterModule = async () => {
    if (!registration.student_id || !registration.module_id) {
      setError("Please select both a student and a module");
      return;
    }

    try {
      const payload = {
        student_id: Number(registration.student_id),
        module_id: Number(registration.module_id),
      };

      await axios.post(`${API_ENDPOINT}/registrations/registerModules`, payload);
      setRegistration({});  // Clear the form
      setError("");
      props.update(); // Update parent component
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to register module";
      setError(String(errorMessage));
      console.error("Error registering module:", err);
    }
  };

  return (
    <Paper
      className={`register-module-form-container ${isDarkMode ? 'paper-dark' : 'paper-light'}`}>
      <Typography variant="h5" className={isDarkMode ? "header-dark" : "header-light"}
        sx={{ marginBottom: "16px" }}>Register module</Typography>
      {error && <Alert severity="error" className="error-alert">{error}</Alert>}

      <div className="register-controls">
        <div className="select-group">
          <div className="select-wrapper">
            <Select
              value={registration.student_id ?? ""}
              onChange={(e) => setRegistration({ ...registration, student_id: e.target.value })}
              displayEmpty
              className={`register-select ${isDarkMode ? 'paper-dark' : 'paper-light'}`}
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
          </div>

          <div className="select-wrapper">
            <Select
              value={registration.module_id ?? ""}
              onChange={(e) => setRegistration({ ...registration, module_id: e.target.value })}
              displayEmpty
              className="register-select"
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
          </div>
        </div>

        <button onClick={handleRegisterModule} className={isDarkMode ? "button-dark" : "button-light"}>
          REGISTER
        </button>
      </div>
    </Paper>
  );
}

export default RegisterModule;
