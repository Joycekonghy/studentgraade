package uk.ac.ucl.comp0010;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uk.ac.ucl.comp0010.exception.NoGradeAvailableException;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.model.Module;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

public class StudentTest {
    private Student student;
    private Module module1;
    private Module module2;
    private Grade grade1;
    private Grade grade2;

    @BeforeEach
    void setUp() {
        // Создаем студента
        student = new Student(1L, "John", "Doe", "johndoe", "john.doe@example.com");

        // Создаем модули
        module1 = new Module("Computer Science", "COMP001", false);
        module2 = new Module("Mathematics", "MATH001", false);

        // Создаем оценки
        grade1 = new Grade(student, module1, 85);
        grade2 = new Grade(student, module2, 95);

        // Добавляем оценки студенту
        student.addGrade(grade1);
        student.addGrade(grade2);

        // Регистрируем модули
        student.registerModule(module1);
        student.registerModule(module2);
    }

}
