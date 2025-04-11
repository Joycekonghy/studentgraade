package uk.ac.ucl.comp0010.exception;

/**
 * Represents an exception that is thrown when no grade is available for a student.
 */
public class NoGradeAvailableException extends Exception {

  public NoGradeAvailableException(String message) {
    super(message);
  }
  
}