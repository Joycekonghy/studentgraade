package uk.ac.ucl.comp0010.model;


public class Module {
    
    private String name;
    private String code;
    private Boolean mnc;
    private Student registeredStudent;
    
    public Module(String name, String code, Boolean mnc) {
        this.name = name;
        this.code = code;
        this.mnc = mnc;
        this.registeredStudent = null;
    }
    
    // Get/Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name =  name;
    }
    
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code =  code;
    }

    public Boolean getMnc() {
        return mnc;
    }

    public void setMnc(Boolean mnc) {
        this.mnc =  mnc;
    }

	public void setRegisteredStudent(Student student) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'setRegisteredStudent'");
	}
    
}