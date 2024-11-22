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
 * Represents a module in the system.
 * <p>
 * A module is a unit of study that students can register for.
 * </p>
 */

@Entity
@Table(name = "Modules")
public class Module {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true) // Ensure module codes are unique
  private String code;

  @Column(nullable = false)
  private Boolean mnc = false;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = true)
  private Student registeredStudent;

  // Default constructor required by JPA
  public Module() {}

  /**
   * Creates a new module with the given name, code, and MNC status.
   *
   * @param name the name of the module
   * @param code the code of the module
   * @param mnc whether the module is an MNC module
   */
  public Module(String name, String code, Boolean mnc) {
    this.name = name;
    this.code = code;
    this.mnc = mnc;
    this.registeredStudent = null;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Boolean getMnc() {
    return mnc;
  }

  public void setMnc(Boolean mnc) {
    this.mnc = mnc;
  }

  public Student getRegisteredStudent() {
    return registeredStudent;
  }

  public void setRegisteredStudent(Student registeredStudent) {
    this.registeredStudent = registeredStudent;
  }
}
