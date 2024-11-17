package uk.ac.ucl.comp0010.model;

import java.util.ArrayList;
import java.util.List;
import uk.ac.ucl.comp0010.exception.NoGradeAvailableException;


public class Student {
  private Long id;

  private String firstName;
  private String lastName;
  private String username;
  private String email;

  private List<Grade> grades;
  private List<Module> modules;

  public Student(Long id, String firstName, String lastName, String username, String email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;

    this.grades = new ArrayList<Grade>();
    this.modules = new ArrayList<Module>();
  }

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
    grades.Add(g);
  }

  public Grade getGrade(Module m) {
    for (Grade grade : grades) {
      if (grade.getModule().equals(m)) {
        return grade;
      }
    }
    // if not found
    throw new NoGradeAvaliableException("No grade for this module");
  }

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
