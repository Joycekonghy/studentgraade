package uk.ac.ucl.comp0010.controller;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.StudentRepository;

/**
 * Controller for managing students.
 * Provides REST endpoints for creating, retrieving, updating, and deleting students.
 */
@RestController
@RequestMapping("/Student")
public class StudentController {

  @Autowired
  private StudentRepository studentRepository;

  // Retrieve all students

  @GetMapping
  public ResponseEntity<List<Student>> getAllstudents() {
    List<Student> students = (List<Student>) studentRepository.findAll();
    return ResponseEntity.ok(students);
  }

  /**
   * Get a student by their unique ID.
   *
   * @param id the unique identifier of the student
   * @return the student with the given ID
   */
  @GetMapping("/{id}")
  public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
    Optional<Student> student = studentRepository.findById(id);
    if (student.isPresent()) {
      return ResponseEntity.ok(student.get());
    }
    return ResponseEntity.notFound().build();
  }

  /**
   * Add a new student or update an existing one.
   *
   * @param student the student to be added or updated
   * @return the saved student
   */
  @PostMapping
  @Transactional
  public ResponseEntity<?> addOrUpdateStudent(@RequestBody Student student) {
      // Validate input
      if (student.getUsername() == null || student.getUsername().isEmpty()) {
          return ResponseEntity.badRequest().body("Student username is required.");
      }
      if (student.getEmail() == null || student.getEmail().isEmpty()) {
          return ResponseEntity.badRequest().body("Student email is required.");
      }
      if (student.getFirstName() == null || student.getFirstName().isEmpty()) {
          return ResponseEntity.badRequest().body("Student first name is required.");
      }
      if (student.getLastName() == null || student.getLastName().isEmpty()) {
          return ResponseEntity.badRequest().body("Student last name is required.");
      }
  
      try {
        Optional<Student> existingStudent = studentRepository.findById(student.getId());
        if (existingStudent.isPresent() && !existingStudent.get().equals(student)) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body("A student with this id already exists.");
      }
      // Save only if no conflict
        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok("student saved successfully");
      } catch (Exception e) {
          return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
      }
  }
  
}
  
