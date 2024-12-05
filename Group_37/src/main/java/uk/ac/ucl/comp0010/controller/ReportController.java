package uk.ac.ucl.comp0010.controller;

import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;
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

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private GradeRepository gradeRepository;

   
    @GetMapping(value = "/student/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
public void generateStudentReport(@PathVariable("id") Long studentId, HttpServletResponse response) {
    try {
        // Fetch student details
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student with ID " + studentId + " not found."));

        // Fetch grades with modules in one query
        List<Grade> grades = gradeRepository.findByStudentId(studentId);

        // Set response headers for PDF
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader("Content-Disposition", "attachment; filename=student_report_" + studentId + ".pdf");

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            int yPosition = 750;

            // Add Title
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 20);
            contentStream.newLineAtOffset(100, yPosition);
            contentStream.showText("Student Report");
            contentStream.endText();

            // Add Student Information
            yPosition -= 50;
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA, 14);
            contentStream.newLineAtOffset(50, yPosition);
            contentStream.showText("Name: " + student.getFirstName() + " " + student.getLastName());
            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("Email: " + student.getEmail());
            contentStream.endText();

            // Add Grades Table Header
            yPosition -= 50;
            yPosition -= 50;
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.newLineAtOffset(50, yPosition);
            contentStream.showText("Module Name");
            contentStream.newLineAtOffset(200, 0); // Column spacing
            contentStream.showText("Module Code");
            contentStream.newLineAtOffset(150, 0); // Column spacing
            contentStream.showText("Grade");
            contentStream.endText();
            // Add Grades
            for (Grade grade : grades) {
                if (yPosition < 100) {
                    // Close the current content stream before starting a new page
                    contentStream.close();

                    page = new PDPage();
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = 750;
                }

                yPosition -= 20;

                contentStream.beginText();
                contentStream.newLineAtOffset(50, yPosition);
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