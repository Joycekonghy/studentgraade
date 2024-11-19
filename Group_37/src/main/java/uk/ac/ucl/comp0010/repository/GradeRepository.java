package uk.ac.ucl.comp0010.repository;

import org.springframework.data.repository.CrudRepository;
import uk.ac.ucl.comp0010.model.Grade;

/**
 * Repository interface for {@link Grade} entities.
 * <p>
 * Extends {@link CrudRepository} to provide CRUD operations for {@link Grade}
 * entities, identified by a {@code Long} ID.
 * </p>
 */
public interface GradeRepository extends CrudRepository<Grade, Long> {
}
