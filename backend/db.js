const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nandhu@2004', 
  database: 'blood_mate_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL Database');
});

module.exports = connection;
