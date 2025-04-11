package uk.ac.ucl.comp0010;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.model.Module;

public class ModuleTest {

  private Module module;
  private Student student;

  @BeforeEach
  public void setUp() {
    student = new Student(1L, "John", "Doe", "jdoe", "jdoe@example.com");
    module = new Module("Computer Science", "CS101", false);
  }

  @Test
  public void testConstructor() {
    Module newModule = new Module("Mathematics", "MATH101", true);
    assertEquals("Mathematics", newModule.getName());
    assertEquals("MATH101", newModule.getCode());
    assertTrue(newModule.getMnc());
  }

  @Test
  public void testDefaultConstructor() {
    // Verify that the object is created with default values
    Module module = new Module();

    assertNull(module.getId(), "ID should be null for a new object");
    assertNull(module.getName(), "Module name should be null");
    assertNull(module.getCode(), "Module code should be null");
    assertFalse(module.getMnc(), "MNC should be false by default");
    assertNull(module.getRegisteredStudent(), "Registered student should be null by default");
  }

  @Test
  public void testGetId() {
    Module module = new Module();
    assertNull(module.getId(), "ID should be null if not set");

    Long expectedId = 1L;
    module = new Module("Math", "MATH101", true);
    module.setId(expectedId);

    assertEquals(expectedId, module.getId(), "getId() should return the correct ID value");
  }

  @Test
  public void testGettersAndSetters() {
    module.setName("Physics");
    module.setCode("PHYS101");
    module.setMnc(true);

    assertEquals("Physics", module.getName());
    assertEquals("PHYS101", module.getCode());
    assertTrue(module.getMnc());
  }

  @Test
  public void testRegisteredStudent() {
    module.setRegisteredStudent(student);
    assertEquals(student, module.getRegisteredStudent());

    Student newStudent = new Student(2L, "Jane", "Smith", "jsmith", "jsmith@example.com");
    module.setRegisteredStudent(newStudent);
    assertEquals(newStudent, module.getRegisteredStudent());
  }

  @Test
  public void testModuleWithoutStudent() {
    assertNull(module.getRegisteredStudent());
  }

  @Test
  public void testEquality() {
    Module anotherModule = new Module("Computer Science", "CS101", false);
    assertEquals(module.getName(), anotherModule.getName());
    assertEquals(module.getCode(), anotherModule.getCode());
    assertEquals(module.getMnc(), anotherModule.getMnc());
  }

}
