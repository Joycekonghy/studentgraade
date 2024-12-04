package uk.ac.ucl.comp0010.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;

/**
 * Configuration class for Spring Data REST.
 * <p>
 * This class exposes entity IDs for {@link Student}, {@link Module}, and {@link Grade}
 * in the REST API.
 * </p>
 */
@Configuration
public class RestConfiguration implements RepositoryRestConfigurer {

  /**
 * Exposes entity IDs for {@link Student}, {@link Module}, and {@link Grade}.
 * 
 * <p>This method configures the repository REST settings and registers CORS mappings.</p>
 *
 * @param config the repository REST configuration
 * @param cors the CORS registry
 */

  @Override
  public void configureRepositoryRestConfiguration(
      RepositoryRestConfiguration config,
      CorsRegistry cors
  ) {
    // Expose entity IDs for Student, Module, and Grade
    config.exposeIdsFor(Student.class);
    config.exposeIdsFor(Module.class);
    config.exposeIdsFor(Grade.class);
    
    // Enable CORS for the frontend (adjust the URL to match your frontend's address)
    cors.addMapping("/**")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowedHeaders("*")
        .allowCredentials(true);
  }
}
