package uk.ac.ucl.comp0010.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.StudentRepository;
import java.util.Objects;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // Retrieve all students

    @GetMapping
    public ResponseEntity<List<Student>> getAllstudents() {
        List<Student> students = (List<Student>) studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    // Retrieve a student by ID

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> addOrUpdateStudent(@RequestBody Student student) {
        // Validate input using a helper method
        String validationError = validateStudentInput(student);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
    
        try {
            // Check if the student already exists by ID
            Optional<Student> existingStudent = studentRepository.findById(student.getId());
            if (existingStudent.isPresent()) {
                // Update the existing student's details
                Student existing = existingStudent.get();
                existing.setUsername(student.getUsername());
                existing.setEmail(student.getEmail());
                existing.setFirstName(student.getFirstName());
                existing.setLastName(student.getLastName());
                Student updatedStudent = studentRepository.save(existing);
                return ResponseEntity.ok(updatedStudent);
            }
    
            // Save the new student record
            Student savedStudent = studentRepository.save(student);
            return ResponseEntity.ok(savedStudent);
        } catch (DataIntegrityViolationException e) {
            // Handle database constraint violations (e.g., duplicate ID)
            return ResponseEntity.status(409).body("Student ID already exists in the database.");
        } catch (Exception e) {
            // Log unexpected exceptions and return a generic error message
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }
    
    // Helper method for input validation
    private String validateStudentInput(Student student) {
        if (Objects.isNull(student.getId()) || student.getId() <= 0) {
            return "Student ID is required and must be a positive number.";
        }
        if (student.getUsername() == null || student.getUsername().trim().isEmpty()) {
            return "Student username is required.";
        }
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            return "Student email is required.";
        }
        if (student.getFirstName() == null || student.getFirstName().trim().isEmpty()) {
            return "Student first name is required.";
        }
        if (student.getLastName() == null || student.getLastName().trim().isEmpty()) {
            return "Student last name is required.";
        }
        return null; // No validation errors
    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentById(@PathVariable Long id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            studentRepository.delete(student.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

  
}
