require("newrelic");
const express = require("express");
const copyFrom = require("pg-copy-streams").from;
const fs = require("fs");
const { Pool, Client } = require("pg");
const pool = require("./db.js");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Q&A Microservice");
});

app.get("/loaderio-0e28049c9eea2453a8294df25831f932.txt", (req, res) => {
  res.send("loaderio-0e28049c9eea2453a8294df25831f932");
});

/*=========================GET ROUTES========================*/

app.get("/qa/questions", (req, res) => {
  var limit = req.query.count || 5;
  var offset = req.query.page - 1 || 0;

  var queryString = `SELECT Array_to_json(Array_agg(Row_to_json(t)))
  FROM   (SELECT questions.question_id,
                 questions.question_body,
                 questions.question_date,
                 questions.asker_name,
                 questions.question_helpfulness,
                 questions.reported,
                 (SELECT Array_to_json(Array_agg(Row_to_json(d)))
                  FROM   (SELECT answers.id,
                                 answers.body,
                                 answers.date,
                                 answers.answerer_name,
                                 answers.helpful,
                                 (SELECT Array_to_json(Array_agg(Row_to_json(i)))
                                  FROM   (SELECT images.id,
                                                 images.url
                                          FROM   images
                                          WHERE  images.answer_id = answers.id) i)
                                 AS
                                 photos
                          FROM   answers
                          WHERE  answers.question_id = questions.question_id) d)
                 AS
                        answers
          FROM   questions
          WHERE  questions.product_id = $1
                 AND questions.reported = false) t`;

  pool.connect((err, client, release) => {
    if (err) {
      console.log("Error acquiring client");
    } else {
      client.query(queryString, [req.query.product_id], (err, rows) => {
        release();
        if (err) {
          res.status(400).end();
        } else {
          res.status(200).send(
            JSON.stringify({
              product_id: req.query.product_id,
              results: rows.rows[0].array_to_json,
            })
          );
        }
      });
    }
  });
});

app.get("/qa/:question_id/answers", (req, res) => {
  var limit = req.query.count || 5;
  var offset = req.query.page - 1 || 0;
  var question_id = req.params.question_id;

  var queryString = `SELECT Json_agg(Row_to_json(answers))
  FROM   (
                   SELECT    answers.id,
                             answers.body,
                             answers.date,
                             answers.answerer_name,
                             answers.helpful,
                             COALESCE(Json_agg(images) filter (WHERE images.answer_id IS NOT NULL), '[]') AS photos
                   FROM      answers
                   LEFT JOIN images
                   ON        images.answer_id = answers.id
                   WHERE     answers.question_id = $1
                   GROUP BY  answers.id) answers`;

  pool.connect((err, client, release) => {
    if (err) {
      console.log("Error acquiring client");
    } else {
      client.query(queryString, [question_id], (err, rows) => {
        release();
        if (err) {
          console.log(err);
          res.status(400).end();
        } else {
          res.status(200).send({
            question: question_id,
            page: offset,
            count: limit,
            results:
              rows.rows[0].json_agg === null
                ? []
                : rows.rows[0].json_agg.slice(offset * limit).slice(0, limit),
          });
        }
      });
    }
  });
});

/*=========================PUT ROUTES========================*/

app.put("/qa/questions/:question_id/helpful", (req, res) => {
  var question_id = req.params.question_id;

  var queryString = `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id=$1`;

  pool.connect((err, client, release) => {
    if (err) {
      console.log("Error acquiring client");
    } else {
      client.query(queryString, [question_id], (err, rows) => {
        release();
        if (err) {
          res.status(400).end();
        } else {
          res.status(200).end();
        }
      });
    }
  });
});

app.put("/qa/questions/:question_id/report", (req, res) => {
  var question_id = req.params.question_id;

  var queryString = `UPDATE questions SET reported = true WHERE question_id=$1`;

  pool.connect((err, client, release) => {
    if (err) {
      console.log("Error acquiring client");
    } else {
      client.query(queryString, [question_id], (err, rows) => {
        release();
        if (err) {
          res.status(400).end();
        } else {
          res.status(200).end();
        }
      });
    }
  });
});

