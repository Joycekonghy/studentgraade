package uk.ac.ucl.comp0010.model;

import java.util.ArrayList;
import java.util.List;
import uk.ac.ucl.comp0010.exception.EmptyRateException;

/**
 * Represents a movie in the system.
 * <p>
 * A movie is a film that can be rated by users.
 * </p>
 */
public class Movie {
  
  List<Integer> rates;

  public Movie() {
    this.rates = new ArrayList<Integer>();
  }

  /**
   * Computes the average rate of the movie.
   *
   * @return the average rate of the movie
   * @throws EmptyRateException if no rates are available for the movie
   */
  public Double getAverageRate() throws EmptyRateException {
    if (rates.size() < 1) {
      throw new EmptyRateException();
    }

    Double sum = 0.0;
    for (Integer rate : rates) {
      sum += rate;
    }
    return sum / rates.size();
  }

  public void addRate(int rate) {
    this.rates.add(rate);
  }

}
