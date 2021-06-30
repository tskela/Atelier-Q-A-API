const { Pool, Client } = require("pg");
const config = require('./config.js');

var connectionString = `postgresql://postgres:${config.PASSWORD}@ec2-52-53-128-252.us-west-1.compute.amazonaws.com/Q&A`;

const pool = new Pool(connectionString);

// var client = new Pool(connectionString);

// client.connect((err, success) => {
//   if (success) {
//     console.log("Connected to postgres db");
//   } else {
//     console.log(err);
//   }
// });

module.exports = pool;