package uk.ac.ucl.comp0010;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;

public class RegistrationTest {

  private Student student;
  private Module module;
  private Registration registration;

  @BeforeEach
  public void setUp() {
    // Create dummy data for tests
    student = new Student(1L, "John", "Doe", "johndoe", "john.doe@example.com");
    module = new Module("Mathematics", "MATH101", true);
    registration = new Registration(student, module);
  }

  @Test
  public void testConstructor() {
    // Test constructor initialization
    assertEquals(student, registration.getStudent(), "Student should be correctly set in the constructor");
    assertEquals(module, registration.getModule(), "Module should be correctly set in the constructor");
  }

  @Test
  public void testGetStudent() {
    // Verify that the student is correctly returned by the getter
    assertEquals(student, registration.getStudent(),
        "The student returned by getStudent() should be the same as the one set");
  }

  @Test
  public void testSetStudent() {
    // Create a new student and update the registration
    Student newStudent = new Student(2L, "Jane", "Smith", "janesmith", "jane.smith@example.com");
    registration.setStudent(newStudent);

    // Verify that the student is updated correctly
    assertEquals(newStudent, registration.getStudent(), "The student should be updated correctly using setStudent()");
  }

  @Test
  public void testGetModule() {
    // Verify that the module is correctly returned by the getter
    assertEquals(module, registration.getModule(),
        "The module returned by getModule() should be the same as the one set");
  }

  @Test
  public void testSetModule() {
    // Create a new module and update the registration
    Module newModule = new Module("Physics", "PHYS101", false);
    registration.setModule(newModule);

    // Verify that the module is updated correctly
    assertEquals(newModule, registration.getModule(), "The module should be updated correctly using setModule()");
  }

  @Test
  public void testGetId() {
    // Verify that the ID is null for a new registration object
    assertNull(registration.getId(), "ID should be null before it's persisted in the database");
  }

  @Test
  public void testSetId() {
    // Test if setting the ID works correctly
    registration.setId(1L);
    assertEquals(1L, registration.getId(), "ID should be updated to the new value");
  }

  @Test
  public void testDefaultConstructor() {
    // Create a Registration object using the default constructor
    Registration newRegistration = new Registration();

    // Verify that both the student and module are null
    assertNull(newRegistration.getStudent(), "Student should be null by default");
    assertNull(newRegistration.getModule(), "Module should be null by default");
  }
}
