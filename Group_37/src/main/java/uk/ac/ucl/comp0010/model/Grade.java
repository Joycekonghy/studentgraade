package uk.ac.ucl.comp0010.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



/**
 * Represents a grade in the system.
 * <p>
 * A grade is a score that a student receives for a module.
 * </p>
 */
@Entity
@Table(name = "grade")
public class Grade {
    
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false)
  private Student student;

  @Column(nullable = false)
  private int score;

  @ManyToOne
  @JoinColumn(name = "module_id", nullable = false)
  private Module module;

  /**
   * Creates a new grade with the given student, module, and score.
   *
   * @param student the student who received the grade
   * @param module the module for which the grade was received
   * @param score the score of the grade
   */
  public Grade() {}
  
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
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }

  public void setScore(Integer score2) {
    validateScore(score2);
    this.score =  score2;
  }
    
}