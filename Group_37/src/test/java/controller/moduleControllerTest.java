package controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.controller.ModuleController;

class ModuleControllerTest {

    @InjectMocks
    private ModuleController moduleController;

    @Mock
    private ModuleRepository moduleRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllModules() {
        // Mock repository
        List<Module> mockModules = new ArrayList<>();
        mockModules.add(new Module("Software Engineering", "COMP0010", Boolean.TRUE));
        mockModules.add(new Module("Systems Engineering", "COMP0016", Boolean.FALSE));

        when(moduleRepository.findAll()).thenReturn(mockModules);

        // Call controller
        ResponseEntity<List<Module>> response = moduleController.getAllModules();

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(moduleRepository, times(1)).findAll();
    }

    @Test
    void testGetModuleByCodeFound() {
        // Mock repository
        String moduleCode = "COMP0010";
        Module mockModule = new Module("Software Engineering", moduleCode, Boolean.TRUE);
        when(moduleRepository.findByCode(moduleCode)).thenReturn(Optional.of(mockModule));

        // Call controller
        ResponseEntity<Module> response = moduleController.getModuleByCode(moduleCode);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(moduleCode, response.getBody().getCode());
        assertEquals("Software Engineering", response.getBody().getName());
        verify(moduleRepository, times(1)).findByCode(moduleCode);
    }

    @Test
    void testGetModuleByCodeNotFound() {
        // Mock repository
        String moduleCode = "COMP9999";
        when(moduleRepository.findByCode(moduleCode)).thenReturn(Optional.empty());

        // Call controller
        ResponseEntity<Module> response = moduleController.getModuleByCode(moduleCode);

        // Verify
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(moduleRepository, times(1)).findByCode(moduleCode);
    }

    @Test
    void testAddOrUpdateModuleNewModule() {
        // Mock repository
        Module newModule = new Module("Software Engineering", "COMP0010", Boolean.TRUE);
        when(moduleRepository.save(newModule)).thenReturn(newModule);

        // Call controller
        ResponseEntity<?> response = moduleController.addOrUpdateModule(newModule);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Module);
        assertEquals("COMP0010", ((Module) response.getBody()).getCode());
        verify(moduleRepository, times(1)).save(newModule);
    }


    @Test
    void testAddOrUpdateModuleConflict() {
        // Mock existing module with the same code
        Module existingModule = new Module("System Engineering", "COMP0010", Boolean.FALSE);
        Module newModule = new Module("Software Engineering", "COMP0010", Boolean.FALSE);
        
        when(moduleRepository.findByCode("COMP0010")).thenReturn(Optional.of(existingModule));
        
        // Call the controller
        ResponseEntity<?> response = moduleController.addOrUpdateModule(newModule);
    
        // Verify response
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("A module with this code already exists.", response.getBody());
    
        // Verify repository calls
        verify(moduleRepository, times(1)).findByCode("COMP0010");
        verify(moduleRepository, times(0)).save(any()); // Ensure save is not called
    }
    
    
 
    @Test
    void testAddOrUpdateModuleInvalidInput() {
        // Test invalid module (null name)
        Module invalidModule = new Module(null, "COMP0010", Boolean.TRUE);

        ResponseEntity<?> response = moduleController.addOrUpdateModule(invalidModule);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Module name is required.", response.getBody());

        // Test invalid module (empty code)
        invalidModule = new Module("software engineering", "",  Boolean.FALSE);
        response = moduleController.addOrUpdateModule(invalidModule);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Module code is required.", response.getBody());

        verify(moduleRepository, times(0)).save(any());
    }
}
