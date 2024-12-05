package controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletResponse;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;
import uk.ac.ucl.comp0010.controller.ReportController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class ReportControllerTest {

    @InjectMocks
    private ReportController reportController;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private HttpServletResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenerateStudentReportSuccess() throws Exception {
        // Mock data
        Long studentId = 1L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");

        Module module1 = new Module("Software Engineering", "COMP0010", true);
        Module module2 = new Module("Mathematics", "MATH101", true);

        Grade grade1 = new Grade();
        grade1.setModule(module1);
        grade1.setScore(85);

        Grade grade2 = new Grade();
        grade2.setModule(module2);
        grade2.setScore(90);

        List<Grade> grades = new ArrayList<>();
        grades.add(grade1);
        grades.add(grade2);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(gradeRepository.findByStudentId(studentId)).thenReturn(grades);

        MockHttpServletResponse response = new MockHttpServletResponse();

        // Call the controller
        reportController.generateStudentReport(studentId, response);

        // Verify response
        assertEquals("application/pdf", response.getContentType());
        assertTrue(response.getHeader("Content-Disposition").contains("attachment; filename=student_report_1.pdf"));
        assertNotNull(response.getContentAsByteArray());
        assertTrue(response.getContentAsByteArray().length > 0);

        // Verify repository interactions
        verify(studentRepository, times(1)).findById(studentId);
        verify(gradeRepository, times(1)).findByStudentId(studentId);
    }

    @Test
    void testGenerateStudentReportStudentNotFound() {
        // Mock data
        Long studentId = 1L;

        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        MockHttpServletResponse response = new MockHttpServletResponse();

        // Call the controller and assert exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            reportController.generateStudentReport(studentId, response);
        });

        assertEquals("Student with ID " + studentId + " not found.", exception.getMessage());

        // Verify repository interactions
        verify(studentRepository, times(1)).findById(studentId);
        verify(gradeRepository, times(0)).findByStudentId(anyLong());
    }

    @Test
    void testGenerateStudentReportNoGrades() throws Exception {
        // Mock data
        Long studentId = 1L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(gradeRepository.findByStudentId(studentId)).thenReturn(new ArrayList<>());

        MockHttpServletResponse response = new MockHttpServletResponse();

        // Call the controller
        reportController.generateStudentReport(studentId, response);

        // Verify response
        assertEquals("application/pdf", response.getContentType());
        assertTrue(response.getHeader("Content-Disposition").contains("attachment; filename=student_report_1.pdf"));
        assertNotNull(response.getContentAsByteArray());
        assertTrue(response.getContentAsByteArray().length > 0);

        // Verify repository interactions
        verify(studentRepository, times(1)).findById(studentId);
        verify(gradeRepository, times(1)).findByStudentId(studentId);
    }

    @Test
    void testGenerateStudentReportMultiplePages() throws Exception {
    // Mock data
    Long studentId = 1L;
    Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");

    Module module = new Module("Module Name", "MODULE123", true);

    // Create a list of grades that will exceed a single page
    List<Grade> grades = new ArrayList<>();
    for (int i = 0; i < 60; i++) { // Assume each page can hold around 40 rows
        Grade grade = new Grade();
        grade.setModule(module);
        grade.setScore(75 + i % 5); // Some mock scores
        grades.add(grade);
    }

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
    when(gradeRepository.findByStudentId(studentId)).thenReturn(grades);

    MockHttpServletResponse response = new MockHttpServletResponse();

    // Call the controller
    reportController.generateStudentReport(studentId, response);

    // Verify response
    assertEquals("application/pdf", response.getContentType());
    assertTrue(response.getHeader("Content-Disposition").contains("attachment; filename=student_report_1.pdf"));

    byte[] pdfContent = response.getContentAsByteArray();
    assertNotNull(pdfContent);
    assertTrue(pdfContent.length > 0, "PDF content should not be empty");

    // Parse the PDF to verify it has multiple pages
    try (PDDocument document = PDDocument.load(pdfContent)) {
        int numberOfPages = document.getNumberOfPages();
        assertTrue(numberOfPages > 1, "PDF should have multiple pages for 60 grades");
    }

    // Verify repository interactions
    verify(studentRepository, times(1)).findById(studentId);
    verify(gradeRepository, times(1)).findByStudentId(studentId);
}


    @Test
    void testGenerateStudentReport_IOException() {
        // Mock data
        Long studentId = 1L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");

        Module module = new Module("Software Engineering", "COMP0010", true);
        Grade grade = new Grade();
        grade.setModule(module);
        grade.setScore(85);

        List<Grade> grades = new ArrayList<>();
        grades.add(grade);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(gradeRepository.findByStudentId(studentId)).thenReturn(grades);

        MockHttpServletResponse response = mock(MockHttpServletResponse.class);

        // Simulate IOException during PDF writing
        doThrow(new RuntimeException("Error writing PDF")).when(response).getOutputStream();

        // Call the controller and assert exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            reportController.generateStudentReport(studentId, response);
        });

        assertEquals("Error writing PDF", exception.getMessage());

        // Verify repository interactions
        verify(studentRepository, times(1)).findById(studentId);
        verify(gradeRepository, times(1)).findByStudentId(studentId);
    }

    @Test
    void testGenerateStudentReportIOException() throws Exception {
        // Mock data
        Long studentId = 1L;
        Student mockStudent = new Student(studentId, "John", "Doe", "jdoe", "jdoe@example.com");
    
        Module module = new Module("Software Engineering", "COMP0010", true);
        Grade grade = new Grade();
        grade.setModule(module);
        grade.setScore(85);
    
        List<Grade> grades = new ArrayList<>();
        grades.add(grade);
    
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));
        when(gradeRepository.findByStudentId(studentId)).thenReturn(grades);
    
        // Mock HttpServletResponse
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(response.getOutputStream()).thenThrow(new IOException("Mock IOException"));
    
        // Call the controller and assert exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            reportController.generateStudentReport(studentId, response);
        });
    
        // Verify the exception message
        assertEquals("Error writing PDF to output stream: Mock IOException", exception.getMessage());
    
        // Verify interactions
        verify(studentRepository, times(1)).findById(studentId);
        verify(gradeRepository, times(1)).findByStudentId(studentId);
        verify(response, times(1)).getOutputStream();
    }
    
}
