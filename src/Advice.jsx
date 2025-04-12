import React, { useState } from "react";
import { Link } from "react-router-dom";
import graduateStudent from "./Icons/graduate_student.png";
import "./styles/advice.css";
import { useTheme } from "./App";

function Advice() {
  const [open, setOpen] = useState(null);

  const { isDarkMode, toggleTheme } = useTheme();

  const toggleOpen = (index) => {
    setOpen(open === index ? null : index);
  };

  const adviceItems = [
    {
      question: "How can I improve my grades?",
      answer: (
        <>
          Improving your grades involves adopting effective study habits, managing your time efficiently, and seeking help when needed. Develop a consistent study schedule, actively participate in classes, and utilize available resources such as tutoring services. Engaging in regular self-assessment can also help identify areas for improvement. Explore study techniques{" "}
          <a
            href="https://www.oxford-royale.com/articles/improve-underperforming-grades/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "What should I do if I fail a course?",
      answer: (
        <>
          Failing a course can be challenging, but it's important to address the issue proactively. Consult with your academic advisor to discuss options like retaking the course or accessing support services. Reflect on the factors that contributed to the failure and develop a plan to improve. Learn how to recover from failing a class{" "}
          <a
            href="https://tutorful.co.uk/blog/what-happens-if-you-fail-university"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "Can I appeal a grade I believe is unfair?",
      answer: (
        <>
          Yes, universities typically have formal procedures for appealing grades. Begin by discussing your concerns with the course instructor. If unresolved, follow your institution's academic appeals process, which may involve submitting a formal appeal with supporting evidence. Review UCL's Academic Appeals Procedure{" "}
          <a
            href="https://www.ucl.ac.uk/academic-manual/chapters/chapter-6-student-casework-framework/section-7-academic-appeals-procedure"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "How are UK university degree classifications calculated, and how do they convert to GPA?",
      answer: (
        <>
          UK universities classify degrees as follows:
          <ul>
            <li>First-Class Honours (1st): 70% and above</li>
            <li>Upper Second-Class Honours (2:1): 60% – 69%</li>
            <li>Lower Second-Class Honours (2:2): 50% – 59%</li>
            <li>Third-Class Honours (3rd): 40% – 49%</li>
          </ul>
          These classifications are based on the weighted average of your module marks. Converting UK classifications to the US GPA system varies, but a general guideline is:
          <ul>
            <li>First-Class Honours (1st): 3.7 – 4.0 GPA</li>
            <li>Upper Second-Class Honours (2:1): 3.3 – 3.6 GPA</li>
            <li>Lower Second-Class Honours (2:2): 2.7 – 3.2 GPA</li>
            <li>Third-Class Honours (3rd): 2.0 – 2.6 GPA</li>
          </ul>
          Note that conversion scales can differ between institutions. Refer to this UK to US grade conversion table{" "}
          <a
            href="https://www.theprofs.co.uk/student-resources/university-applications/uk-to-us-grade-conversion-table-everything-you-need-to-know/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "What are the consequences of being on academic probation?",
      answer: (
        <>
          Academic probation serves as a warning that your academic performance needs improvement. Consequences may include limited participation in extracurricular activities and the requirement to meet specific academic targets. Failure to improve can lead to suspension or dismissal. It's crucial to work closely with your academic advisor to develop a plan for success. Understand academic probation{" "}
          <a
            href="https://www.accreditedschoolsonline.org/resources/academic-probation/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "How can I effectively prepare for exams?",
      answer: (
        <>
          Effective exam preparation includes reviewing course materials, practicing past exam papers, and organizing study sessions. Employ active learning techniques, such as summarizing information in your own words, and ensure you get adequate rest before the exam. Discover exam preparation tips{" "}
          <a
            href="https://examstudyexpert.com/how-to-study-effectively/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "How can I balance academics and extracurricular activities?",
      answer: (
        <>
          Balancing academics and extracurriculars requires effective time management. Use planners or digital calendars to schedule your commitments, prioritize tasks, and set realistic goals. Learning to say no when necessary is also important to maintain balance. Explore time management strategies{" "}
          <a
            href="https://summer.harvard.edu/blog/8-time-management-tips-for-students/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "What resources are available if I'm struggling in a class?",
      answer: (
        <>
          Universities offer various resources for students facing academic challenges, including tutoring centers, writing labs, and academic counseling. Engaging with these services early can provide the support needed to improve your performance. Learn about academic support services{" "}
          <a
            href="https://www.ucl.ac.uk/students/academic-support"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "What are the benefits of joining a study group?",
      answer: (
        <>
          Participating in a study group can enhance understanding through collaborative learning, provide diverse perspectives, and increase motivation. Ensure the group remains focused and that all members are committed to the group's objectives. Form an effective study group{" "}
          <a
            href="https://www.fnu.edu/10-reasons-form-study-group/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
    {
      question: "How can I manage stress during my studies?",
      answer: (
        <>
          Managing stress is crucial for academic success. Incorporate regular physical activity, maintain a balanced diet, and ensure adequate sleep. Practicing mindfulness or meditation can also help. If stress becomes overwhelming, consider seeking support from your university's counseling services. Learn stress management techniques{" "}
          <a
            href="https://www.oxfordsummerprogram.com/10-proven-strategies-to-elevate-your-grades-when-youre-struggling"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </>
      ),
    },
  ];


  return (
    <div className={`advice-page ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">
          <img src={graduateStudent} alt="Student Icon" className="navbar-icon" />
          <span className="navbar-text">MyGrades</span>
        </div>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/advice" className="active-link">Advice</Link>

          <button className="theme-toggle-button" onClick={() => {
            toggleTheme();
            console.log('Theme toggled, isDarkMode now:', isDarkMode);
          }}>
            <span className={`sun-icon ${isDarkMode ? 'hidden' : ''}`}>🌞</span>
            <span className={`moon-icon ${isDarkMode ? '' : 'hidden'}`}>🌑</span>
          </button>
        </nav>
      </div>

      {/* Advice Content */}
      <h1 className="advice-title">Advice Page</h1>
      {adviceItems.map((item, index) => (
        <div key={index} className="advice-item">
          <button
            className="advice-question"
            onClick={() => toggleOpen(index)}
          >
            {item.question}
          </button>
          {open === index && (
            <div className="advice-answer">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Advice;