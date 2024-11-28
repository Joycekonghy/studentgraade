package uk.ac.ucl.comp0010.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import uk.ac.ucl.comp0010.model.Student;

/**
 * Repository interface for {@link Student} entities.
 * <p>
 * Extends {@link CrudRepository} to provide CRUD operations for {@link Student}
 * entities, identified by a {@code Long} ID.
 * </p>
 */
public interface StudentRepository extends CrudRepository<Student, Long> {

  Optional<Student> findByUsername(String username);
}
