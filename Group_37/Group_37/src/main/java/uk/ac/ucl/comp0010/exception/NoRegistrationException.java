package uk.ac.ucl.comp0010.exception;

/**
 * Represents an exception that is thrown when no registration is available for a student.
 */
public class NoRegistrationException extends Exception {

  public NoRegistrationException(String message) {
    super(message);
  }
  
}