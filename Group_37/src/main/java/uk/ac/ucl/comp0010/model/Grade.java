package uk.ac.ucl.comp0010.model;


/**
 * Represents a grade in the system.
 * <p>
 * A grade is a score that a student receives for a module.
 * </p>
 */
public class Grade {
    
  private Student student;
  private int score;
  private Module module;

  /**
   * Creates a new grade with the given student, module, and score.
   *
   * @param student the student who received the grade
   * @param module the module for which the grade was received
   * @param score the score of the grade
   */
  public Grade(Student student, Module module, int score) {
    validateScore(score);
    this.student = student;
    this.module = module;
    this.score = score;
  }

  private void validateScore(int score) {
    if (score < 0 || score > 100) {
      throw new IllegalArgumentException("Score must be between 0 and 100");
    }
  }
    
  // Get/Setters
  public Module getModule() {
    return module;
  }

  public void setModule(Module module) {
    this.module =  module;
  }

  public Student getStudent() {
    return student;
  }

  public void setStudent(Student student) {
    this.student =  student;
  }

  public int getScore() {
    return score;
  }

  public void setScore(int score) {
    validateScore(score);
    this.score =  score;
  }
    
}