package uk.ac.ucl.comp0010.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import uk.ac.ucl.comp0010.model.Student;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @Test
    public void testSaveAndFindById() {
        // Create and save a Student
        Student student = new Student((long)123, "John", "Doe", "johndoe", "john@example.com");
        Student savedStudent = studentRepository.save(student);

        // Fetch the student by ID
        Optional<Student> retrievedStudent = studentRepository.findById(savedStudent.getId());

        // Assertions
        assertTrue(retrievedStudent.isPresent());
        assertEquals("John", retrievedStudent.get().getFirstName());
        assertEquals("Doe", retrievedStudent.get().getLastName());
    }

    @Test
    public void testFindByUsername() {
        // Create and save a Student
        Student student = new Student((long)1234, "Jane", "Smith", "janesmith", "jane@example.com");
        studentRepository.save(student);

        // Fetch the student by username
        Optional<Student> retrievedStudent = studentRepository.findByUsername("janesmith");

        // Assertions
        assertTrue(retrievedStudent.isPresent());
        assertEquals("Jane", retrievedStudent.get().getFirstName());
        assertEquals("Smith", retrievedStudent.get().getLastName());
    }
}
