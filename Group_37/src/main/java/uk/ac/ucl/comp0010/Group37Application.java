package uk.ac.ucl.comp0010;

import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Group37Application {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Group37Application.class);
        app.setDefaultProperties(Collections.singletonMap("server.port", "2800"));
        app.run(args);
    }
}
