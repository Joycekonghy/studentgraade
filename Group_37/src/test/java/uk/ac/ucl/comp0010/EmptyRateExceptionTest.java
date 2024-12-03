package uk.ac.ucl.comp0010;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import uk.ac.ucl.comp0010.exception.EmptyRateException;

public class EmptyRateExceptionTest {

  @Test
  public void testEmptyRateExceptionConstructor() {
    // Test that the exception can be created and is thrown correctly
    try {
      throw new EmptyRateException();
    } catch (EmptyRateException e) {
      // Verify that the exception is of the correct type
      assertTrue(e instanceof EmptyRateException, "Exception should be of type EmptyRateException");
    }
  }

  @Test
  public void testEmptyRateExceptionWithMessage() {
    // Test that the exception can be created with a custom message
    String message = "No rates available for this movie";
    try {
      throw new EmptyRateException(message);
    } catch (EmptyRateException e) {
      // Verify that the exception is of the correct type
      assertTrue(e instanceof EmptyRateException, "Exception should be of type EmptyRateException");
      assertEquals(message, e.getMessage(), "The exception message should be the same as the one passed");
    }
  }
}