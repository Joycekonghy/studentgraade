package controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.RegistrationRepository;
import uk.ac.ucl.comp0010.controller.GradeController;

class GradeControllerTest {

  @Mock
  private GradeRepository gradeRepository;

  @Mock
  private RegistrationRepository registrationRepository;

  @InjectMocks
  private GradeController gradeController;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetAllGrades() {
    // Mock data
    Grade grade1 = new Grade();
    Grade grade2 = new Grade();
    List<Grade> grades = Arrays.asList(grade1, grade2);

    when(gradeRepository.findAll()).thenReturn(grades);

    // Call the controller
    ResponseEntity<List<Grade>> response = gradeController.getAllGrades();

    // Verify
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
    verify(gradeRepository, times(1)).findAll();
  }

  @Test
  void testGetGradeByIdFound() {
    // Mock data
    Grade grade = new Grade();
    grade.setId(1L);

    when(gradeRepository.findById(1L)).thenReturn(Optional.of(grade));

    // Call the controller
    ResponseEntity<Grade> response = gradeController.getGradeById(1L);

    // Verify
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(1L, response.getBody().getId());
    verify(gradeRepository, times(1)).findById(1L);
  }

  @Test
  void testGetGradeByIdNotFound() {
    when(gradeRepository.findById(1L)).thenReturn(Optional.empty());
    // Call the controller
    ResponseEntity<Grade> response = gradeController.getGradeById(1L);
    // Verify
    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    assertNull(response.getBody());
    verify(gradeRepository, times(1)).findById(1L);
  }

  @Test
  void testAddGradeSuccess() {
    // Mock data
    Student student = new Student();
    student.setId(1L);
    Module module = new Module();
    module.setId(1L);
    Registration registration = new Registration();
    registration.setStudent(student);
    registration.setModule(module);

    when(registrationRepository.findByStudentIdAndModuleId(1L, 1L))
          .thenReturn(Optional.of(registration));
    when(gradeRepository.findAll()).thenReturn(Collections.emptyList());

    // Payload
    Map<String, Object> payload = new HashMap<>();
    payload.put("student_id", 1L);
    payload.put("module_id", 1L);
    payload.put("score", 85);

    // Call the controller
    ResponseEntity<String> response = gradeController.addGrade(payload);

    // Verify
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("Grade saved successfully", response.getBody());
    verify(registrationRepository, times(1)).findByStudentIdAndModuleId(1L, 1L);
    verify(gradeRepository, times(1)).save(any(Grade.class));
  }

  @Test
  void testAddGradeStudentNotRegistered() {
    when(registrationRepository.findByStudentIdAndModuleId(1L, 1L))
        .thenReturn(Optional.empty());

    // Payload
    Map<String, Object> payload = new HashMap<>();
    payload.put("student_id", 1L);
    payload.put("module_id", 1L);
    payload.put("score", 85);

    // Call the controller
    ResponseEntity<String> response = gradeController.addGrade(payload);

    // Verify
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertEquals("Student is not registered for the module.", response.getBody());
    verify(registrationRepository, times(1)).findByStudentIdAndModuleId(1L, 1L);
    verify(gradeRepository, times(0)).save(any());
  }
  
  @Test
  void testGradeExistsFalse() {
    // Mock data
    Long studentId = 1L;
    Long moduleId = 102L;


    Student student = new Student();
    student.setId(studentId);
    Module module = new Module();
    module.setId(moduleId);
    Registration mockRegistration = new Registration(student, module);
    List<Grade> existingGrades = new ArrayList<>(); 

    when(registrationRepository.findByStudentIdAndModuleId(1L, 102L))
    .thenReturn(Optional.of( mockRegistration));
    when(gradeRepository.findAll()).thenReturn(existingGrades);

// No grades exist in this case

    Grade newGrade = new Grade();
    newGrade.setStudent(mockRegistration.getStudent());
    newGrade.setModule(mockRegistration.getModule());
    newGrade.setScore(85.0);

    when(gradeRepository.save(any(Grade.class))).thenReturn(newGrade);

    Map<String, Object> payload = new HashMap<>();
    payload.put("student_id", studentId);
    payload.put("module_id", moduleId);
    payload.put("score", 85);

    // Call the method with the mocked data
    ResponseEntity<String> response = gradeController.addGrade(payload);

    // Verify
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("Grade saved successfully", response.getBody());
    verify(gradeRepository, times(1)).save(any(Grade.class));
  }
    
