package uk.ac.ucl.comp0010.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import java.util.Map;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import java.util.Map;
import uk.ac.ucl.comp0010.repository.StudentRepository;

import java.util.Map;

/**
 * REST controller for managing grades.
 * <p>
 * Provides endpoints for adding and managing grades for students
 * and their associated modules.
 * </p>
 */
@RestController
@RequestMapping("/grades")
public class GradeController {

  @Autowired
  private GradeRepository gradeRepository;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private ModuleRepository moduleRepository;

    /**
     * Adds a grade for a student in a specific module.
     *
     * @param params a map containing the student ID, module code, and grade score.
     * @return the saved {@link Grade} object wrapped in a {@link ResponseEntity}.
     */
  @PostMapping(value = "/addGrade")
    public ResponseEntity<Grade> addGrade(@RequestBody Map<String, String> params) {
        // Find the student by ID
    Long studentId = Long.parseLong(params.get("student_id"));
    Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        // Find the module by code
        String moduleCode = params.get("module_code");
        Module module = moduleRepository.findById(moduleCode)
                .orElseThrow(() -> new IllegalArgumentException("Module not found"));

        // Create a Grade object and set values
        Grade grade = new Grade(student, module, Integer.parseInt(params.get("score")));

        // Save the Grade object
        Grade savedGrade = gradeRepository.save(grade);

        // Return the saved Grade object
        return ResponseEntity.ok(savedGrade);
    }
}
