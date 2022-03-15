/*
=======================
This file contains all the functions that are related to the userInterest table

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const db = require('./databaseConfig.js');

let mainModel = {

	// Given a userid and a list of categoryids,
	// attempt to add all the categoryids to the user's interest
	// NOTE that user's category interests are implemented through
	// many-to-many relationships.
	addInterestsToUser: async function(userid, categoryids) {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[interest.js] Executing addInterestsToUser Query");

		let query = `INSERT INTO userInterest (fk_userid, fk_categoryid) VALUES (?, ?);`;
		
		let errArray = [] // This array will contain all possible errors from inserting categoryid

		// All insertion queries will be executed, even if there is an error among
		// any of them. This is done to ensure a more consistent behaviour.
		await Promise.all(
			categoryids.map(
				async(categoryid) => {
					return await conn.query(query, [userid, categoryid])
					.catch(err => {
						errArray.push({categoryid: categoryid, code: err.code})
					})
					// If there is an error with a particular promise, instead of throwing
					// the error immediately, we will instead add both the categoryid and the error into
					// errArray. 
				}
			)
		)

		// We will finally throw the error array, if there are any errors
		if (errArray.length > 0) throw errArray
		await conn.end();
		return "Nil"
	},
	addInterestsToUserSync: function(userid, categoryids, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[interest.js] Executing addInterestsToUserSync Query");

				let query = `INSERT INTO userInterest (fk_userid, fk_categoryid) VALUES (?, ?);`;

				let errArray = [] // Contains all errors that we may encounter
				for (let i = 0; i < categoryids.length; i++) {
					conn.query(query, [userid, categoryids[i]], (err, result) => {

						// If there is an error, we will add the error to errArray and only throw
						// after all the insert statements are done. This leads to
						// more consistent behaviour. If we threw the error immediately,
						// we would not be able to go through all the category ids, which
						// would be inconsistent as it depends on the order of the
						// category ids.
						if (err) {
							errArray.push({categoryid: categoryids[i], code: err.code})
						} else {
							conn.end();
						}
					});
				}

				// If there is at least one error after trying to insert,
				// callback with an error
				if (errArray) {
					// console.log();
					callback(errArray, null);
				} else {
					callback(null, "Nil");
				}
			}
		})
	},


	// Given a userid, get all the categories that the user is interested in
	getInterestOfUser: async function(userid) {
		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[interest.js] Executing getInterestOfUser Query");

		let query = `
		SELECT
			userInterest.fk_categoryid as categoryid, category.category, category.description 
		FROM
			userInterest
		JOIN
			category
				ON
					userInterest.fk_categoryid = category.categoryid
		WHERE
			userInterest.fk_userid = ?
		ORDER BY
			userInterest.created_at DESC
		;
		`;
		let result = await conn.query(query, [userid]);
		await conn.end();

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously. 
		return result; 
	},
	getInterestOfUserSync: function(userid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[interest.js] Executing getInterestOfUser Query");
	
				let query = `
				SELECT
					userInterest.fk_categoryid as categoryid, category.category, category.desciption 
				FROM
					userInterest
				JOIN
					category
						ON
							userInterest.fk_categoryid = category.categoryid
				WHERE
					userInterest.fk_userid = ?
				ORDER BY
					userInterest.created_at DESC
				;
				`;
				conn.query(query, [userid], (err, result) => {
	
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


	// Given userid and categoryids, delete the specific interests.
	// NOTE categoryids takes in a list of category ids
	deleteInterestOfUser: async function(userid, categoryids) {
		let conn = db.getConnection().promise();
		await conn.connect();

		// console.log("[interest.js] Executing deleteInterestOfUser Query");

		let query = 'DELETE FROM userInterest WHERE fk_userid = ? AND fk_categoryid = ?;';
		let result = await Promise.all(
			categoryids.map(
				async(categoryid) => {
					return await conn.query(query, [userid, categoryid]);
				}
			)
		)
		await conn.end();

		return result;

	},
	deleteInterestOfUserSync: function(userid, categoryid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("Executing DELETE Query");
	
				let query = 'DELETE FROM userInterest WHERE fk_userid = ? AND fk_categoryid = ?;';
				conn.query(query, [userid, categoryid], (err, result) => {
	
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
	
	
	// Given a userid, retrieve the top rated 5 products for the user by the
	// categories they are interested in.
	recommendTop5ProductsForUser: async function(userid) {

		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[interest.js] Executing recommendTop5ProductsForUser Query");
		
		let query = `
		SELECT
			AVG(reviews.rating) as average_rating, reviews.fk_productid as productid, product.name, product.categoryid
		FROM
			reviews
		JOIN
			product
				ON 
					product.productid = reviews.fk_productid
		WHERE
			product.categoryid in (
				select fk_categoryid from userInterest where fk_userid = ?
			)
		GROUP BY
			reviews.fk_productid
		ORDER BY
			AVG(reviews.rating)
			DESC
		LIMIT
			5;
		`;
		let result = await conn.query(query, [userid]);
		await conn.end();
		
		return result; 
	},
	recommendTop5ProductsForUserSync: function(userid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {

			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[interest.js] Executing recommendTopNProductsForUser Query");
	
				let query = `
				SELECT
					AVG(reviews.rating) as average_rating, reviews.fk_productid as productid, product.name, product.categoryid
				FROM
					reviews
				JOIN
					product
						ON 
							product.productid = reviews.fk_productid
				WHERE
					product.categoryid in (
						select fk_categoryid from userInterest where fk_userid = ?
					)
				GROUP BY
					reviews.fk_productid
				ORDER BY
					AVG(reviews.rating)
					DESC
				LIMIT
					5;
				`;
				conn.query(query, [userid], (err, result) => {
	
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