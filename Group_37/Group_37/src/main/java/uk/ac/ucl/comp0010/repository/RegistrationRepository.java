package uk.ac.ucl.comp0010.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import uk.ac.ucl.comp0010.model.Registration;


/**
 * Repository interface for {@link Module} entities.
 * <p>
 * Extends {@link CrudRepository} to provide CRUD operations for {@link Module}
 * entities, identified by a {@code Long} ID.
 * </p>
 */
public interface RegistrationRepository extends CrudRepository<Registration, Long> {
  Optional<Registration> findByStudentIdAndModuleId(Long studentId, Long moduleId);
}

