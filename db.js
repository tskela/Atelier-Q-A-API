const { Pool, Client } = require("pg");
const config = require('./config.js');

var connectionString = `postgresql://postgres:${config.PASSWORD}@ec2-52-53-128-252.us-west-1.compute.amazonaws.com/Q&A`;

const pool = new Pool({
  host: 'ec2-52-53-128-252.us-west-1.compute.amazonaws.com',
  user: 'postgres',
  database: 'Q&A',
  password: `${config.PASSWORD}`
});

// var client = new Pool(connectionString);

// client.connect((err, success) => {
//   if (success) {
//     console.log("Connected to postgres db");
//   } else {
//     console.log(err);
//   }
// });

module.exports = pool;