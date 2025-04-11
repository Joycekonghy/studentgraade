package uk.ac.ucl.comp0010;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import uk.ac.ucl.comp0010.exception.NoRegistrationException;

public class NoRegistrationExceptionTest {

  @Test
  public void testNoRegistrationExceptionConstructor() {
    // Test that the exception can be created with a message
    String message = "No registration found for the student";
    try {
      throw new NoRegistrationException(message);
    } catch (NoRegistrationException e) {
      // Verify that the exception is of the correct type
      assertTrue(e instanceof NoRegistrationException, "Exception should be of type NoRegistrationException");
      assertEquals(message, e.getMessage(), "The exception message should be the same as the one passed");
    }
  }
}
