package uk.ac.ucl.comp0010.model;


public class Grade {
    
    private Student student;
    private int score;
    private Module module;
    
    public Grade(Student student, int score, Module module) {
        validateScore(score);
        this.student = student;
        this.score = score;
        this.module = module;
    }

    private void validateScore(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Score must be between 0 and 100");
        }
    }
    
    // Get/Setters
    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module =  module;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student =  student;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        validateScore(score);
        this.score =  score;
    }
    
}