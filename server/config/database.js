const express = require('express');
const path = require('path');
const router = express.Router();
var db;
var mysql = require('mysql2');
require('dotenv').config({ path: path.join(__dirname, '/BackEnd/.env') });

var connection = mysql.createPool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // port: 3306,

  host:'localhost',
  user: 'root',
  password: 'Abishek001',
  database: 'tracking_190224'
  
});

connection.getConnection(function (err, database) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  } else {
    console.log("database has been connected");
    db = database;
  }
});
module.exports = connection;