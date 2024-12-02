import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Grades from "./grade/Grades";
import Modules from "./module/Modules";
import Students from "./student/Students";
import Advice from "./Advice";
import "./App";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/students" element={<Students />} />
        <Route path="/advice" element={<Advice />} />
      </Routes>
    </Router>
  );
}

export default App;

