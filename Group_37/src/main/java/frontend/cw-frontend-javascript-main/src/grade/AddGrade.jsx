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
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { API_ENDPOINT } from "../config";

function CircularProgressWithLabel({ value }) {
  const getColor = (value) => {
    if (value === 100) return '#4caf50';
    if (value >= 75) return '#2196F3';
    if (value >= 50) return '#FF9800';
    if (value >= 25) return '#FF5722';
    return '#f44336';
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={5}
        sx={{
          color: getColor(value),
          backgroundColor: '#f5f5f5',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1rem',
            color: getColor(value)
          }}
        >
          {`${value}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function AddGrade(props) {
  const [grade, setGrade] = useState({});
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");
  const [components, setComponents] = useState([
    { name: '', score: '', weight: '' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, modulesRes] = await Promise.all([
          axios.get(`${API_ENDPOINT}/students`),
          axios.get(`${API_ENDPOINT}/modules`)
        ]);
        setStudents(studentsRes.data._embedded.students || []);
        setModules(modulesRes.data._embedded.modules || []);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const calculateTotalWeight = () => {
    return components.reduce((sum, comp) => sum + (Number(comp.weight) || 0), 0);
  };

  const calculateWeightedAverage = () => {
    const totalWeight = calculateTotalWeight();
    if (totalWeight === 0) return 0;

    const weightedScore = components.reduce((total, comp) => {
      if (!comp.score || !comp.weight) return total;
      return total + (Number(comp.score) * Number(comp.weight) / 100);
    }, 0);

    return weightedScore;
  };

  const getUKClassification = (average) => {
    if (average >= 70) return "First Class (1st)";
    if (average >= 60) return "Upper Second Class (2:1)";
    if (average >= 50) return "Lower Second Class (2:2)";
    if (average >= 40) return "Third Class (3rd)";
    return "Fail";
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
    if (!grade.student_id || !grade.module_id) {
      setError("Please select both a student and a module");
      return false;
    }

    const allFilled = components.every(comp => 
      comp.name && comp.score && comp.weight
    );
    if (!allFilled) {
      setError("All component fields must be filled");
      return false;
    }

    const validScores = components.every(comp => 
      Number(comp.score) >= 0 && Number(comp.score) <= 100
    );
    if (!validScores) {
      setError("All scores must be between 0 and 100");
      return false;
    }

    const totalWeight = calculateTotalWeight();
    if (totalWeight !== 100) {
      setError(`Total weight must be 100% (currently ${totalWeight}%)`);
      return false;
    }

    return true;
  };

  const handleAddGrade = async () => {
    if (!validateComponents()) {
      return;
    }

    try {
      const payload = {
        student_id: Number(grade.student_id),
        module_id: Number(grade.module_id),
        componentType: components.map(c => `${c.name} (${c.weight}%)`).join(', '),
        score: Number(calculateWeightedAverage().toFixed(1)),
        weight: 100
      };

      await axios.post(`${API_ENDPOINT}/grades/addGrades`, payload);
      props.update();
      setGrade({});
      setComponents([{ name: '', score: '', weight: '' }]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add grade");
    }
  };

  const currentAverage = calculateWeightedAverage();
  const classification = getUKClassification(currentAverage);

  return (
    <Paper sx={{ 
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    }}>
      <Typography variant="h5" sx={{ mb: 3, color: '#1c3a63', fontWeight: 600 }}>
        Add Grade Components
      </Typography>
      
      {error && <Alert severity="error" sx={{ mt: 2, mb: 3 }}>{error}</Alert>}
      
      <Box sx={{ 
        mb: 4,
        p: 3,
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <Select
          sx={{ 
            minWidth: "300px", 
            mr: 2,
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0'
            }
          }}
          value={grade.student_id ?? ""}
          onChange={(e) => setGrade({ ...grade, student_id: e.target.value })}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Student</MenuItem>
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {`${student.firstName} ${student.lastName} (${student.id})`}
            </MenuItem>
          ))}
        </Select>

        <Select
          sx={{ 
            minWidth: "300px",
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0'
            }
          }}
          value={grade.module_id ?? ""}
          onChange={(e) => setGrade({ ...grade, module_id: e.target.value })}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Module</MenuItem>
          {modules.map((module) => (
            <MenuItem key={module.id} value={module.id}>
              {`${module.code} ${module.name}`}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="h6" sx={{ color: '#1c3a63' }}>
            Grade Components
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 1 
          }}>
            <CircularProgressWithLabel value={calculateTotalWeight()} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Total Weight
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: '#f8f9fa',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Current Average: {currentAverage.toFixed(1)}%
          </Typography>
          <Box sx={{ 
            py: 0.5,
            px: 1.5,
            borderRadius: '4px',
            fontWeight: 500,
            fontSize: '0.875rem',
            backgroundColor: 
              classification === "First Class (1st)" ? '#4caf50' :
              classification === "Upper Second Class (2:1)" ? '#2196F3' :
              classification === "Lower Second Class (2:2)" ? '#FF9800' :
              classification === "Third Class (3rd)" ? '#FF5722' : '#f44336',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            {classification}
          </Box>
        </Box>
      </Box>

      {components.map((component, index) => (
        <Box key={index} sx={{ 
          display: 'flex',
          gap: 2,
          mb: 2,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transform: 'translateY(-1px)'
          }
        }}>
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
            sx={{ flex: 1 }}
            size="small"
          />
          <TextField
            label="Weight (%)"
            type="number"
            value={component.weight}
            onChange={(e) => handleComponentChange(index, 'weight', e.target.value)}
            sx={{ flex: 1 }}
            size="small"
          />
          {components.length > 1 && (
            <IconButton 
              onClick={() => removeComponent(index)}
              color="error"
              size="small"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <RemoveIcon />
            </IconButton>
          )}
          {index === components.length - 1 && calculateTotalWeight() < 100 && (
            <IconButton 
              onClick={addComponent}
              color="primary"
              size="small"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={handleAddGrade}
        disabled={calculateTotalWeight() !== 100}
        sx={{ 
          mt: 3,
          backgroundColor: calculateTotalWeight() === 100 ? '#4caf50' : '#1976d2',
          '&:hover': {
            backgroundColor: calculateTotalWeight() === 100 ? '#45a049' : '#1565c0'
          }
        }}
      >
        Add Grade
      </Button>
    </Paper>
  );
}

export default AddGrade;