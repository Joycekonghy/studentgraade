// UN COMMENT THIS CODE TO SEE IMPORVED UI FOR GRADES

// let grades = [
//     {
//       id: 1,
//       studentId: 1,
//       moduleCode: "COMP001",
//       score: 85,
//     },
//     {
//       id: 2,
//       studentId: 2,
//       moduleCode: "COMP002",
//       score: 90,
//     },
//   ];
  
//   export const getGrades = () => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(grades), 300); // Simulate network latency
//     });
//   };
  
//   export const addGrade = (newGrade) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (!newGrade.studentId || !newGrade.moduleCode || newGrade.score === undefined) {
//           reject({ message: "All fields are required." });
//         } else {
//           const newId = Math.max(...grades.map((g) => g.id)) + 1;
//           const grade = { id: newId, ...newGrade };
//           grades.push(grade);
//           resolve(grade);
//         }
//       }, 300);
//     });
//   };
  
//   export const updateGrade = (updatedGrade) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const index = grades.findIndex((g) => g.id === updatedGrade.id);
//         if (index === -1) {
//           reject({ message: "Grade not found." });
//         } else {
//           grades[index] = updatedGrade;
//           resolve(updatedGrade);
//         }
//       }, 300);
//     });
//   };
  
//   export const deleteGrade = (gradeId) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const initialLength = grades.length;
//         grades = grades.filter((g) => g.id !== gradeId);
//         if (grades.length === initialLength) {
//           reject({ message: "Grade not found." });
//         } else {
//           resolve(gradeId);
//         }
//       }, 300);
//     });
//   };
  