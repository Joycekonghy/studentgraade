package controller;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import uk.ac.ucl.comp0010.controller.RegistrationController;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.RegistrationRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RegistrationControllerTest {

    @InjectMocks
    private RegistrationController registrationController;

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ModuleRepository moduleRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllRegistrations() {
        // Mock repository
        List<Registration> mockRegistrations = new ArrayList<>();
        Registration registration1 = new Registration();
        registration1.setId(1L);
        Registration registration2 = new Registration();
        registration2.setId(2L);

        mockRegistrations.add(registration1);
        mockRegistrations.add(registration2);

        when(registrationRepository.findAll()).thenReturn(mockRegistrations);

        // Call controller
        ResponseEntity<List<Registration>> response = registrationController.getAllRegistrations();

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(registrationRepository, times(1)).findAll();
    }

    @Test
    void testRegisterModuleSuccess() {
        // Mock data
        Long studentId = 1L;
        Long moduleId = 101L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");
        Module mockModule = new Module("COMP0010", "Software Engineering", Boolean.TRUE);
        mockModule.setId(moduleId);

        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", studentId);
        payload.put("module_id", moduleId);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(moduleRepository.findById(moduleId)).thenReturn(Optional.of(mockModule));
        when(registrationRepository.findAll()).thenReturn(new ArrayList<>()); // No existing registrations

        // Call controller
        ResponseEntity<String> response = registrationController.registerModule(payload);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Registration saved successfully", response.getBody());
        verify(registrationRepository, times(1)).save(any(Registration.class));
    }

    @Test
    void testRegisterModuleStudentNotFound() {
        // Mock data
        Long studentId = 1L;
        Long moduleId = 101L;

        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", studentId);
        payload.put("module_id", moduleId);

        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        // Call controller
        ResponseEntity<String> response = registrationController.registerModule(payload);

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student not found with ID: " + studentId, response.getBody());
        verify(studentRepository, times(1)).findById(studentId);
        verify(moduleRepository, times(0)).findById(anyLong());
        verify(registrationRepository, times(0)).save(any(Registration.class));
    }

    @Test
    void testRegisterModuleModuleNotFound() {
        // Mock data
        Long studentId = 1L;
        Long moduleId = 101L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");

        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", studentId);
        payload.put("module_id", moduleId);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(moduleRepository.findById(moduleId)).thenReturn(Optional.empty());

        // Call controller
        ResponseEntity<String> response = registrationController.registerModule(payload);

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Module not found with ID: " + moduleId, response.getBody());
        verify(studentRepository, times(1)).findById(studentId);
        verify(moduleRepository, times(1)).findById(moduleId);
        verify(registrationRepository, times(0)).save(any(Registration.class));
    }

    @Test
    void testRegisterModuleAlreadyExists() {
        // Mock data
        Long studentId = 1L;
        Long moduleId = 101L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");
        Module mockModule = new Module("Software Engineering", "COMP0010", Boolean.TRUE);
        mockModule.setId(moduleId);

        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", studentId);
        payload.put("module_id", moduleId);

        // Existing registration
        Registration existingRegistration = new Registration();
        existingRegistration.setStudent(mockStudent);
        existingRegistration.setModule(mockModule);
        List<Registration> existingRegistrations = new ArrayList<>();
        existingRegistrations.add(existingRegistration);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(moduleRepository.findById(moduleId)).thenReturn(Optional.of(mockModule));
        when(registrationRepository.findAll()).thenReturn(existingRegistrations);

        // Call controller
        ResponseEntity<String> response = registrationController.registerModule(payload);

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Registration already exists.", response.getBody());
        verify(studentRepository, times(1)).findById(studentId);
        verify(moduleRepository, times(1)).findById(moduleId);
        verify(registrationRepository, times(0)).save(any(Registration.class));
    }
}
