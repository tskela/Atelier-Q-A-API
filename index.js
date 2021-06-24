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
  }
});

app.get("/test", (req, res) => {
  var queryString = `SELECT * FROM questions WHERE product_id=1`;

  client.query(queryString, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.send(JSON.stringify(rows.rows));
    }
  });
});

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
