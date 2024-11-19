package uk.ac.ucl.comp0010.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

import java.util.Map;

@RestController
@RequestMapping("/grades")
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @PostMapping(value = "/addGrade")
    public ResponseEntity<Grade> addGrade(@RequestBody Map<String, String> params) {
        // Find the student by ID
        Long studentId = Long.parseLong(params.get("student_id"));
        Student student = studentRepository.findById(studentId)
          .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        // Find the module by code
        Long moduleCode = Long.parseLong(params.get("module_code"));
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
