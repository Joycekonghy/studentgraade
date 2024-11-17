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

  private List<Grade> grades = new ArrayList<Grade>();

  public Student() {}

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

}
