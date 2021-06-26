const { Pool, Client } = require("pg");
const config = require('./config.js');

var connectionString = `postgres://postgres:${config.PASSWORD}@localhost:5432/Q&A`;

var client = new Client(connectionString);

client.connect((err, success) => {
  if (success) {
    console.log("Connected to postgres db");
  } else {
    console.log(err);
  }
});

module.exports = client;