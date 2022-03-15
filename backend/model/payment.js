/*
=======================
This file contains all the functions that are related to the ordering

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const db = require('./databaseConfig.js');

let mainModel = {

	// Add a payment given userid and card information.
	addPaymentMethod: async function (userid, card_number, cvv, card_name, card_expiration) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing addPaymentMethod query")

		let query = `INSERT INTO payment (fk_userid, card_number, cvv, card_name, card_expiration) VALUES (?, ?, ?, ?, ?);`

		let result = await conn.query(query, [userid, card_number, cvv, card_name, card_expiration])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	addPaymentMethodSync: function(userid, card_number, cvv, card_name, card_expiration, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing addPaymentMethodSync query")
	
				// Executing INSERT query
				let query = `INSERT INTO payment (fk_userid, card_number, cvv, card_name, card_expiration) VALUES (?, ?, ?, ?, ?);`
				conn.query(query, [userid, card_number, cvv, card_name, card_expiration], (err, result) => {
	
					// Ending connection
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


	// Get all paymentids and other details of a user. 
	// NOTE only the last 4 characters of the card number is returned for privacy purposes.
	getPaymentIdsOfUser: async function (userid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing getPaymentIdsOfUser query")

		let query = `SELECT paymentid, RIGHT(card_number, 4), card_name, card_expiration FROM payment WHERE fk_userid = ?;`

		let result = await conn.query(query, [userid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getPaymentIdsOfUserSync: function(userid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing getPaymentIdsOfUserSync query")
	
				// Executing INSERT query
				let query = `SELECT paymentid, RIGHT(card_number, 4), cvv, card_name, card_expiration FROM payment WHERE fk_userid = ?;`
				conn.query(query, [userid], (err, result) => {
	
					// Ending connection
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

	// Given paymentid, return payment details of that id.
	// NOTE: this model function returns the full card number. CVV is ALSO revealed.
	getPaymentDetailsById: async function (paymentid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing getPaymentDetailsById query")

		let query = `SELECT paymentid, RIGHT(card_number, 4) as last_card_digits, card_number, card_name, card_expiration, cvv FROM payment WHERE paymentid = ?`;

		let result = await conn.query(query, [paymentid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getPaymentDetailsByIdSync: function(paymentid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing getPaymentDetailsByIdSync query")
	
				// Executing INSERT query
				let query = `SELECT paymentid, RIGHT(card_number, 4), card_name, card_expiration, cvv FROM payment WHERE paymentid = ?`;
				conn.query(query, [paymentid, userid], (err, result) => {
	
					// Ending connection
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


	// Similar to getPaymentDetailsById, however, we do NOT return
	// the full card number. CVV is also HIDDEN.
	getPaymentDetailsByIdClean: async function (paymentid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing getPaymentDetailsById query")

		let query = `SELECT paymentid, RIGHT(card_number, 4) as last_card_digits, card_name, card_expiration FROM payment WHERE paymentid = ?`;

		let result = await conn.query(query, [paymentid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getPaymentDetailsByIdCleanSync: function(paymentid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing getPaymentDetailsByIdSync query")
	
				// Executing INSERT query
			let query = `SELECT paymentid, RIGHT(card_number, 4) as last_card_digits, card_name, card_expiration, FROM payment WHERE paymentid = ?`;
				conn.query(query, [paymentid, userid], (err, result) => {
	
					// Ending connection
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


	// Update payment details given id.
	updatePaymentDetailsById: async function (paymentid, card_number, card_name, card_expiration, cvv) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing updatePaymentDetailsByIdSync query")

		let query = `UPDATE payment SET card_number = ?, card_name = ?, card_expiration = ?, cvv = ? WHERE paymentid = ?`;

		let result = await conn.query(query, [card_number, card_name, card_expiration, cvv, paymentid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	updatePaymentDetailsByIdSync: function(paymentid, card_number, card_name, card_expiration, cvv, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing updatePaymentDetailsByIdSync query")
	
				// Executing INSERT query
				let query = `UPDATE payment SET card_number = ?, card_name = ?, card_expiration = ?, cvv = ? WHERE paymentid = ?`;
				conn.query(query, [card_number, card_name, card_expiration, cvv, paymentid], (err, result) => {
	
					// Ending connection
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


	// Delete payment method given id
	deletePaymentById: async function (paymentid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing updatePaymentDetailsByIdSync query")

		let query = `DELETE FROM payment WHERE paymentid = ?;`

		let result = await conn.query(query, [paymentid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	deletePaymentDetailsByIdSync: function(paymentid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing updatePaymentDetailsByIdSync query")
	
				let query = `DELETE FROM payment WHERE paymentid = ?;`
				conn.query(query, [paymentid], (err, result) => {
	
					// Ending connection
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
	
}

module.exports = mainModel