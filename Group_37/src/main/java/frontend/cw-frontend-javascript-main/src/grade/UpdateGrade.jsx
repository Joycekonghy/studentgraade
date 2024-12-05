import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINT } from "../config";

function UpdateGrade({ grade, onClose, onUpdate }) {
  const [components, setComponents] = useState([
    {
      name: grade.componentType || '',
      weight: grade.weight || '',
      score: grade.score || ''
    }
  ]);
  const [error, setError] = useState(null);

  const calculateTotalWeight = () => {
    return components.reduce((sum, comp) => sum + (Number(comp.weight) || 0), 0);
  };

  const handleComponentChange = (index, field, value) => {
    const newComponents = [...components];
    newComponents[index][field] = value;
    setComponents(newComponents);
  };

  const addComponent = () => {
    if (calculateTotalWeight() < 100) {
      setComponents([...components, { name: '', score: '', weight: '' }]);
    }
  };

  const removeComponent = (index) => {
    if (components.length > 1) {
      setComponents(components.filter((_, i) => i !== index));
    }
  };

  const validateComponents = () => {
    // Check if all fields are filled
    const allFilled = components.every(comp => 
      comp.name && comp.score && comp.weight
    );
    if (!allFilled) {
      setError("All component fields must be filled");
      return false;
    }

    // Check if scores are between 0 and 100
    const validScores = components.every(comp => 
      Number(comp.score) >= 0 && Number(comp.score) <= 100
    );
    if (!validScores) {
      setError("All scores must be between 0 and 100");
      return false;
    }

    // Check if weights sum to 100
    const totalWeight = calculateTotalWeight();
    if (totalWeight !== 100) {
      setError(`Total weight must be 100% (currently ${totalWeight}%)`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateComponents()) {
      return;
    }

    // Calculate weighted average
    const weightedScore = components.reduce((total, comp) => {
      return total + (Number(comp.score) * Number(comp.weight) / 100);
    }, 0);

    try {
      await axios.put(`${API_ENDPOINT}/grades/${grade.id}`, {
        componentType: components[0].name,
        score: weightedScore,
        weight: 100
      });
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update grade");
    }
  };

  const remainingWeight = 100 - calculateTotalWeight();

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 800,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <Typography variant="h6" gutterBottom>Update Grade Components</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        Remaining Weight: {remainingWeight}%
      </Typography>

      {components.map((component, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            label="Component Name"
            value={component.name}
            onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
            sx={{ flex: 2 }}
            size="small"
          />
          <TextField
            label="Score"
            type="number"
            value={component.score}
            onChange={(e) => handleComponentChange(index, 'score', e.target.value)}
            inputProps={{ min: 0, max: 100 }}
            sx={{ flex: 1 }}
            size="small"
          />
          <TextField
            label="Weight (%)"
            type="number"
            value={component.weight}
            onChange={(e) => handleComponentChange(index, 'weight', e.target.value)}
            inputProps={{ min: 0, max: 100 }}
            sx={{ flex: 1 }}
            size="small"
          />
          {components.length > 1 && (
            <IconButton 
              onClick={() => removeComponent(index)}
              color="error"
              size="small"
            >
              <RemoveIcon />
            </IconButton>
          )}
          {index === components.length - 1 && remainingWeight > 0 && (
            <IconButton 
              onClick={addComponent}
              color="primary"
              size="small"
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={remainingWeight !== 0}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}

export default UpdateGrade;