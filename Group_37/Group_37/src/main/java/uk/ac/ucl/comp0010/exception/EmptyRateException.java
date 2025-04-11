package uk.ac.ucl.comp0010.exception;

/**
 * Represents an exception that is thrown when no rates are available for a
 * movie.
 */
public class EmptyRateException extends Exception {

  public EmptyRateException(String message) {
    super(message);
  }

  public EmptyRateException() {

  }

  private static final long serialVersionUID = -1267956455184991018L;

}
