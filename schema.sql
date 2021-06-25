\c Q&A

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INT,
  body VARCHAR(300),
  date_written BIGINT,
  asker_name VARCHAR(100),
  asker_email VARCHAR(100),
  reported BOOLEAN,
  helpful INT
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT,
  body VARCHAR(300),
  date_written BIGINT,
  answerer_name VARCHAR(100),
  answerer_email VARCHAR(100),
  reported BOOLEAN,
  helpful INT,
  CONSTRAINT question_id
    FOREIGN KEY(question_id)
      REFERENCES questions(id)
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  answer_id INT,
  url VARCHAR(300),
  CONSTRAINT answer_id
    FOREIGN KEY(answer_id)
      REFERENCES answers(id)
);

CREATE INDEX ON questions(product_id);

CREATE INDEX ON questions(id);

CREATE INDEX ON answers(question_id);

CREATE INDEX ON answers(id)

CREATE INDEX ON images(answer_id);