package uk.ac.ucl.comp0010.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import uk.ac.ucl.comp0010.exception.NoGradeAvailableException;



/**
 * Represents a student in the system.
 * <p>
 * A student is a person who is registered in the system and can
 * register for modules and receive grades.
 * </p>
 */

@Entity
@Table(name = "Student")
public class Student {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  private String email;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Grade> grades;

  @ManyToMany
  private List<Module> modules;

  /**
   * Creates a new student with the given ID, first name, last name, username, and email.
   *
   * @param id the ID of the student
   * @param firstName the first name of the student
   * @param lastName the last name of the student
   * @param username the username of the student
   * @param email the email of the student
   */

  public Student() {}

  public Student(Long id, String username, String email, String firstName, String lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;

    this.grades = new ArrayList<Grade>();
    this.modules = new ArrayList<Module>();
  }

  /**
   * Computes the average grade of the student.
   *
   * @return the average grade of the student
   * @throws NoGradeAvailableException if no grades are available for the student
   */
  public float computeAverage() throws NoGradeAvailableException {
    if (grades.isEmpty()) {
      throw new NoGradeAvailableException("There are no grades available for student");
    }
    float total = 0;
    for (Grade grade : grades) {
      total += grade.getScore();
    }
    return total / grades.size();
  }

  public void addGrade(Grade g) {
    grades.add(g);
  }

  /**
   * Gets the grade for a specific module.
   *
   * @param m the module to get the grade for
   * @return the grade for the module
   * @throws NoGradeAvailableException if no grade is available for the module
   */
  public Grade getGrade(Module m) throws NoGradeAvailableException {
    for (Grade grade : grades) {
      if (grade.getModule().equals(m)) {
        return grade;
      }
    }
    // if not found
    throw new NoGradeAvailableException("No grade for this module");
  }

  /**
   * Registers the student for a module.
   *
   * @param m the module to register the student for
   */
  public void registerModule(Module m) {
    if (!modules.contains(m)) {
      modules.add(m);
      m.setRegisteredStudent(this);
    }
  }

  // Get/Setters
  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public List<Module> getRegisteredModules() {
    return modules;
  }

  public void setRegisteredModules(List<Module> modules) {
    this.modules = modules;
  }


}