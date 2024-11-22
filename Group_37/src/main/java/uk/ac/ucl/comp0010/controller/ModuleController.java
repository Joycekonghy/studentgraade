package uk.ac.ucl.comp0010.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.repository.ModuleRepository;

import java.util.List;
import java.util.Optional;

/**
 * Controller for managing modules.
 * Provides REST endpoints for creating, retrieving, updating, and deleting modules.
 */
@RestController
@RequestMapping("/modules")
public class ModuleController {

    @Autowired
    private ModuleRepository moduleRepository;

    /**
     * Get all modules.
     *
     * @return List of all modules
     */
@GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        List<Module> modules = (List<Module>) moduleRepository.findAll();
        return ResponseEntity.ok(modules);
    }

    /**
     * Get a module by its code.
     *
     * @param id The ID of the module
     * @return The requested module
     */
    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        Optional<Module> module = moduleRepository.findById(id);
        if (module.isPresent()) {
            return ResponseEntity.ok(module.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Add a new module or update an existing one.
     *
     * @param module The module to be added or updated
     * @return The saved module
     */
    @PostMapping
    public ResponseEntity<Module> addOrUpdateModule(@RequestBody Module module) {
        System.out.println("Received module: " + module);
        try {
            Module savedModule = moduleRepository.save(module);
            System.out.println("Saved Module: " + savedModule);
            return ResponseEntity.ok(savedModule);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(409).body(null);
        }
    }
    
    /**
     * Delete a module by its ID.
     *
     * @param id The ID of the module to be deleted
     * @return Response status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        if (moduleRepository.existsById(id)) {
            moduleRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
