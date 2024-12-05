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
    if (!module.code || !module.name) {
      setError("All fields are required.");
      return;
    }

    if (moduleToEdit) {
      axios
        .patch(`${API_ENDPOINT}/modules/${module.id}`, module)
        .then(() => {
          update();
          clearEdit();
        })
        .catch((err) => {
          setError(err.response?.data?.error || "Failed to update module.");
        });
    } else {
      axios
        .post(`${API_ENDPOINT}/modules`, module)
        .then(() => {
          update();
          setModule({});
        })
        .catch((err) => {
          setError(err.response?.data?.error || "Failed to add module.");
        });
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

export default AddModule;
