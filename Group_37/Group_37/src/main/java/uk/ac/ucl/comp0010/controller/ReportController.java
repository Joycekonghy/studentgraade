package uk.ac.ucl.comp0010.controller;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;



/**
 * Controller for generating student reports.
 * Provides a REST endpoint for generating a PDF report for a student.
 */
@RestController
@RequestMapping("/reports")
public class ReportController {
  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private GradeRepository gradeRepository;
 
  /**
   * Generate a PDF report for a student.
   *
   * @param studentId The unique identifier of the student
   * @param response The HTTP response object
   */
  @GetMapping(value = "/student/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
  public void generateStudentReport(@PathVariable("id") Long studentId, 
                  HttpServletResponse response) {
    try {
      // Fetch student details
      Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> 
            new RuntimeException("Student with ID " + studentId + " not found."));

      // Fetch grades with modules in one query
      List<Grade> grades = gradeRepository.findByStudentId(studentId);

      // Set response headers for PDF
      response.setContentType(MediaType.APPLICATION_PDF_VALUE);
      response.setHeader("Content-Disposition",
               "attachment; filename=student_report_" + studentId + ".pdf");

      try (PDDocument document = new PDDocument()) {
        PDPage page = new PDPage();
        document.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(document, page);

        int verticalPos = 750;

        // Add Title
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 20);
        contentStream.newLineAtOffset(100, verticalPos);
        contentStream.showText("Student Report");
        contentStream.endText();

        // Add Student Information
        verticalPos -= 50;
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA, 8);
        contentStream.newLineAtOffset(50, verticalPos);
        contentStream.showText("Name: " + student.getFirstName() + " " + student.getLastName());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Email: " + student.getEmail());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Id: " + student.getId());
        contentStream.endText();

        verticalPos -= 20;
        // Add Grades Table Header
        verticalPos -= 50;
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
        contentStream.newLineAtOffset(50, verticalPos);
        contentStream.showText("Module Name");
        contentStream.newLineAtOffset(200, 0); // Column spacing
        contentStream.showText("Module Code");
        contentStream.newLineAtOffset(150, 0); // Column spacing
        contentStream.showText("Grade");
        contentStream.endText();
        // Add Grades
        for (Grade grade : grades) {
          if (verticalPos < 100) {
            // Close the current content stream before starting a new page
            contentStream.close();
            page = new PDPage();
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
            verticalPos = 750;
          }
          verticalPos -= 20;

          contentStream.beginText();
          contentStream.setFont(PDType1Font.HELVETICA, 12);
          contentStream.newLineAtOffset(50, verticalPos);
          contentStream.showText(grade.getModule().getName()); // Module Name
          contentStream.newLineAtOffset(200, 0); // Move to Module Code column
          contentStream.showText(grade.getModule().getCode()); // Module Code
          contentStream.newLineAtOffset(150, 0); // Move to Grade column
          contentStream.showText(String.valueOf(grade.getScore())); // Grade
          contentStream.endText();
        }
        // Close the final content stream
        contentStream.close();
        // Write PDF to the response
        document.save(response.getOutputStream());
        response.getOutputStream().flush();
      }
    } catch (IOException ex) {
      throw new RuntimeException("Error writing PDF to output stream: " + ex.getMessage(), ex);
    }
  }
}