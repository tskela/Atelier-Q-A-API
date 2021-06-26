const { Pool, Client } = require("pg");

var connectionString = "postgres://postgres:password@localhost:5432/Q&A";

var client = new Client(connectionString);

client.connect((err, success) => {
  if (success) {
    console.log("Connected to postgres db");
  } else {
    console.log(err);
  }
});

module.exports = client;