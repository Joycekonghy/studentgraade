package uk.ac.ucl.comp0010.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
        System.out.println("Fetching all students...");
        List<Student> students = new ArrayList<>();
        studentRepository.findAll().forEach(students::add);
        System.out.println("Students retrieved: " + students);
        return students;
    }

    // Retrieve a student by ID
    @GetMapping("/students/{id}")
    public Student retrieveStudent(@PathVariable int id) {
        System.out.println("Fetching student with ID: " + id);
        Optional<Student> student = studentRepository.findById((long) id);
        if (student.isEmpty()) {
            System.out.println("Student with ID " + id + " not found.");
            throw new StudentNotFoundException("id-" + id);
        }
        System.out.println("Student retrieved: " + student.get());
        return student.get();
    }

    // Delete a student by ID
    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable int id) {
        System.out.println("Deleting student with ID: " + id);
        studentRepository.deleteById((long) id);
        System.out.println("Student with ID " + id + " deleted.");
    }

    // Create a new student
    @PostMapping("/students")
    public ResponseEntity<Object> createStudent(@RequestBody Student student) {
        System.out.println("Received student for creation: " + student);
    
        Student savedStudent = studentRepository.save(student);
    
        System.out.println("Saved student: " + savedStudent);
    
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedStudent.getId())
            .toUri();
    
        return ResponseEntity.created(location).build();
    }
    
    // Update an existing student by ID
    @PutMapping("/students/{id}")
    public ResponseEntity<Object> updateStudent(@RequestBody Student student, @PathVariable int id) {
        System.out.println("Updating student with ID: " + id);
        Optional<Student> studentOptional = studentRepository.findById((long) id);

        if (studentOptional.isEmpty()) {
            System.out.println("Student with ID " + id + " not found for update.");
            return ResponseEntity.notFound().build();
        }

        student.setId((long) id);
        Student updatedStudent = studentRepository.save(student);
        System.out.println("Updated student: " + updatedStudent);

        return ResponseEntity.noContent().build();
    }
}
