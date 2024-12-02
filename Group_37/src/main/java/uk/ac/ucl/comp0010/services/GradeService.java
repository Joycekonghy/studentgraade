package uk.ac.ucl.comp0010.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.repository.GradeRepository;;

@Service
public class GradeService {
    @Autowired
    private GradeRepository gradeRepository;

    public List<Grade> getAllGrade() {
        return (List<Grade>) gradeRepository.findAll();
    }

    public Optional<Grade> getGradeById(Long id) {
        return gradeRepository.findById(id);
    }

    public Grade addGrade(Grade grade) {
        return gradeRepository.save(grade);
    }

    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }

    public List<Grade> getGradesByStudentId(Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        return grades;
    }

    public Grade updateGrade(Long id, Integer score) {
        Grade grade = gradeRepository
        .findById(id)
        .orElseThrow();
        grade.setScore(score);
        return gradeRepository.save(grade);
    }
}
