package uk.ac.ucl.comp0010.controller;


import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.repository.ModuleRepository;



/**
 * Controller for managing modules.
 * Provides REST endpoints for creating, retrieving, updating, and deleting modules.
 */
@RestController
@RequestMapping("/Module")
public class ModuleController {

  @Autowired
  private ModuleRepository moduleRepository;

  /**
     * Retrieve all modules.
     *
     * @return A response entity containing a list of all modules
     */
  @GetMapping
  public ResponseEntity<List<Module>> getAllModules() {
    List<Module> modules = (List<Module>) moduleRepository.findAll();
    return ResponseEntity.ok(modules);
  }

  /**
     * Get a module by its code.
     *
     * @param code The code of the module
     * @return The requested module
     */
  @GetMapping("/{code}")
  public ResponseEntity<Module> getModuleByCode(@PathVariable String code) {
    Optional<Module> module = moduleRepository.findByCode(code);
    if (module.isPresent()) {
      return ResponseEntity.ok(module.get());
    }
    return ResponseEntity.notFound().build();
  }

  /**
     * Add a new module or update an existing one.
     *
     * @param module The module to add or update
     * @return A response entity containing the saved module
     */
  @PostMapping
  @Transactional
  public ResponseEntity<?> addOrUpdateModule(@RequestBody Module module) {
    // Validate input
    if (module.getCode() == null || module.getCode().isEmpty()) {
      return ResponseEntity.badRequest().body("Module code is required.");
    }
    if (module.getName() == null || module.getName().isEmpty()) {
      return ResponseEntity.badRequest().body("Module name is required.");
    }
    Optional<Module> existingModule = moduleRepository.findByCode(module.getCode());
    if (existingModule.isPresent() && !existingModule.get().equals(module)) {
      return ResponseEntity
          .status(HttpStatus.CONFLICT)
          .body("A module with this code already exists.");
  }

  try {
      // Save only if no conflict
      Module savedModule = moduleRepository.save(module);
      return ResponseEntity.ok(savedModule);
  } catch (DataIntegrityViolationException e) {
      return ResponseEntity
          .status(HttpStatus.CONFLICT)
          .body("A module with this code already exists.");
  }
}
}
