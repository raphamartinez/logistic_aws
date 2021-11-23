const mysql = require('mysql2');

const connectiontwo = mysql.createConnection({
  user: 'admin',
  host: 'ansa.ci1lk6xtv607.us-east-1.rds.amazonaws.com',
  database: 'ansa',
  password: 'q3*xKa***nsa20paR',
  port: 3306
})

module.exports = connectiontwo

