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
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

/**
 * The GradeController class is a REST controller that handles HTTP requests related to grades.
 * It provides endpoints for getting all grades, getting a grade by ID, and adding a new grade.
 */

@RestController
@RequestMapping("/grades")
public class GradeController {

  private final GradeRepository gradeRepository;
  private final StudentRepository studentRepository;
  private final ModuleRepository moduleRepository;

  /**
 * Constructor for the GradeController class.
 *
 * @param gradeRepository The repository for grades
 * @param moduleRepository The repository for modules
 * @param studentRepository The repository for students
 */

  public GradeController(GradeRepository gradeRepository, 
                        ModuleRepository moduleRepository, 
                        StudentRepository studentRepository) {
    this.gradeRepository = gradeRepository;
    this.studentRepository = studentRepository;
    this.moduleRepository = moduleRepository;
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
    Long studentId = ((Number) payload.get("student_id")).longValue();
    Long moduleId = ((Number) payload.get("module_id")).longValue();
    
    // Find the student by ID
    Optional<Student> existingStudent = studentRepository.findById(studentId);
    if (!existingStudent.isPresent()) {
      return ResponseEntity.badRequest().body("Student not found with ID: " + studentId);
    }
    // Find the module by ID
    Optional<Module> existingModule = moduleRepository.findById(moduleId);
    if (!existingModule.isPresent()) {
      return ResponseEntity.badRequest().body("Module not found with ID: " + moduleId);
    }

    List<Grade> existingGrades = (List<Grade>) gradeRepository.findAll();
    boolean gradeExists = existingGrades.stream()
        .anyMatch(grade -> grade.getStudent().getId() == studentId 
                && grade.getModule().getId() == moduleId);
    if (gradeExists) {
      return ResponseEntity.badRequest().body("Grade already exists.");
    }
    // Save the new grade
    Integer score = (Integer) payload.get("score");
    Grade grade = new Grade();
    grade.setStudent(existingStudent.get()); // Set the student entity
    grade.setModule(existingModule.get());   // Set the module entity
    grade.setScore(score);                   // Set the score
    gradeRepository.save(grade);
    return ResponseEntity.ok("Grade saved successfully");
  }
}





