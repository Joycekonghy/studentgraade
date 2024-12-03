package uk.ac.ucl.comp0010;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uk.ac.ucl.comp0010.exception.NoGradeAvailableException;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.model.Module;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

public class StudentTest {
    private Student student;
    private Module module1;
    private Module module2;
    private Grade grade1;
    private Grade grade2;

    @BeforeEach
    void setUp() {
        // Создаем студента
        student = new Student(1L, "John", "Doe", "johndoe", "john.doe@example.com");

        // Создаем модули
        module1 = new Module("Computer Science", "COMP001", false);
        module2 = new Module("Mathematics", "MATH001", false);

        // Создаем оценки
        grade1 = new Grade(student, module1, 85);
        grade2 = new Grade(student, module2, 95);

        // Добавляем оценки студенту
        student.addGrade(grade1);
        student.addGrade(grade2);

        // Регистрируем модули
        student.registerModule(module1);
        student.registerModule(module2);
    }

    @Test
    public void testSetAndGetId() {
        student.setId(123L);
        assertEquals(123L, student.getId(), "setId or getId failed");
    }

    @Test
    public void testSetAndGetFirstName() {
        student.setFirstName("Alice");
        assertEquals("Alice", student.getFirstName(), "setFirstName or getFirstName failed");
    }

    @Test
    public void testSetAndGetLastName() {
        student.setLastName("Smith");
        assertEquals("Smith", student.getLastName(), "setLastName or getLastName failed");
    }

    @Test
    public void testSetAndGetUsername() {
        student.setUsername("asmith");
        assertEquals("asmith", student.getUsername(), "setUsername or getUsername failed");
    }

    @Test
    public void testSetAndGetEmail() {
        student.setEmail("alice.smith@example.com");
        assertEquals("alice.smith@example.com", student.getEmail(), "setEmail or getEmail failed");
    }

    @Test
    public void testSetAndGetRegisteredModules() {
        List<Module> modules = new ArrayList<>();
        Module module1 = new Module("Mathematics", "MATH001", false);
        Module module2 = new Module("Computer Science", "COMP001", false);
        modules.add(module1);
        modules.add(module2);

        student.setRegisteredModules(modules);
        assertEquals(modules, student.getRegisteredModules(), "setRegisteredModules or getRegisteredModules failed");
    }

    @Test
    public void testDefaultConstructor() {
        Student defaultStudent = new Student(); // Используем конструктор по умолчанию
        assertNotNull(defaultStudent, "Default constructor failed");
        assertNull(defaultStudent.getFirstName(), "First name should be null by default");
        assertNull(defaultStudent.getLastName(), "Last name should be null by default");
        assertNull(defaultStudent.getUsername(), "Username should be null by default");
        assertNull(defaultStudent.getEmail(), "Email should be null by default");
        assertNotNull(defaultStudent.getRegisteredModules(), "Modules list should be initialized");
        assertTrue(defaultStudent.getRegisteredModules().isEmpty(), "Modules list should be empty by default");
        assertNotNull(defaultStudent.getGrades(), "Grades list should be initialized");
        assertTrue(defaultStudent.getGrades().isEmpty(), "Grades list should be empty by default");
    }

    @Test
    void testAddGrade() {
        List<Grade> grades = student.getGrades();
        assertEquals(2, grades.size());
        assertTrue(grades.contains(grade1));
        assertTrue(grades.contains(grade2));
    }

    @Test
    void testComputeAverage() throws NoGradeAvailableException {
        float average = student.computeAverage();
        assertEquals(90.0f, average, 0.01);
    }

    @Test
    void testComputeAverageNoGrades() {
        Student newStudent = new Student(2L, "Jane", "Doe", "janedoe", "jane.doe@example.com");
        assertThrows(NoGradeAvailableException.class, () -> newStudent.computeAverage());
    }

    @Test
    void testGetGrade() throws NoGradeAvailableException {
        Grade retrievedGrade = student.getGrade(module1);
        assertEquals(grade1, retrievedGrade);
    }

    @Test
    void testGetGradeNoGradeForModule() {
        Module module3 = new Module("Physics", "PHY001", false);
        assertThrows(NoGradeAvailableException.class, () -> student.getGrade(module3));
    }

    @Test
    void testRegisterModule() {
        student.registerModule(new Module("History", "HIST001", false));
        assertTrue(student.getRegisteredModules().stream()
                         .anyMatch(module -> module.getCode().equals("HIST001")));
    }

    @Test
    void testRegisterModuleAlreadyRegistered() {
        student.registerModule(module1);
        student.registerModule(module1); // Attempt to register again

        // Ensure the module is still only registered once
        assertEquals(2, student.getRegisteredModules().size());
    }

    @Test
    void testConstructor() {
        assertNotNull(student.getFirstName());
        assertNotNull(student.getLastName());
        assertNotNull(student.getUsername());
        assertNotNull(student.getEmail());
    }

}
