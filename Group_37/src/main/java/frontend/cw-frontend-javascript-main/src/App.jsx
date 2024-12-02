import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Grades from "./grade/Grades"; // Correct path to Grades.jsx
import Advice from "./Advice"; // Correct path to Advice.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/advice" element={<Advice />} />
      </Routes>
    </Router>
  );
}

export default App;