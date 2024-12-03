package uk.ac.ucl.comp0010;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Grade;

import static org.junit.jupiter.api.Assertions.*;

public class GradeTest {

  private Student student;
  private Module module;

  @BeforeEach
  public void setUp() {
    // Create mock Student and Module objects for testing
    student = new Student(1L, "John", "Doe", "johndoe", "johndoe@example.com");
    module = new Module("Math", "MATH101", true);
  }

  @Test
  public void testGradeConstructor() {
    Grade grade = new Grade(student, module, 85);

    assertNotNull(grade, "Grade object should be created");
    assertEquals(student, grade.getStudent(), "Student should match the provided student");
    assertEquals(module, grade.getModule(), "Module should match the provided module");
    assertEquals(85, grade.getScore(), "Score should be equal to the provided score");
  }

  @Test
  public void testInvalidScoreThrowsException() {
    // Test if an exception is thrown for invalid scores
    assertThrows(IllegalArgumentException.class, () -> {
      new Grade(student, module, -1); // Invalid negative score
    }, "Score must be between 0 and 100");

    assertThrows(IllegalArgumentException.class, () -> {
      new Grade(student, module, 101); // Invalid score greater than 100
    }, "Score must be between 0 and 100");
  }

  @Test
  public void testSetScoreWithInvalidValue() {
    Grade grade = new Grade(student, module, 85);

    // Test if setting invalid scores throws an exception
    assertThrows(IllegalArgumentException.class, () -> {
      grade.setScore(-5); // Invalid negative score
    }, "Score must be between 0 and 100");

    assertThrows(IllegalArgumentException.class, () -> {
      grade.setScore(105); // Invalid score greater than 100
    }, "Score must be between 0 and 100");
  }

  @Test
  public void testSetModule() {
    Grade grade = new Grade(student, module, 85);

    // Create a new module
    Module newModule = new Module("Physics", "PHYS101", false);

    // Set the new module
    grade.setModule(newModule);

    // Verify that the module has been correctly updated
    assertEquals(newModule, grade.getModule(), "The module should be updated to the new module");
  }

  @Test
  public void testSetStudent() {
    Grade grade = new Grade(student, module, 85);

    // Create a new student
    Student newStudent = new Student(2L, "Jane", "Doe", "janedoe", "janedoe@example.com");

    // Set the new student
    grade.setStudent(newStudent);

    // Verify that the student has been correctly updated
    assertEquals(newStudent, grade.getStudent(), "The student should be updated to the new student");
  }

  @Test
  public void testSetScoreWithValidValue() {
    Grade grade = new Grade(student, module, 85);

    // Test if setting valid scores works correctly
    grade.setScore(90);
    assertEquals(90, grade.getScore(), "Score should be updated to the valid value");
  }

  @Test
  public void testGetId() {
    Grade grade = new Grade(student, module, 85);

    // Test if ID is null for a new grade object
    assertNull(grade.getId(), "ID should be null before it's persisted in the database");
  }

  @Test
  public void testDefaultConstructor() {
    // Test default constructor
    Grade grade = new Grade();

    assertNull(grade.getId(), "ID should be null for a new object");
    assertNull(grade.getStudent(), "Student should be null by default");
    assertNull(grade.getModule(), "Module should be null by default");
    assertEquals(0, grade.getScore(), "Score should be 0 by default");
  }
}
