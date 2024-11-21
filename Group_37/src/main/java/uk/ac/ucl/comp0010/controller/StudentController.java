package uk.ac.ucl.comp0010.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import uk.ac.ucl.comp0010.exception.StudentNotFoundException;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.StudentRepository;

@RestController
public class StudentController {

  @Autowired
  private StudentRepository studentRepository;

  // Retrieve all students
@GetMapping("/students")
public List<Student> retrieveAllStudents() {
    // Convert Iterable to List
    List<Student> students = new ArrayList<>();
    studentRepository.findAll().forEach(students::add);
    return students;
}

  // Retrieve a student by ID
  @GetMapping("/students/{id}")
  public Student retrieveStudent(@PathVariable int id) {
    // Search for a student by their ID
    Optional<Student> student = studentRepository.findById((long) id);

    // If student not found, throw exception
    if (student.isEmpty()) {
      throw new StudentNotFoundException("id-" + id);
    }

    // Return the student if found
    return student.get();
  }

  // Delete a student by ID
  @DeleteMapping("/students/{id}")
  public void deleteStudent(@PathVariable int id) {
    // Deletes a student by their ID from the database
    studentRepository.deleteById((long) id);
  }

  // Create a new student
  @PostMapping("/students")
  public ResponseEntity<Object> createStudent(@RequestBody Student student) {
    // Save the new student to the database
    Student savedStudent = studentRepository.save(student);

    // Generate URI for the newly created student
    URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
        .buildAndExpand(savedStudent.getId()).toUri();

    // Return a 201 Created response with the URI of the new student
    return ResponseEntity.created(location).build();
  }

  // Update an existing student by ID
  @PutMapping("/students/{id}")
  public ResponseEntity<Object> updateStudent(@RequestBody Student student, @PathVariable int id) {

    // Check if the student exists in the database
    Optional<Student> studentOptional = studentRepository.findById((long) id);

    // If the student does not exist, return a 404 Not Found response
    if (studentOptional.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    // Set the ID and save the updated student information
    student.setId(id);
    studentRepository.save(student);

    // Return a 204 No Content response to indicate successful update
    return ResponseEntity.noContent().build();
  }
}
