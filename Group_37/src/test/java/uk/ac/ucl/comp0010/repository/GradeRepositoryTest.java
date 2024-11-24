
package uk.ac.ucl.comp0010.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class GradeRepositoryTest {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Test
    public void testFindByModuleId() {
        // Create and save test data
        Module module = new Module("Intro to CS", "CS101", true);
        moduleRepository.save(module);

        Student student1 = new Student((long)123, "John", "Doe", "johndoe", "john@example.com");
        Student student2 = new Student((long)123423, "Jane", "Smith", "janesmith", "jane@example.com");
        studentRepository.saveAll(List.of(student1, student2));

        Grade grade1 = new Grade(student1, module, 85);
        Grade grade2 = new Grade(student2, module, 90);
        gradeRepository.saveAll(List.of(grade1, grade2));

        // Test method
        List<Grade> grades = gradeRepository.findByModule_Id(module.getId());

        // Assertions
        assertEquals(2, grades.size());
        assertTrue(grades.stream().anyMatch(g -> g.getScore() == 85));
        assertTrue(grades.stream().anyMatch(g -> g.getScore() == 90));
    }

    @Test
    public void testFindByStudentId() {
        // Create and save test data
        Student student = new Student((long)5490731, "Alice", "Brown", "aliceb", "alice@example.com");
        studentRepository.save(student);

        Module module1 = new Module("Intro to CS", "CS101", true);
        Module module2 = new Module("Data Structures", "CS102", true);
        moduleRepository.saveAll(List.of(module1, module2));

        Grade grade1 = new Grade(student, module1, 88);
        Grade grade2 = new Grade(student, module2, 92);
        gradeRepository.saveAll(List.of(grade1, grade2));

        // Test method
        List<Grade> grades = gradeRepository.findByStudent_Id(student.getId());

        // Assertions
        assertEquals(2, grades.size());
        assertTrue(grades.stream().anyMatch(g -> g.getScore() == 88));
        assertTrue(grades.stream().anyMatch(g -> g.getScore() == 92));
    }

    @Test
    public void testFindByStudentAndModule() {
        // Create and save test data
        Student student = new Student((long)12454, "Bob", "White", "bobw", "bob@example.com");
        studentRepository.save(student);

        Module module = new Module("Advanced Algorithms", "CS201", true);
        moduleRepository.save(module);

        Grade grade = new Grade(student, module, 95);
        gradeRepository.save(grade);

        // Test method
        Optional<Grade> result = gradeRepository.findByStudent_IdAndModule_Id(student.getId(), module.getId());

        // Assertions
        assertTrue(result.isPresent());
        assertEquals(95, result.get().getScore());
    }
}
