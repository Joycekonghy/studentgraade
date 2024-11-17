package uk.ac.ucl.comp0010.model;

public class Registration {

  private Student student;
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

  public void setModule(Module module) {
    this.module = module;
  }

}
