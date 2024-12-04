import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RegisterModule from "./RegisterModule";
import { API_ENDPOINT } from "../config";
import graduateStudent from "../Icons/graduate_student.png";
import "../styles/registration.css";

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [expandedStudents, setExpandedStudents] = useState({});
  const [students, setStudents] = useState({});

  useEffect(() => {
    updateRegistrations();
  }, []);

  const updateRegistrations = async () => {
    try {
        console.log("Fetching registrations...");
        const response = await axios.get(`${API_ENDPOINT}/registrations`);
        const registrations = response.data._embedded?.registrations || [];
        
        if (registrations.length === 0) {
          setRegistrations([]);
          setStudents({});
          setError("No registrations available.");
          return;
        }
    
        // Get unique student URLs
        const studentUrls = [...new Set(registrations.map((reg) => reg._links.student.href))];
        console.log("Student URLs:", studentUrls);
    
        // Fetch all student details in parallel
        const studentDetails = await Promise.all(
          studentUrls.map((url) =>
            axios.get(url).catch((err) => {
              console.error(`Failed to fetch student details for ${url}`, err);
              return null; // Avoid breaking the Promise.all chain
            })
          )
        ).then(results => results.filter(detail => detail !== null)); // Filter out null values
    
        // Create student map
        const studentMap = studentUrls.reduce((acc, url, index) => {
          if (studentDetails[index]) {
            acc[url] = studentDetails[index].data;
          } else {
            console.warn(`No student data for URL: ${url}`);
          }
          return acc;
        }, {});
        console.log("Student map:", studentMap);
    
        // Update state
        setRegistrations(registrations);
        setStudents(studentMap);
        setError("");
      } catch (err) {
        const errorMessage =
          err.code === "ERR_NETWORK"
            ? "Could not connect to server. Please check if the server is running."
            : err.response?.data?.message || err.message || "Failed to fetch registrations.";
        setError(errorMessage);
        console.error("Error fetching registrations:", err);
      }
    };

  // Group registrations by student
  const groupedRegistrations = registrations.reduce((acc, reg) => {
    const studentUrl = reg._links.student.href;
    const student = students[studentUrl];
    if (!student) return acc;
    const studentId = student.id;
    if (!acc[studentId]) {
        acc[studentId] = [];
        console.log("Student URL:", studentUrl);
    }
    acc[studentId].push(reg);
    console.log("Student ID:", studentId);
    return acc;
  }, {});



  const toggleExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };
  

  return (
    <div className="registration-page">
      <div className="navbar">
        <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
        <span className="navbar-text">MyGrades</span>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations" className="active-link">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice">Advice</Link>
        </nav>
      </div>

      <div className="add-student-section">
        <RegisterModule update={updateRegistrations} />
      </div>

      <div className="students-table-wrapper">
        {error && <div className="error-message">{error}</div>}
        {!error && Object.keys(groupedRegistrations).length === 0 && (
          <div className="warning-message">No registrations available</div>
        )}

        {Object.entries(groupedRegistrations).map(([studentId, studentRegs]) => {
          const student = Object.values(students).find(s => s.id === Number(studentId));
          if (!student) return null;

          return (
            <div key={studentId} className="student-section">
              <div 
                className="student-header" 
                onClick={() => toggleExpand(studentId)}
              >
                <span className="student-info">
                  {student.firstName} {student.lastName} (ID: {student.id})
                </span>
                <span className="module-count">
                  {studentRegs.length} module{studentRegs.length !== 1 ? 's' : ''} {expandedStudents[studentId] ? '▼' : '▶'}
                </span>
              </div>

              {expandedStudents[studentId] && (
                <div className="student-modules">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Module Code</th>
                        <th>Module Name</th>
                        <th>Score</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentRegs.map(registration => (
                        <ModuleRow
                          key={registration.id}
                          registration={registration}
                          updateRegistrations={updateRegistrations}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ModuleRow = ({ registration, updateRegistrations }) => {
  const [module, setModule] = useState(null);

  useEffect(() => {
    if (registration._links.module) {
      axios.get(registration._links.module.href)
        .then(res => setModule(res.data))
        .catch(err => console.error("Error fetching module:", err));
    }
  }, [registration]);

  const handleDelete = async () => {
    try {
      await axios.delete(registration._links.self.href);
      updateRegistrations();
    } catch (err) {
      console.error("Failed to delete registration", err);
    }
  };

  return (
    <tr>
      <td>{module?.code || "Loading..."}</td>
      <td>{module?.name || "Loading..."}</td>
      <td>{registration.score || "N/A"}</td>
      <td>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Registrations;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import RegisterModule from "./RegisterModule";
// import axios from "axios";
// import graduateStudent from "../Icons/graduate_student.png";
// import { API_ENDPOINT } from "../config";
// import "../styles/registration.css";

// function Registrations() {
//   const [registrations, setRegistrations] = useState([]);
//   const [students, setStudents] = useState([]); // Fetch students for mapping
//   const [error, setError] = useState("");
//   const [expandedStudents, setExpandedStudents] = useState({});

//   useEffect(() => {
//     updateRegistrations();
//     updateStudents(); // Fetch students on load
//   }, []);

//   const updateRegistrations = () => {
//     axios
//       .get(`${API_ENDPOINT}/registrations`)
//       .then((response) => {
//         const registrations = response.data._embedded?.registrations || [];
//         setRegistrations(registrations);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.message || err.message || "Failed to fetch grades.");
//       });
//   };

//   const updateStudents = () => {
//     axios
//       .get(`${API_ENDPOINT}/students`)
//       .then((response) => {
//         const students = response.data._embedded?.students || [];
//         setStudents(students);
//       })
//       .catch((err) => {
//         console.error("Error fetching students:", err);
//         setError(err.message || "Failed to fetch students.");
//       });
//   };

//   const toggleStudent = (studentId) => {
//     setExpandedStudents((prev) => ({
//       ...prev,
//       [studentId]: !prev[studentId],
//     }));
//   };


//   // Map student ID to full name
//   const getStudentName = (studentId) => {
//     const student = students.find((s) => s.id.toString() === studentId);
//     return student ? `${student.firstName} ${student.lastName}` : `Student ID: ${studentId}`;
//   };

//   // Group registrations by student
//   const groupedregistrations = registrations.reduce((grouped, registration) => {
//     const studentId = registration._links.student.href.split("/").pop();
//     if (!grouped[studentId]) grouped[studentId] = [];
//     grouped[studentId].push(registration);
//     return grouped;
//   }, {});

//   return (
//     <div className="modules-page">
//       {/* Navbar */}
//       <div className="navbar">
//         <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
//         <span className="navbar-text">MyGrades</span>
//         <nav className="navbar-links">
//           <Link to="/">Home</Link>
//           <Link to="/students">Students</Link>
//           <Link to="/modules">Modules</Link>
//           <Link to="/registrations" className="active-link">Registrations</Link>
//           <Link to="/grades">Grades</Link>
//           <Link to="/advice">Advice</Link>
//         </nav>
//       </div>

//       {/* Add registration Section */}
//       <div className="add-registration-section">
//         <RegisterModule update={updateRegistrations} />
//       </div>

//       {/* Grouped registrations */}
//       <div className="registrations-table-wrapper">
//         {error && <div className="error-message">{error}</div>}
//         {!error && registrations.length < 1 && <div className="warning-message">No registrations available</div>}

//         {/* Render grouped student registrations */}
//         {Object.entries(groupedregistrations).map(([studentId, studentregistrations]) => {

//           return (
//             <div key={studentId} className="student-group">
//               {/* Student Header */}
//               <div
//                 className="student-header"
//                 onClick={() => toggleStudent(studentId)}
//               >
//                 <span>{getStudentName(studentId)}</span>
//               </div>

//               {/* Modules Table */}
//               {expandedStudents[studentId] && (
//                 <table className="registrations-table">
//                   <thead>
//                     <tr>
//                       <th>Module</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {studentregistrations.map((registration) => (
//                       <ModuleRow
//                         key={registration.id}
//                         registration={registration}
//                         updateRegistrations={updateRegistrations}
//                       />
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // Component for each module row
// const ModuleRow = ({ registration, updateRegistrations }) => {
//   const [module, setModule] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     axios.get(registration._links.module.href).then((res) => setModule(res.data));
//   }, [registration]);

//   const handleDelete = () => {
//     axios
//       .delete(`${registration._links.self.href}`)
//       .then(() => updateRegistrations())
//       .catch((err) => console.error("Failed to drop registration", err));
//   };

//   return (
//     <tr>
//       <td>{module ? `${module.code} ${module.name}` : "Loading..."}</td>
//       <td>{registration.score}</td>
//       <td>
//         <button className="delete-button" onClick={handleDelete}>
//           Drop
//         </button>
//         {isEditing && (
//           <updateRegistration
//             registration={registration}
//             onClose={() => setIsEditing(false)}
//             onUpdate={updateRegistrations}
//           />
//         )}
//       </td>
//     </tr>
//   );
// };

// export default Registrations;
