/*
=======================
This file contains all the functions that are related to the user table

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const db = require('./databaseConfig.js');

let mainModel = {
	
	// Add a user
	addUser: async function(username, email, contact, password, type, profile_pic_url) {
		
		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[user.js] Executing addUser Query");
		
		let query = `INSERT INTO user (username, email, contact, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?);`;
		let result = await conn.query(query, [username, email, contact, password, type, profile_pic_url]);
		await conn.end();
		
		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously. Note that this is handled in the controller layer(app.js).
		return result; 
	},
	addUserSync: function(username, email, contact, password, type, profile_pic_url, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
			
			// Check for connection error
			if (err) {
				Console.log(err);
				return callback(err, null);
			} else {
				
				// console.log("[user.js] Executing addUserSync Query");
				
				// Executing query
				let query = `INSERT INTO user (username, email, contact, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?);`;
				conn.query(query, [username, email, contact, password, type, profile_pic_url], (err, result) => {
					
					// Ending connection
					conn.end();
					if (err) {
						Console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				})
			}
		})
	},
	
	// Given username and password return the userid and role of that user
	loginUser: async function(username, password) {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()

		let query = `SELECT userid, type AS role FROM user WHERE username = ? AND password = ?;`;
		let result = await conn.query(query, [username, password]);
		await conn.end();

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously. Note that this is handled in the controller layer(app.js).
		return result; 
	},
	loginUserSync: function(username, password, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				return callback(err, null);
			} else {
	
				// Executing query
				let query = `SELECT userid, type AS role FROM user WHERE username = ? AND password = ?;`
				conn.query(query, [username, password], (err, result) => {
	
					// Ending connection
					conn.end();
					if (err) {
						Console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				})
			}
		})
	},

	// Get all users
	getAllUsers: async function() {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[user.js] Executing getAllUsers Query");
	
		let query = 'SELECT userid, username, email, contact, type, profile_pic_url, DATE_FORMAT(created_at, "%Y-%m-%d %T") as created_at FROM user';
		let result = await conn.query(query);
		await conn.end();
		return result;
	},
	getAllUsersSync: function(callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[user.js] Executing getAllUsersSync Query");
	
				let query = 'SELECT userid, username, email, contact, type, profile_pic_url, DATE_FORMAT(created_at, "%Y-%m-%d %T") as created_at FROM user';
				conn.query(query, (err, result) => {
	
					conn.end();
					if (err) {
						Console.log(err);
						callback(err, null);
					} else {
						callback(null, result);
					}
				})
			}
		})
	},


	// Given a userid, return the details of that user
	getUserByID: async function(id) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[user.js] Executing getUserByID Query");

		let query = 'SELECT userid, username, email, contact, type, profile_pic_url, DATE_FORMAT(created_at, "%Y-%m-%d %T") as created_at FROM user WHERE userid = ?';
		let result = await conn.query(query, [id]);
		await conn.end();
		return result;
	},
	getUserByIDSync: function(id, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("Executing getUserByIDSync Query");
	
				let query = 'SELECT userid, username, email, contact, type, profile_pic_url, DATE_FORMAT(created_at, "%Y-%m-%d %T") as created_at FROM user WHERE userid = ?';
				conn.query(query, [id], (err, result) => {
	
					conn.end();
					if (err) {
						Console.log(err);
						callback(err, null);
					} else {
						callback(null, result);
					}
				})
			}
		})
	},

	// Given a userid, return all the details, including password of the user
	getUserAllByID: async function(id) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[user.js] Executing getUserByID Query");

		let query = 'SELECT userid, username, email, password, contact, type, profile_pic_url, DATE_FORMAT(created_at, "%Y-%m-%d %T") as created_at FROM user WHERE userid = ?';
		let [result, fields] = await conn.query(query, [id]);
		// console.log("Result is",result[0])
		await conn.end();
		return result;
	},
	getUserAllByIDSync: function(id, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("Executing getUserByIDSync Query");
	
				let query = 'SELECT userid, username, email, password, contact, type, profile_pic_url, DATE_FORMAT(created_at, "%Y-%m-%d %T") as created_at FROM user WHERE userid = ?';
				conn.query(query, [id], (err, result) => {
	
					conn.end();
					if (err) {
						Console.log(err);
						callback(err, null);
					} else {
						callback(null, result);
					}
				})
			}
		})
	},


	// Given a userid, update the details of that user
	updateUserByID: async function(userid, username, email, contact, password, type, profile_pic_url) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[user.js] Executing updateUserByID Query");

		let query = 'UPDATE user SET username = ?, email = ?, contact = ?, password = ?, type = ?, profile_pic_url = ? WHERE userid = ?;';
		let result = await conn.query(query, [username, email, contact, password, type, profile_pic_url, userid]);
		await conn.end();
		return result;
	},
	updateUserByIDSync: function(userid, username, email, contact, password, type, profile_pic_url, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[user.js] Executing updateUserByIDSync Query");
	
				let query = 'UPDATE user SET username = ?, email = ?, contact = ?, password = ?, type = ?, profile_pic_url = ? WHERE userid = ?;';
				conn.query(query, [username, email, contact, password, type, profile_pic_url, userid], (err, result) => {
	
					conn.end();
					if (err) {
						Console.log(err);
						callback(err, null);
					} else {
						callback(null, result);
					}
				})
			}
		})
	}
}

// Export the model
module.exports = mainModel