DROP TABLE IF EXISTS grade;
DROP TABLE IF EXISTS registration;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS module;


CREATE TABLE student(
  id INT PRIMARY KEY,
  firstName VARCHAR(30),
  lastName VARCHAR(30),
  username VARCHAR(30),
  email VARCHAR(50)
);

CREATE TABLE module (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    mnc BOOLEAN DEFAULT false NOT NULL
);


CREATE TABLE grade (
  id SERIAL PRIMARY KEY,
  score DOUBLE PRECISION, 
  student_id INT,
  module_id VARCHAR(10),
  FOREIGN KEY (student_id)
    REFERENCES student (id),
  FOREIGN KEY (module_id)
    REFERENCES module (id)
);


CREATE TABLE registration(
  id SERIAL PRIMARY KEY,
  student_id INT,
  module_id VARCHAR(10),
  FOREIGN KEY (student_id)
    REFERENCES student (id),
  FOREIGN KEY (module_id)
    REFERENCES module (id)
);