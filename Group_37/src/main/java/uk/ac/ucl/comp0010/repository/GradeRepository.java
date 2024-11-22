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
  // Fetch all grades for a specific module
  List<Grade> findByModule_Id(Long moduleId);

  // Fetch all grades for a specific student
  List<Grade> findByStudent_Id(Long studentId);

  // Fetch a specific grade for a student and module
  Optional<Grade> findByStudent_IdAndModule_Id(Long studentId, Long moduleId);
}
