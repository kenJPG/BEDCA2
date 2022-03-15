/*
=======================
This file contains the connection details to the database and is responsible
for returning the database connection.

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const mysql = require('mysql2');

let connectionDetails = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'spit'
}

module.exports = {

	// Function to connect to SPIT database
	getConnection: function() {
		let conn = mysql.createConnection(connectionDetails);
		return conn;
	},
}