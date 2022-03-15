/*
=======================
This file contains all the functions that are related to the category table

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const db = require('./databaseConfig.js');

let mainModel = {

	// Insert a new category
	addCategory: async function(category, description) {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[category.js] Executing addCategory Query");

		let query = `INSERT INTO category (category, description) VALUES (?, ?);`;
		let result = await conn.query(query, [category, description]);
		await conn.end();

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run the
		// sql models synchronously.
		return result;
	},
	addCategorySync: function(category, description, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
			
			// Check if there is a connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[category.js] Executing addCategorySync Query");
	
				let query = `INSERT INTO category (category, description) VALUES (?, ?);`;
				// Executing query
				conn.query(query, [category, description], (err, result) => {
	
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

	// Returns an array that contains all categories as objects
	getAllCategories: async function() {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[category.js] Executing getAllCategories Query");

		let query = 'SELECT categoryid, category, description FROM category;';
		let result = await conn.query(query);
		await conn.end();
		return result;
	},
	getAllCategoriesSync: function(callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[category.js] Executing getAllCategories Query");
	
				let query = 'SELECT categoryid, category, description FROM category;';
				conn.query(query, (err, result) => {
	
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
	}
}	

// Export the model
module.exports = mainModel