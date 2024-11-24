//// UN COMMENT THIS CODE TO SEE IMPORVED UI USING MOCK API

// // src/mockApi.js

// let modules = [
//     { code: "COMP001", name: "Introduction to Programming", mnc: true },
//     { code: "COMP002", name: "Algorithms and Data Structures", mnc: false },
//   ];
  
//   export const getModules = () => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(modules), 300); // Simulate network latency
//     });
//   };
  
//   export const addModule = (newModule) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (!newModule.code || !newModule.name) {
//           reject({ message: "Module code and name are required." });
//         } else if (modules.some((m) => m.code === newModule.code)) {
//           reject({ message: "Duplicate module code is not allowed." });
//         } else {
//           modules = [...modules, newModule];
//           resolve(newModule);
//         }
//       }, 300);
//     });
//   };
  
//   export const updateModule = (updatedModule) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const index = modules.findIndex((m) => m.code === updatedModule.code);
//         if (index === -1) {
//           reject({ message: "Module not found." });
//         } else {
//           modules[index] = updatedModule;
//           resolve(updatedModule);
//         }
//       }, 300);
//     });
//   };
  
//   export const deleteModule = (moduleCode) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const initialLength = modules.length;
//         modules = modules.filter((m) => m.code !== moduleCode);
//         if (modules.length === initialLength) {
//           reject({ message: "Module not found." });
//         } else {
//           resolve(moduleCode);
//         }
//       }, 300);
//     });
//   };
  