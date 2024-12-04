package uk.ac.ucl.comp0010;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


/**
 * Main class for the application.
 */
@SpringBootApplication
public class Group37Application {
  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(Group37Application.class);
    app.run(args);
  }
}