  @Test
    void testGradeExistsFalse_differentModule() {
        // Mock data
        Long studentId = 1L;
        Long moduleId = 102L;


        Student student = new Student();
        student.setId(studentId);
        Module module = new Module();
        module.setId(123L);
        Registration mockRegistration = new Registration(student, module);

        Grade newGrades = new Grade(student, module, 85.0);
        List<Grade> existingGrades = new ArrayList<>(); 
        existingGrades.add(newGrades);

        when(registrationRepository.findByStudentIdAndModuleId(1L, 102L))
        .thenReturn(Optional.of( mockRegistration));
        when(gradeRepository.findAll()).thenReturn(existingGrades);
        Grade newGrade = new Grade();
        newGrade.setStudent(mockRegistration.getStudent());
        newGrade.setModule(mockRegistration.getModule());
        newGrade.setScore(85.0);

        when(gradeRepository.save(any(Grade.class))).thenReturn(newGrade);

        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", studentId);
        payload.put("module_id", moduleId);
        payload.put("score", 85);

        // Call the method with the mocked data
        ResponseEntity<String> response = gradeController.addGrade(payload);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Grade saved successfully", response.getBody());
        verify(gradeRepository, times(1)).save(any(Grade.class));
    }

    @Test
    void testGradeExistsFalse_differentStudent() {
        // Mock data
        Long studentId = 1L;
        Long moduleId = 102L;


        Student student = new Student();
        student.setId(123L);
        Module module = new Module();
        module.setId(moduleId);
        Registration mockRegistration = new Registration(student, module);

        Grade newGrades = new Grade(student, module, 85.0);
        List<Grade> existingGrades = new ArrayList<>(); 
        existingGrades.add(newGrades);

        when(registrationRepository.findByStudentIdAndModuleId(1L, 102L))
        .thenReturn(Optional.of( mockRegistration));
        when(gradeRepository.findAll()).thenReturn(existingGrades);
        Grade newGrade = new Grade();
        newGrade.setStudent(mockRegistration.getStudent());
        newGrade.setModule(mockRegistration.getModule());
        newGrade.setScore(85.0);

        when(gradeRepository.save(any(Grade.class))).thenReturn(newGrade);

        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", studentId);
        payload.put("module_id", moduleId);
        payload.put("score", 85);

        // Call the method with the mocked data
        ResponseEntity<String> response = gradeController.addGrade(payload);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Grade saved successfully", response.getBody());
        verify(gradeRepository, times(1)).save(any(Grade.class));
    }
    @Test
    void testAddGradeAlreadyExists() {
        // Mock data
        Student student = new Student();
        student.setId(1L);
        Module module = new Module();
        module.setId(1L);
        Registration registration = new Registration();
        registration.setStudent(student);
        registration.setModule(module);

        Grade existingGrade = new Grade();
        existingGrade.setStudent(student);
        existingGrade.setModule(module);

        when(registrationRepository.findByStudentIdAndModuleId(1L, 1L))
                .thenReturn(Optional.of(registration));
        when(gradeRepository.findAll()).thenReturn(Collections.singletonList(existingGrade));

        // Payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", 1L);
        payload.put("module_id", 1L);
        payload.put("score", 85);

        // Call the controller
        ResponseEntity<String> response = gradeController.addGrade(payload);

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Grade already exists.", response.getBody());
        verify(registrationRepository, times(1)).findByStudentIdAndModuleId(1L, 1L);
        verify(gradeRepository, times(0)).save(any());
    }
}
