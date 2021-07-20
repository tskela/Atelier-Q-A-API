\c Q&A

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  product_id INT,
  question_body VARCHAR(300),
  question_date BIGINT,
  asker_name VARCHAR(100),
  asker_email VARCHAR(100),
  reported BOOLEAN,
  question_helpfulness INT
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT,
  body VARCHAR(300),
  date BIGINT,
  answerer_name VARCHAR(100),
  answerer_email VARCHAR(100),
  reported BOOLEAN,
  helpful INT,
  CONSTRAINT question_id
    FOREIGN KEY(question_id)
      REFERENCES questions(question_id)
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  answer_id INT,
  url VARCHAR(300),
  CONSTRAINT answer_id
    FOREIGN KEY(answer_id)
      REFERENCES answers(id)
);