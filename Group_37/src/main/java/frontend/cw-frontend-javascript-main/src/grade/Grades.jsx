import React from "react";
import axios from "axios";
import { Breadcrumbs, Link, Typography, Alert, Grid, Button } from "@mui/material";
import App from "../App";
import { API_ENDPOINT } from "../config";
import AddGrade from "./AddGrade";
import UpdateGrade from "./UpdateGrade";

function Grades() {
  const [grades, setGrades] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    updateGrades();
  }, []);

  function updateGrades() {
    axios
      .get(`${API_ENDPOINT}/grades`)
      .then((response) => {
        const grades = response.data._embedded?.grades || [];
        console.log("Fetched grades:", grades); // Debug log
        setGrades(grades);
      })
      .catch((err) => {
        console.error("Error fetching grades:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch grades.");
      });
  }

  // Inline GradeRow Component
  function GradeRow({ grade }) {
    const [student, setStudent] = React.useState();
    const [module, setModule] = React.useState();
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
      axios.get(grade._links.module.href).then((response) => setModule(response.data));
      axios.get(grade._links.student.href).then((response) => setStudent(response.data));
    }, [grade]);

    return (
      <>
        <Grid container style={{ padding: "10px 0" }}>
          <Grid item xs={3}>
            {student ? `${student.firstName} ${student.lastName} (${student.id})` : "Loading..."}
          </Grid>
          <Grid item xs={3}>
            {module ? `${module.code} ${module.name}` : "Loading..."}
          </Grid>
          <Grid item xs={3}>
            {grade.score}
          </Grid>
          <Grid item xs={3}>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Update Grade
            </Button>
          </Grid>
        </Grid>
        {isEditing && (
          <UpdateGrade
            grade={grade}
            onClose={() => setIsEditing(false)}
            onUpdate={updateGrades}
          />
        )}
      </>
    );
  }

  return (
    <App>
      <Breadcrumbs sx={{ marginBottom: "30px" }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography sx={{ color: "text.primary" }}>Grades</Typography>
      </Breadcrumbs>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && grades.length < 1 && <Alert severity="warning">No grades</Alert>}
      {grades.length > 0 && (
        <>
          <Grid container style={{ padding: "10px 0" }}>
            <Grid item xs={3}>Student</Grid>
            <Grid item xs={3}>Module</Grid>
            <Grid item xs={3}>Score</Grid>
            <Grid item xs={3}>Actions</Grid>
          </Grid>
          {grades.map((g) => (
            <GradeRow key={g.id} grade={g} />
          ))}
        </>
      )}
      <br />
      <br />
      <AddGrade update={updateGrades} />
    </App>
  );
}

export default Grades;
