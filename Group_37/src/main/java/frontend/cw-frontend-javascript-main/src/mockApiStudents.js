// UN COMMENT THIS CODE TO SEE IMPORVED UI FOR STUDENT 

// let students = [
//     {
//       id: 1,
//       email: "john.doe@example.com",
//       firstName: "John",
//       lastName: "Doe",
//       username: "johndoe",
//     },
//     {
//       id: 2,
//       email: "jane.doe@example.com",
//       firstName: "Jane",
//       lastName: "Doe",
//       username: "janedoe",
//     },
//   ];
  
//   export const getStudents = () => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(students), 300); 
//     });
//   };
  
//   export const addStudent = (newStudent) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (!newStudent.firstName || !newStudent.lastName || !newStudent.email) {
//           reject({ message: "All fields are required." });
//         } else {
//           const newId = Math.max(...students.map((s) => s.id)) + 1;
//           const student = { id: newId, ...newStudent };
//           students.push(student);
//           resolve(student);
//         }
//       }, 300);
//     });
//   };
  
//   export const updateStudent = (updatedStudent) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const index = students.findIndex((s) => s.id === updatedStudent.id);
//         if (index === -1) {
//           reject({ message: "Student not found." });
//         } else {
//           students[index] = updatedStudent;
//           resolve(updatedStudent);
//         }
//       }, 300);
//     });
//   };
  
//   export const deleteStudent = (studentId) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const initialLength = students.length;
//         students = students.filter((s) => s.id !== studentId);
//         if (students.length === initialLength) {
//           reject({ message: "Student not found." });
//         } else {
//           resolve(studentId);
//         }
//       }, 300);
//     });
//   };
  