app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  var answer_id = req.params.answer_id;

  var queryString = `UPDATE answers SET helpful = helpful + 1 WHERE id=$1`;

  pool.connect((err, client, release) => {
    if (err) {
      console.log("Error acquiring client");
    } else {
      client.query(queryString, [answer_id], (err, rows) => {
        release();
        if (err) {
          res.status(400).end();
        } else {
          res.status(200).end();
        }
      });
    }
  });
});

app.put("/qa/answers/:answer_id/report", (req, res) => {
  var answer_id = req.params.answer_id;

  var queryString = `UPDATE answers SET reported = true WHERE id=$1`;

  pool.connect((err, client, release) => {
    if (err) {
      console.log("Error acquiring client");
    } else {
      client.query(queryString, [answer_id], (err, rows) => {
        release();
        if (err) {
          res.status(400).end();
        } else {
          res.status(200).end();
        }
      });
    }
  });
});

/*=========================POST ROUTES========================*/

app.post("/qa/questions", (req, res) => {
  var product_id = req.body.product_id;
  var body = req.body.body;
  var name = req.body.name;
  var email = req.body.email;
  var reported = false;
  var helpfulness = 0;

  var queryString = `INSERT INTO questions(product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES($1, $2, DATE_TRUNC('second', LOCALTIMESTAMP), $3, $4, $5, $6)`;

  client.query(
    queryString,
    [product_id, body, name, email, reported, helpfulness],
    (err, rows) => {
      if (err) {
        res.status(400).end();
      } else {
        res.status(201).send("question posted!");
      }
    }
  );
});

app.post("/qa/questions/:question_id/answers", (req, res) => {
  var question_id = req.params.question_id;
  var body = req.body.body;
  var name = req.body.name;
  var email = req.body.email;
  var photos = req.body.photos;
  var reported = false;
  var helpfulness = 0;

  var queryString = `INSERT INTO answers(question_id, body, date, answerer_name, answerer_email, reported, helpful) VALUES($1, $2, DATE_TRUNC('second', LOCALTIMESTAMP), $3, $4, $5, $6)`;

  client.query(
    queryString,
    [question_id, body, name, email, reported, helpfulness],
    (err, rows) => {
      if (err) {
        res.status(400).end();
      } else {
        if (photos.length === 0) {
          res.status(201).send("answer posted!");
        } else {
          client.query(`SELECT MAX(id) FROM answers`, (req, rows) => {
            var max = rows.rows[0].max;
            photos = JSON.stringify(photos);
            var insertImages = `INSERT INTO images (answer_id, url) SELECT ${max}, jsonb_array_elements('${photos}')`;
            client.query(insertImages, (err, result) => {
              if (err) {
                res.status(400).end();
              } else {
                res.status(201).send("answer posted!");
              }
            });
          });
        }
      }
    }
  );
});

module.exports = app;

/* ===========================ETL CODE===============================*/

var pool = new Pool();

pool.connect(function (err, c, done) {
  var stream = client.query(
    copyFrom(
      "COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM STDIN WITH (FORMAT csv)"
    )
  );
  var fileStream = fs.createReadStream("questions.csv");
  fileStream.on("error", done);
  stream.on("error", done);
  stream.on("finish", done);
  fileStream.pipe(stream);
});

pool.connect(function (err, c, done) {
  var stream = client.query(
    copyFrom(
      "COPY answers(id, question_id, body, date, answerer_name, answerer_email, reported, helpful) FROM STDIN WITH (FORMAT csv)"
    )
  );
  var fileStream = fs.createReadStream("answers.csv");
  fileStream.on("error", done);
  stream.on("error", done);
  stream.on("finish", done);
  fileStream.pipe(stream);
});

pool.connect(function (err, c, done) {
  var stream = client.query(
    copyFrom("COPY images(id, answer_id, url) FROM STDIN WITH (FORMAT csv)")
  );
  var fileStream = fs.createReadStream("answers_photos.csv");
  fileStream.on("error", done);
  stream.on("error", done);
  stream.on("finish", done);
  fileStream.pipe(stream);
});

client.query('ALTER TABLE questions ALTER COLUMN question_date TYPE timestamp without time zone USING TO_TIMESTAMP(question_date / 1000)');

client.query('ALTER TABLE answers ALTER COLUMN date TYPE timestamp without time zone USING TO_TIMESTAMP(date / 1000)')
