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

	// Insert address into the database.
	createAddress: async function (userid, address, address_name, postal_code) {

		// Upgrade connection to be promise-based.
		let conn = (db.getConnection()).promise()

		await conn.connect()
		// console.log("[order.js] Executing createAddress query")

		let query = `INSERT INTO address (fk_userid, address, name, postal_code) VALUES (?, ?, ?, ?)`

		let result = await conn.query(query, [userid, address, address_name, postal_code])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	createAddressSync: function(userid, address, address_name, postal_code, callback) {
		let conn = db.getConnection(); // By default, the connection is synchronous and callback based.
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[order.js] Executing createAddressSync query")
				let query = `INSERT INTO address (fk_userid, address, name, postal_code) VALUES (?, ?, ?, ?)`
				conn.query(query, [userid, address, address_name, postal_code], (err, result) => {
	
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

	
	// Get address details, given the address id
	getAddressById: async function (addressid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[address.js] Executing getAddressById query")

		let query = `SELECT addressid, fk_userid, address, name, postal_code FROM address WHERE addressid = ?`

		let result = await conn.query(query, [addressid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getAddressByIdSync: function(addressid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[address.js] Executing getAddressByIdSync query")
	
				// Executing INSERT query
				let query = `SELECT addressid, fk_userid, address, name, postal_code FROM address WHERE addressid = ?`
				conn.query(query, [addressid], (err, result) => {
	
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


	// Delete an address given its id. 
	// NOTE this is omnipotent
	deleteAddressById: async function (addressid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[address.js] Executing deleteAddressById query")

		let query = `DELETE FROM address WHERE addressid = ?`

		let result = await conn.query(query, [addressid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	deleteAddressByIdSync: function(addressid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[address.js] Executing deleteAddressByIdSync query")
	
				// Executing INSERT query
				let query = `DELETE FROM address WHERE addressid = ?`
				conn.query(query, [addressid], (err, result) => {
	
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


	// Update an address given the address details and the id
	updateAddressById: async function (addressid, address, address_name, postal_code) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		// console.log("[address.js] Executing updateAddressById query")

		let query = `UPDATE address SET address = ?, name = ?, postal_code = ? WHERE addressid = ?`

		let result = await conn.query(query, [address, address_name, postal_code, addressid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	updateAddressByIdSync: function(addressid, address, address_name, postal_code) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// Executing INSERT query
				let query = `UPDATE address SET address = ?, name = ?, postal_code = ? WHERE addressid = ?`
				conn.query(query, [address, address_name, postal_code, addressid], (err, result) => {
	
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


	// Get all addressids and more information of a user. 
	getAddressIdsOfUser: async function (userid) {
		let conn = (db.getConnection()).promise()
		await conn.connect()
		let query = `SELECT addressid, address, name, postal_code FROM address WHERE fk_userid = ?`

		let result = await conn.query(query, [userid])
		await conn.end()

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result
	},
	getAddressIdsOfUserSync: function(userid) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				let query = `SELECT addressid, address, name, postal_code FROM address WHERE fk_userid = ?`
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
}

module.exports = mainModel