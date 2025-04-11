package uk.ac.ucl.comp0010.exception;

/**
 * Exception thrown when a student is not found in the database.
 */
public class StudentNotFoundException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  public StudentNotFoundException(String message) {
    super(message); 
  }
}
