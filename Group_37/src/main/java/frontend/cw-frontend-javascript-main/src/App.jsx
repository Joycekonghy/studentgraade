import React, { createContext, useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Grades from "./grade/Grades";
import Modules from "./module/Modules";
import Students from "./student/Students";
import AddStudent from './student/AddStudent'; // Импортируем твой компонент
import Registrations from "./registration/Registrations";
import Advice from "./Advice";
import "./styles/home.css";

// Создаем контекст для темы
export const ThemeContext = createContext();  // Экспортируем ThemeContext

// Создаем провайдер для темы
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme ? JSON.parse(savedTheme) : false; // По умолчанию светлая тема
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("isDarkMode", JSON.stringify(newTheme));
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования темы
export const useTheme = () => {
  return useContext(ThemeContext);
};

function App() {
  return (
    // Оборачиваем все приложение в ThemeProvider
    <ThemeProvider>
      <Router>
        <AppWithTheme />
      </Router>
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const { isDarkMode, toggleTheme } = useTheme(); // Получаем тему из контекста

  return (
    <ThemeProvider>
      <div className={isDarkMode ? "dark-mode" : ""}> {/* Применяем класс на весь App */}
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/students" element={<Students />} />
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/advice" element={<Advice />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
