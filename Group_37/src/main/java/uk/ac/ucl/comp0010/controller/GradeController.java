package uk.ac.ucl.comp0010.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.RegistrationRepository;

/**
 * The GradeController class is a REST controller that handles HTTP requests related to grades.
 * It provides endpoints for getting all grades, getting a grade by ID, and adding a new grade.
 */

@RestController
@RequestMapping("/grades")
public class GradeController {

  private final GradeRepository gradeRepository;
  private final RegistrationRepository registrationRepository;

  /**
 * Constructor for the GradeController class.
 *
 * @param gradeRepository The repository for grades
 * @param registrationRepository The repository for registrations
 */

  public GradeController(GradeRepository gradeRepository, 
                        RegistrationRepository registrationRepository) {
    this.gradeRepository = gradeRepository;
    this.registrationRepository = registrationRepository;
  }

  @GetMapping("/grades")
  public ResponseEntity<List<Grade>> getAllGrades() {
    List<Grade> grades = (List<Grade>) gradeRepository.findAll();
    return ResponseEntity.ok(grades);
  }
  
  /**
 * Get a grade by its unique ID.
 *
 * @param id The unique identifier of the grade
 * @return The grade with the given ID
 */
  @GetMapping("/grades/{id}")
  public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
    Optional<Grade> grade = gradeRepository.findById(id);
    if (grade.isPresent()) {
      return ResponseEntity.ok(grade.get());
    }
    return ResponseEntity.notFound().build();
  }

  /**
 * Get a grade by its unique ID.
 *
 * @return The grade with the given ID
 */
  @PostMapping("/addGrades")
  public ResponseEntity<String> addGrade(@RequestBody Map<String, Object> payload) {
    // Extract data from the payload
    long studentId = ((Number) payload.get("student_id")).longValue();
    long moduleId = ((Number) payload.get("module_id")).longValue();
      
    Optional<Registration> existingRegistration = 
                registrationRepository.findByStudentIdAndModuleId(studentId, moduleId);
    if (!existingRegistration.isPresent()) {
      return ResponseEntity.badRequest().body("Student is not registered for the module.");
    }

    List<Grade> existingGrades = (List<Grade>) gradeRepository.findAll();
    boolean gradeExists = existingGrades.stream()
        .anyMatch(grade -> grade.getStudent().getId() == studentId
              && grade.getModule().getId() == moduleId);
    if (gradeExists) {
      return ResponseEntity.badRequest().body("Grade already exists.");
    }

    // Save the new grade
    Double score = ((Number) payload.get("score")).doubleValue(); // Accepting double values
    Grade grade = new Grade();
    Registration registration = existingRegistration.get();
    grade.setStudent(registration.getStudent()); // Set the student entity
    grade.setModule(registration.getModule());   // Set the module entity
    grade.setScore(score);                       // Set the score
    gradeRepository.save(grade);
    return ResponseEntity.ok("Grade saved successfully");
  }
}






