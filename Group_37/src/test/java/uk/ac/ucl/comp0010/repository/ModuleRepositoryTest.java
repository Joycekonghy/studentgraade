package uk.ac.ucl.comp0010.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import uk.ac.ucl.comp0010.model.Module;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class ModuleRepositoryTest {

    @Autowired
    private ModuleRepository moduleRepository;

    @Test
    public void testSaveAndFindByCode() {
        // Create a module
        Module module = new Module("Introduction to Java", "CS101", true);
        moduleRepository.save(module);

        // Retrieve the module by code
        Optional<Module> foundModule = moduleRepository.findByCode("CS101");

        // Assertions
        assertTrue(foundModule.isPresent());
        assertEquals("CS101", foundModule.get().getCode());
        assertEquals("Introduction to Java", foundModule.get().getName());
        assertTrue(foundModule.get().getMnc());
    }

    @Test
    public void testUpdateModule() {
        // Create and save a module
        Module module = new Module("Data Structures", "CS102", false);
        moduleRepository.save(module);

        // Update the module
        module.setName("Advanced Data Structures");
        module.setMnc(true);
        moduleRepository.save(module);

        // Retrieve the updated module
        Optional<Module> updatedModule = moduleRepository.findByCode("CS102");

        // Assertions
        assertTrue(updatedModule.isPresent());
        assertEquals("Advanced Data Structures", updatedModule.get().getName());
        assertTrue(updatedModule.get().getMnc());
    }

    @Test
    public void testDeleteModuleByCode() {
        // Create and save a module
        Module module = new Module("Algorithms", "CS103", true);
        moduleRepository.save(module);
    
        // Retrieve and delete the module by code
        Module moduleToDelete = moduleRepository.findByCode("CS103")
                .orElseThrow(() -> new RuntimeException("Module not found with code: CS103"));
        moduleRepository.delete(moduleToDelete);
    
        // Verify the module was deleted
        Optional<Module> deletedModule = moduleRepository.findByCode("CS103");
        assertTrue(deletedModule.isEmpty());
    }
    
}
