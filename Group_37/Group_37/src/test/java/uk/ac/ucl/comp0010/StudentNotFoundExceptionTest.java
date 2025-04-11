package uk.ac.ucl.comp0010;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import uk.ac.ucl.comp0010.exception.StudentNotFoundException;

public class StudentNotFoundExceptionTest {

  @Test
  public void testStudentNotFoundExceptionConstructor() {
    // Test that the exception can be created with a message
    String message = "Student not found in the system";
    try {
      throw new StudentNotFoundException(message);
    } catch (StudentNotFoundException e) {
      // Verify that the exception is of the correct type
      assertTrue(e instanceof StudentNotFoundException, "Exception should be of type StudentNotFoundException");
      assertEquals(message, e.getMessage(), "The exception message should be the same as the one passed");
    }
  }
}
