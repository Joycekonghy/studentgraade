package uk.ac.ucl.comp0010.controller;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
        if (Objects.isNull(student.getId())) {
          // Add new student
          Student savedStudent = studentRepository.save(student);
          return ResponseEntity.ok(savedStudent);
        } else {
          // Update existing student
          Optional<Student> existingStudent = studentRepository.findById(student.getId());
          if (existingStudent.isPresent()) {
            Student existing = existingStudent.get();
            existing.setUsername(student.getUsername());
            existing.setEmail(student.getEmail());
            existing.setFirstName(student.getFirstName());
            existing.setLastName(student.getLastName());
            Student updatedStudent = studentRepository.save(existing);
            return ResponseEntity.ok(updatedStudent);
          } else {
            return ResponseEntity.notFound().build();
            }
          }
      } catch (DataIntegrityViolationException e) {
          return ResponseEntity.status(409).body("A student with the same username or email already exists.");
      } catch (Exception e) {
          return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
      }
  }
  

  /**
   * Delete a student by their unique ID.
   *
   * @param id the unique identifier of the student to be deleted
   * @return a ResponseEntity indicating the outcome of the deletion
   */
  @Transactional
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteStudentById(@PathVariable Long id) {
      
      try {
          studentRepository.deleteById(id);
          return ResponseEntity.noContent().build();
      } catch (DataIntegrityViolationException e) {
          return ResponseEntity.status(409).body("Cannot delete student. It is referenced by other data.");
      } catch (Exception e) {
          return ResponseEntity.status(500).body("An unexpected error occurred.");
      }
  }
}
  
