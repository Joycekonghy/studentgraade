package controller;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.StudentRepository;
import uk.ac.ucl.comp0010.controller.StudentController;
class StudentControllerTest {
    @Mock
    private StudentRepository studentRepository;
    @InjectMocks
    private StudentController studentController;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testGetAllStudents_Success() {
        // Arrange
        List<Student> mockStudents = List.of(
            new Student(1L, "user1", "user1@example.com", "John", "Doe"),
            new Student(2L, "user2", "user2@example.com", "Jane", "Doe")
        );
        when(studentRepository.findAll()).thenReturn(mockStudents);
        // Act
        ResponseEntity<List<Student>> response = studentController.getAllstudents();
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody(), "should not be null");
        assertEquals(2, response.getBody().size());
    }
    @Test
    void testGetStudentById_Found() {
        // Arrange
        Student mockStudent = new Student(1L, "John", "Doe", "johndoe", "user1@example.com");
        when(studentRepository.findById(1L)).thenReturn(Optional.of(mockStudent));
        // Act
        ResponseEntity<Student> response = studentController.getStudentById(1L);
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody(), "should not be null");
        assertEquals("John", response.getBody().getFirstName());
    }
    @Test
    void testGetStudentById_NotFound() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());
        // Act
        ResponseEntity<Student> response = studentController.getStudentById(1L);
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testAddOrUpdateStudent_Success() {
        // Arrange
        Student newStudent = new Student((Long)2L, "John", "Doe", "johndoe", "user1@example.com");
        Student savedStudent = new Student((Long)2L, "John", "Doe", "johndoe", "user1@example.com");
        
        when(studentRepository.findById(2L)).thenReturn(Optional.of(newStudent));
        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);
        // Act
        ResponseEntity<?> response = studentController.addOrUpdateStudent(newStudent);
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody(), "should not be null");
        assertEquals("student saved successfully", response.getBody());
    }
    @Test
    void testAddOrUpdateStudent_EmailValidationError() {
        Student invalidStudent = new Student(2L, "John", "Doe", "johndoe", "");
        Student invalidStudent2 = new Student(2L, "John", "Doe", "johndoe", null);
        
        ResponseEntity<?> response = studentController.addOrUpdateStudent(invalidStudent);
        ResponseEntity<?> response2 = studentController.addOrUpdateStudent(invalidStudent2);
        
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student email is required.", response.getBody());
        
        assertNotNull(response2);
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
        assertEquals("Student email is required.", response2.getBody());
    }

    @Test
    void testAddOrUpdateStudent_firstNameValidationError() {
        Student invalidStudent = new Student(2L, "", "Doe", "johndoe", "jd@example.com");
        Student invalidStudent2 = new Student(2L, null, "Doe", "johndoe", "jd@example.com");

        ResponseEntity<?> response = studentController.addOrUpdateStudent(invalidStudent);
        ResponseEntity<?> response2 = studentController.addOrUpdateStudent(invalidStudent2);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student first name is required.", response.getBody());

        assertNotNull(response2);
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
        assertEquals("Student first name is required.", response2.getBody());
    }

    @Test
    void testAddOrUpdateStudent_lastNameValidationError() {
        Student invalidStudent = new Student(2L, "John", "", "johndoe", "jd@example.com");
        Student invalidStudent2 = new Student(2L, "John", null, "johndoe", "jd@example.com");


        ResponseEntity<?> response = studentController.addOrUpdateStudent(invalidStudent);
        ResponseEntity<?> response2 = studentController.addOrUpdateStudent(invalidStudent2);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student last name is required.", response.getBody());

        assertNotNull(response2);
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
        assertEquals("Student last name is required.", response2.getBody());
    }

    @Test
    void testAddOrUpdateStudent_usernameValidationError() {

        Student invalidStudent = new Student(2L, "John", "Doe", "", "jd@example.com");
        Student invalidStudent2 = new Student(2L, "John", "Doe", null, "jd@exmaple.com");

        ResponseEntity<?> response = studentController.addOrUpdateStudent(invalidStudent);
        ResponseEntity<?> response2 = studentController.addOrUpdateStudent(invalidStudent2);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student username is required.", response.getBody());

        assertNotNull(response2);
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
        assertEquals("Student username is required.", response2.getBody());
    }

    @Test
    void testAddOrUpdateStudent_Conflict() {
        // Arrange
        Student existingStudent = new Student(2L, "existing", "user", "exist", "exist@example.com");
        Student newStudent = new Student(2L, "Joh", "Doe", "johndoe", "johndoe@example.com");
    
        // Mock findById to return an existing student
        when(studentRepository.findById(2L)).thenReturn(Optional.of(existingStudent));
    
        // Act
        ResponseEntity<?> response = studentController.addOrUpdateStudent(newStudent);
    
        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("A student with this id already exists.", response.getBody());
    }

    @Test
    void testAddOrUpdateStudent_noExistingStudent() {
        // Arrange
        Student existingStudent = new Student(4L, "existing", "user", "exist", "exist@example.com");
        Student newStudent = new Student(2L, "Joh", "Doe", "johndoe", "johndoe@example.com");
        
        // Mock findById to return an existing student
        List<Student> existingStudents = new ArrayList<>();
        existingStudents.add(existingStudent);

        when(studentRepository.findAll()).thenReturn(existingStudents);
        
        // Act
        ResponseEntity<?> response = studentController.addOrUpdateStudent(newStudent);
        
        // Assert

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("student saved successfully", response.getBody());
    }

    @Test
    void testAddOrUpdateStudent_InternalServerError() {
        // Arrange
        Student newStudent = new Student(null, "user1", "user1@example.com", "John", "Doe");
        when(studentRepository.save(newStudent)).thenThrow(new RuntimeException("Unexpected error"));
        // Act
        ResponseEntity<?> response = studentController.addOrUpdateStudent(newStudent);
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("An unexpected error occurred"));
    }
}