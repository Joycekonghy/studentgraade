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

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/grades")
public class GradeController {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final ModuleRepository moduleRepository;

  
    public GradeController(GradeRepository gradeRepository, ModuleRepository moduleRepository, StudentRepository studentRepository) {
        this.gradeRepository = gradeRepository;
        this.studentRepository = studentRepository;
        this.moduleRepository = moduleRepository;
    }

    @GetMapping("/grades")
    public ResponseEntity<List<Grade>> getAllGrades() {
        List<Grade> grades = (List<Grade>) gradeRepository.findAll();
        return ResponseEntity.ok(grades);
    }
    @GetMapping("/grades/{id}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
        Optional<Grade> grade = gradeRepository.findById(id);
        if (grade.isPresent()) {
            return ResponseEntity.ok(grade.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/addGrades")
    public ResponseEntity<String> addGrade(@RequestBody Map<String, Object> payload) {
        // Extract data from the payload
        Long studentId = ((Number) payload.get("student_id")).longValue();
        Long moduleId = ((Number) payload.get("module_id")).longValue();
        Integer score = (Integer) payload.get("score");
    
        // Find the student by ID
        Optional<Student> existingStudent = studentRepository.findById(studentId);
        if (!existingStudent.isPresent()) {
            return ResponseEntity.badRequest().body("Student not found with ID: " + studentId);
        }
    
        // Find the module by ID
        Optional<Module> existingModule = moduleRepository.findById(moduleId);
        if (!existingModule.isPresent()) {
            return ResponseEntity.badRequest().body("Module not found with ID: " + moduleId);
        }
    
        // Check if a grade for the student/module combination already exists
        List<Grade> existingGrades = (List<Grade>) gradeRepository.findAll();
        boolean gradeExists = existingGrades.stream()
            .anyMatch(grade -> grade.getStudent().getId()==studentId 
                            && grade.getModule().getId() == moduleId);
    
        if (gradeExists) {
            return ResponseEntity.badRequest().body("Grade already exists for student ID " + studentId + " and module ID " + moduleId);
        }
    
        // Save the new grade
        Grade grade = new Grade();
        grade.setStudent(existingStudent.get()); // Set the student entity
        grade.setModule(existingModule.get());   // Set the module entity
        grade.setScore(score);                   // Set the score
    
        gradeRepository.save(grade);
        return ResponseEntity.ok("Grade saved successfully");
    }
    
    @PostMapping("/updateGrades")
    public String postMethodName(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    

}





