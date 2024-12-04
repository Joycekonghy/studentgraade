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

function AddModule({ update, moduleToEdit, clearEdit }) {
  const [module, setModule] = useState(moduleToEdit || {});
  const [error, setError] = useState(null);

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
    <Paper sx={{ padding: "30px" }}>
      <Typography variant="h5">
        {moduleToEdit ? "Edit Module" : "Add Module"}
      </Typography>
      <br />
      <TextField
        label="Module Code"
        value={module.code || ""}
        onChange={(e) => handleInputChange("code", e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Module Name"
        value={module.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <FormControlLabel
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
        sx={{ marginTop: "16px", marginRight: "16px" }}
      >
        {moduleToEdit ? "Edit Module" : "Add Module"}
      </Button>
      {moduleToEdit && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearEdit}
          sx={{ marginTop: "16px" }}
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
