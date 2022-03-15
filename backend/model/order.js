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

	// Create an order.
	// NOTE we do not reference the address and payment tables, as users have the ability to delete/edit their payment methods and addresses.
	// For the purpose of retaining accurate order records, we store a copy of the addresses and payments in the orders instead.
	createOrder: async function (userid, card_number, cvv, card_name, card_expiration, address, address_name, address_postal, total) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing createOrder query")

		let query = `INSERT INTO orders (fk_userid, card_number, cvv, card_name, card_expiration, address, address_name, address_postal, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`

		let result = await conn.query(query, [userid, card_number, cvv, card_name, card_expiration, address, address_name, address_postal, total])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	createOrderSync: function (userid, card_number, cvv, card_name, card_expiration, address, address_name, address_postal, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing createOrderSync query")
	
				// Executing INSERT query
				let query = `INSERT INTO orders (fk_userid, card_number, cvv, card_name, card_expiration, address, address_name, address_postal) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
				conn.query(query, [userid, card_number, cvv, card_name, card_expiration, address, address_name, address_postal], (err, result) => {
	
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


	// Add a product to an order, given the orderid, productid and quantity.
	// NOTE: In the database structure, fk_productid IS NOT referencing productid.
	// This is because when a product is deleted, it is important that we DO NOT
	// delete the purchase record.
	purchaseItem: async function (orderid, productid, quantity) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing purchaseItem query")

		let query = `INSERT INTO purchase (fk_orderid, fk_productid, quantity) VALUES (?, ?, ?);`

		let result = await conn.query(query, [orderid, productid, quantity])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	purchaseItemSync: function(orderid, productid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing purchaseItemSync query")
	
				// Executing INSERT query
				let query = `INSERT INTO purchase (fk_orderid, fk_productid, quantity) VALUES (?, ?, ?);`
				conn.query(query, [orderid, productid, quantity], (err, result) => {
	
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

	
	// Get all orders of a user.
	getOrdersOfUser: async function (userid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing getOrderIdsOfUser query")

		// We only return the last four characters as card information
		let query = `
		SELECT
			orderid, RIGHT(card_number, 4) as last_card_digits, address, address_name, address_postal, total, created_at
		FROM
			orders
		WHERE
			fk_userid = ?;
		`

		let result = await conn.query(query, [userid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getOrdersOfUserSync: function(userid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing getOrderIdsOfUserSync query")
	
				let query = `
				SELECT
					orderid, RIGHT(card_number, 4) as last_card_digits, address, address_name, address_postal
				FROM
					orders
				WHERE
					fk_userid = ?;
				`
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


	// Get all products that were bought from an order.
	// NOTE we do not use any join statement here, any deleted/missing
	// productid is not handled here and has to be handled elsewhere.
	getPurchasesByOrderId: async function (orderid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[order.js] Executing getPurchasesByOrderId query")

		let query = `SELECT purchaseid, fk_productid, quantity FROM purchase WHERE fk_orderid = ?;`

		let result = await conn.query(query, [orderid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getPurchasesByOrderIdSync: function(orderid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing getPurchasesByOrderIdSync query")
																							
				let query = `SELECT purchaseid, fk_productid FROM purchase WHERE fk_orderid = ?;`
				conn.query(query, [orderid], (err, result) => {
	
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