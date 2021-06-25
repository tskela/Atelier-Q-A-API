const express = require("express");
const { Pool, Client } = require("pg");
const copyFrom = require("pg-copy-streams").from;
const fs = require("fs");

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

var connectionString = "postgres://postgres:password@localhost:5432/Q&A";

var client = new Client(connectionString);

client.connect((err, success) => {
  if (success) {
    console.log("Connected to postgres db");
  } else {
    console.log(err);
  }
});

/*=========================GET ROUTES========================*/

app.get("/qa/questions", (req, res) => {
  var limit = req.query.count || 5;
  var offset = req.query.page - 1 || 0;

  var queryString = `SELECT id, product_id, body, date_written, asker_name, helpful FROM questions WHERE product_id=$1 AND reported=false LIMIT $2 OFFSET $3`;

  client.query(
    queryString,
    [req.query.product_id, limit, limit * offset],
    (err, rows) => {
      if (err) {
        console.log(err.stack);
        res.status(400).end();
      } else {
        res.status(200).send(JSON.stringify(rows.rows));
      }
    }
  );
});

app.get("/qa/:question_id/answers", (req, res) => {
  var limit = req.query.count || 5;
  var offset = req.query.page - 1 || 0;
  var question_id = req.params.question_id;

  var queryString = `SELECT id, question_id, body, date_written, answerer_name, helpful FROM answers WHERE question_id=$1 AND reported=false LIMIT $2 OFFSET $3`;

  client.query(
    queryString,
    [question_id, limit, limit * offset],
    (err, rows) => {
      if (err) {
        console.log(err.stack);
        res.status(400).end();
      } else {
        res.status(200).send(JSON.stringify(rows.rows));
      }
    }
  );
});

app.get("/qa/:answer_id/images", (req, res) => {
  var answer_id = req.params.answer_id;
  var limit = req.query.count || 5;

  var queryString = `SELECT id, answer_id, url FROM images WHERE answer_id=$1 LIMIT $2`;

  client.query(queryString, [answer_id, limit], (err, rows) => {
    if (err) {
      console.log(err.stack);
      res.status(400).end();
    } else {
      res.status(200).send(JSON.stringify(rows.rows));
    }
  });
});

/*=========================PUT ROUTES========================*/

app.put("/qa/questions/:question_id/helpful", (req, res) => {
  var question_id = req.params.question_id;

  var queryString = `UPDATE questions SET helpful = helpful + 1 WHERE id=$1`;

  client.query(queryString, [question_id], (err, rows) => {
    if (err) {
      console.log(err.stack);
      res.status(400).end();
    } else {
      res.status(200).send('marked question helpful!');
    }
  });
})

app.put("/qa/questions/:question_id/report", (req, res) => {
  var question_id = req.params.question_id;

  var queryString = `UPDATE questions SET reported = true WHERE id=$1`;

  client.query(queryString, [question_id], (err, rows) => {
    if (err) {
      console.log(err.stack);
      res.status(400).end();
    } else {
      res.status(200).send('question reported!');
    }
  });
})

app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  var answer_id = req.params.answer_id;

  var queryString = `UPDATE answers SET helpful = helpful + 1 WHERE id=$1`;

  client.query(queryString, [answer_id], (err, rows) => {
    if (err) {
      console.log(err.stack);
      res.status(400).end();
    } else {
      res.status(200).send('marked answer helpful!');
    }
  });
})

app.put("/qa/answers/:answer_id/report", (req, res) => {
  var answer_id = req.params.answer_id;

  var queryString = `UPDATE answers SET reported = true WHERE id=$1`;

  client.query(queryString, [answer_id], (err, rows) => {
    if (err) {
      console.log(err.stack);
      res.status(400).end();
    } else {
      res.status(200).send('answer reported!');
    }
  });
})

/*=========================POST ROUTES========================*/



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/* ===========================ETL CODE===============================*/

//var pool = new Pool();

// pool.connect(function (err, c, done) {
//   var stream = client.query(
//     copyFrom(
//       "COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM STDIN WITH (FORMAT csv)"
//     )
//   );
//   var fileStream = fs.createReadStream("questions.csv");
//   fileStream.on("error", done);
//   stream.on("error", done);
//   stream.on("finish", done);
//   fileStream.pipe(stream);
// });

// pool.connect(function (err, c, done) {
//   var stream = client.query(
//     copyFrom(
//       "COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM STDIN WITH (FORMAT csv)"
//     )
//   );
//   var fileStream = fs.createReadStream("answers.csv");
//   fileStream.on("error", done);
//   stream.on("error", done);
//   stream.on("finish", done);
//   fileStream.pipe(stream);
// });

// pool.connect(function (err, c, done) {
//   var stream = client.query(
//     copyFrom("COPY images(id, answer_id, url) FROM STDIN WITH (FORMAT csv)")
//   );
//   var fileStream = fs.createReadStream("answers_photos.csv");
//   fileStream.on("error", done);
//   stream.on("error", done);
//   stream.on("finish", done);
//   fileStream.pipe(stream);
// });

//client.query('ALTER TABLE questions ALTER COLUMN date_written TYPE timestamp without time zone USING TO_TIMESTAMP(date_written / 1000)')

//client.query('ALTER TABLE answers ALTER COLUMN date_written TYPE timestamp without time zone USING TO_TIMESTAMP(date_written / 1000)')
