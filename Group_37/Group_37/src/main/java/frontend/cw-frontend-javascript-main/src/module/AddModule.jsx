import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { API_ENDPOINT } from "../config";
import { useTheme } from "../App";
import "../styles/modules.css";
import { ReplyTwoTone } from "@mui/icons-material";

function AddModule({ update, moduleToEdit, clearEdit }) {
  const [module, setModule] = useState(moduleToEdit || {});
  const [error, setError] = useState(null);

  const { isDarkMode, toggleTheme } = useTheme();
  console.log('isDarkMode in AddStudents:', isDarkMode);

  useEffect(() => {
    if (moduleToEdit) {
      setModule(moduleToEdit);
    } else {
      setModule({});
    }
  }, [moduleToEdit]);

  const handleInputChange = (field, value) => {
    setModule({ ...module, [field]: value });
    setError(null);
  };

  const handleSubmit = () => {
    // Validate module code
    if (!module.code) {
      setError("Module code is required.");
      return;
    }
  
    // Validate module name
    if (!module.name) {
      setError("Module name is required.");
      return;
    }
  
    // Error handling function
    const handleError = (err) => {
      if (err.response?.status === 409) {
        setError("Module code already exists.");
      } else {
        setError(err.response?.data?.error || "Failed to add module.");
      }
    };
  
    // Check if module is being edited or created
    if (moduleToEdit) {
      axios
        .patch(`${API_ENDPOINT}/modules/${module.id}`, module)
        .then(() => {
          update(); // Call the update function
          clearEdit(); // Clear the edit state
        })
        .catch(handleError);
    } else {
      axios
        .post(`${API_ENDPOINT}/modules`, module)
        .then(() => {
          update(); // Call the update function
          setModule({}); // Reset the module state
        })
        .catch(handleError);
    }
  };
  

  return (
    <Paper className={`paper ${isDarkMode ? 'paper-dark' : 'paper-light'}`}>
      <Typography className={isDarkMode ? "header-dark" : "header-light"}
        sx={{ marginBottom: "16px" }}>
        {moduleToEdit ? "Edit Module" : "Add Module"}
      </Typography>
      <br />
      <TextField
        label="Module Code"
        value={module.code || ""}
        onChange={(e) => handleInputChange("code", e.target.value)}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Module Name"
        value={module.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        fullWidth
        className={isDarkMode ? "input-dark" : "input-light"}
        sx={{ marginBottom: "16px" }}
      />
      <FormControlLabel
        className={isDarkMode ? "form-control-label-dark" : "form-control-label-light"}
        control={
          <Switch
            checked={module.mnc ?? false}
            onChange={(e) => handleInputChange("mnc", e.target.checked)}
          />
        }
        label="MNC?"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className={isDarkMode ? "button-dark" : "button-light"}
      >
        {moduleToEdit ? "Edit Module" : "Add Module"}
      </Button>
      {moduleToEdit && (
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
        <Alert severity="error" sx={{ marginTop: "16px" }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}

export default AddModule
