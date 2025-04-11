package uk.ac.ucl.comp0010.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Represents a registration in the system.
 * <p>
 * A registration is a link between a student and a module.
 * </p>
 */

@Entity
@Table(name = "registration")
public class Registration {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false)
  private Student student;

  @ManyToOne
  @JoinColumn(name = "module_id", nullable = false)
  private Module module;

  public Registration() {}

  public Registration(Student student, Module module) {
    this.student = student;
    this.module = module;
  }

  // Get/Setters
  public Student getStudent() {
    return student;
  }

  public void setStudent(Student student) {
    this.student = student;
  }

  public Module getModule() {
    return module;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setModule(Module module) {
    this.module = module;
  }

}
