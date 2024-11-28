package uk.ac.ucl.comp0010.repository;

import org.springframework.data.repository.CrudRepository;
import uk.ac.ucl.comp0010.model.Grade;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link Grade} entities.
 * <p>
 * Extends {@link CrudRepository} to provide CRUD operations for {@link Grade}
 * entities, identified by a {@code Long} ID.
 * </p>
 */
public interface GradeRepository extends CrudRepository<Grade, Long> {

    Optional<Grade> findByStudentIdAndModuleId(Long studentId, Long moduleId);
}
