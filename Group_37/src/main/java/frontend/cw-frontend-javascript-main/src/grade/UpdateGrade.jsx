import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import { API_ENDPOINT } from "../config";

function UpdateGrade({ grade, onClose, onUpdate }) {
  const [score, setScore] = useState(grade.score);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    axios
      .put(`${API_ENDPOINT}/grades/${grade.id}`, { score })
      .then(() => {
        onUpdate(); // Refresh the grades in the parent component
        onClose(); // Close the modal
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to update grade.");
      });
  };

  return (
    <Modal open={!!grade} onClose={onClose}>
      <Box sx={{ margin: "auto", padding: 4, maxWidth: 400, background: "white" }}>
        <Typography variant="h6">Update Grade</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Score"
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          fullWidth
          sx={{ marginY: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ marginRight: 2 }}>
          Save
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default UpdateGrade;
