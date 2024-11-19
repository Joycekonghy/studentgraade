package uk.ac.ucl.comp0010.repository;

import org.springframework.data.repository.CrudRepository;
import uk.ac.ucl.comp0010.model.Module;

/**
 * Repository interface for {@link Module} entities.
 * <p>
 * Extends {@link CrudRepository} to provide CRUD operations for {@link Module}
 * entities, identified by a {@code String} ID.
 * </p>
 */
public interface ModuleRepository extends CrudRepository<Module, String> {
}
