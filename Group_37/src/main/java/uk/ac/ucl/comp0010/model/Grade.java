package uk.ac.ucl.comp0010.model;

public class Grade {
    
    private Student student;
    private int score;
    private Module module;
    
    public Grade(Student student, int score, Module module) {
        this.student = student;
        this.score = score;
        this.module = module;
    }
    

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
        this.score =  score;
    }
    
}