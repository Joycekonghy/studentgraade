package uk.ac.ucl.comp0010.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import uk.ac.ucl.comp0010.model.Module;


/**
 * Repository interface for {@link Module} entities.
 * <p>
 * Extends {@link CrudRepository} to provide CRUD operations for {@link Module}
 * entities, identified by a {@code Long} ID.
 * </p>
 */
public interface ModuleRepository extends CrudRepository<Module, Long> {
  Optional<Module> findByCode(String code);
}

