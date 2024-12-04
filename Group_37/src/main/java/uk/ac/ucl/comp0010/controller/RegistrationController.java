package uk.ac.ucl.comp0010.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.RegistrationRepository;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

/**
 * The RegistrationController class is a REST controller that handles HTTP requests related to Registrations.
 * It provides endpoints for getting all Registrations, getting a Registration by ID, and adding a new Registration.
 */

@RestController
@RequestMapping("/registrations")
public class RegistrationController {

  private final RegistrationRepository registrationRepository;
  private final StudentRepository studentRepository;
  private final ModuleRepository moduleRepository;

  /**
 * Constructor for the RegistrationController class.
 *
 * @param registrationController The repository for registrations
 * @param moduleRepository The repository for modules
 * @param studentRepository The repository for students
 */

  public RegistrationController(RegistrationRepository registrationRepository, 
                        ModuleRepository moduleRepository, 
                        StudentRepository studentRepository) {
    this.registrationRepository = registrationRepository;
    this.studentRepository = studentRepository;
    this.moduleRepository = moduleRepository;
  }

  @GetMapping("/registrations")
  public ResponseEntity<List<Registration>> getAllRegistrations() {
    List<Registration> registrations = (List<Registration>) registrationRepository.findAll();
    return ResponseEntity.ok(registrations);
  }
  
 
  /**
 * Get a Registration by its unique ID.
 *
 * @return The Registration with the given ID
 */
  @PostMapping("/registerModules")
  public ResponseEntity<String> registerModule(@RequestBody Map<String, Object> payload) {
    // Extract data from the payload
    Long studentId = ((Number) payload.get("student_id")).longValue();
    Long moduleId = ((Number) payload.get("module_id")).longValue();
    System.out.println("studentId: " + studentId);
    System.out.println("moduleId: " + moduleId);
    
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

    List<Registration> existingRegistrations = (List<Registration>) registrationRepository.findAll();
    boolean RegistrationExists = existingRegistrations.stream()
        .anyMatch(Registration -> Registration.getStudent().getId() == studentId 
                && Registration.getModule().getId() == moduleId);
    if (RegistrationExists) {
      return ResponseEntity.badRequest().body("Registration already exists.");
    }
    // Save the new Registration
    Registration Registration = new Registration();
    Registration.setStudent(existingStudent.get()); // Set the student entity
    Registration.setModule(existingModule.get());   // Set the module entity                
    registrationRepository.save(Registration);
    return ResponseEntity.ok("Registration saved successfully");
  }
}





