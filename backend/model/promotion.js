/*
=======================
This file contains all the functions that are related to the promotion table

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const db = require('./databaseConfig.js')

let mainModel = {

	// Get all promotionids, the start date of the period, the end date of the period and the time of creation
	getAllPromotions: async function() {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing getAllPromotions Query");

		let query = 'SELECT promotionid, promotionname, start, end, created_at FROM promotion';

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously. Note that this is handled in the controller layer(app.js).
		let result = await conn.query(query);
		await conn.end();
		return result;
	},
	getAllPromotionsSync: function(callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing getAllPromotionsSync Query");
	
				// Executing SELECT query
				let query = 'SELECT promotionid, promotionname, start, end, created_at FROM promotion';
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
	},

	// Given a promotion id, get all the products that participate in that promotion
	getProductsAffectedByPromotionID: async function(promotionid) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing getProductsAffectedByPromotionID Query");

		let query = `
		SELECT
			d.fk_productid as productid, p.name AS productname, d.fk_promotionid AS promotionid, d.product_discount AS product_discount
		FROM
			discount d,
			product p
		WHERE
			d.fk_productid = p.productid
				AND
			d.fk_promotionid = ?
		;
		`;
		let result = await conn.query(query, [promotionid]);
		await conn.end();
		return result;
	},
	getProductsAffectedByPromotionIDSync: function(promotionid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing getProductsAffectedByPromotionIDSync Query");
	
				// Executing SELECT query
				let query = `
				SELECT
					d.fk_productid as productid, p.name AS productname, d.fk_promotionid AS promotionid, d.product_discount AS product_discount
				FROM
					discount d,
					product p
				WHERE
					d.fk_productid = p.productid
						AND	
					d.fk_promotionid = ?
				;
				`;
				conn.query(query, [promotionid], (err, result) => {
	
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

	// Given productid, get all the promotions that the product has
	getPromotionOfProduct: async function(productid) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing getPromotionOfProduct Query");

		let query = `
		SELECT
			promotion.promotionid as promotionid, promotion.promotionname as promotionname, promotion.start as start, promotion.end as end, discount.product_discount product_discount
		FROM
			promotion,
			discount,
			product
		WHERE
			discount.fk_productid = product.productid
				AND
			discount.fk_productid = ?
				AND 
			discount.fk_promotionid = promotion.promotionid;
		;
		`;
		let result = await conn.query(query, [productid]);
		await conn.end();
		return result;
	},
	getPromotionOfProductSync: function(productid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing getPromotionOfProductSync Query");
	
				// Executing SELECT query
				let query = `
				SELECT
					promotion.promotionid as promotionid, promotion.promotionname as promotionname, promotion.start as start, promotion.end as end, discount.product_discount product_discount
				FROM
					promotion,
					discount,
					product
				WHERE
					discount.fk_productid = product.productid
						AND
					discount.fk_productid = ?
						AND 
					discount.fk_promotionid = promotion.promotionid;
				`;
				conn.query(query, [productid], (err, result) => {
	
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


	// Create a new promotion
	addPromotion: async function(promotionname, start, end) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing addPromotion Query");

		let query = `INSERT INTO promotion (promotionname, start, end) VALUES (?, ?, ?);`;
		let result = await conn.query(query, [promotionname, start, end]);
		await conn.end();
		return result;
	},
	addPromotionSync: function(promotionname, start, end, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing addPromotionSync Query");
	
				// Executing INSERT query
				let query = `INSERT INTO promotion (promotionname, start, end) VALUES (?, ?, ?);`;
				conn.query(query, [promotionname, start, end], (err, result) => {
	
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

	// Create a new promotion
	updatePromotionByID: async function(promotionid, promotionname, start, end) {

		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing updatePromotionByID Query");

		let query = `UPDATE promotion SET promotionname = ?, start = ?, end = ? WHERE promotionid = ?;`;
		let result = await conn.query(query, [promotionname, start, end, promotionid]);
		await conn.end();
		return result;
	},
	updatePromotionByIDSync: function(promotionid, promotionname, start, end, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing updatePromotionByIDSync Query");
	
				// Executing INSERT query
				let query = `UPDATE promotion SET promotionname = ?, start = ?, end = ? WHERE promotionid = ?;`;
				conn.query(query, [promotionname, start, end, promotionid], (err, result) => {
	
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


	// Add a discount/promotion to a product.
	// NOTE: A promotion does not have a default discount across all products.
	// The discount for a particular product during a certain promotion must be specified,
	// which has to be done so through product_discount.
	// <product_discount> takes in an integer that represents the percentage discount
	addDiscountToProduct: async function(promotionid, productid, product_discount) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing addDiscountToProduct Query");

		let query = `INSERT INTO discount (fk_promotionid, fk_productid, product_discount) VALUES (?, ?, ?);`;
		let result = await conn.query(query, [promotionid, productid, product_discount]);
		await conn.end();
		return result;
	},
	addDiscountToProductSync: function(promotionid, productid, product_discount, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing addDiscountToProductSync Query");
	
				// Executing INSERT query
				let query = `INSERT INTO discount (fk_promotionid, fk_productid, product_discount) VALUES (?, ?, ?);`;
				conn.query(query, [promotionid, productid, product_discount], (err, result) => {
	
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

	// Given a promotionid, delete the promotion
	// NOTE: this has a cascading effect; when a promotion is deleted,
	// all products that participate in that promotion will lose the 
	// respective discounts
	deletePromotionByID: async function(promotionid) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing deletePromotionByID Query");

		let query = 'DELETE FROM promotion WHERE promotionid = ?;';
		let result = await conn.query(query, [promotionid]);
		await conn.end();
		return result;
	},
	deletePromotionByIDSync: function(promotionid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing deletePromotionByIDSync Query");
	
				// Executing DELETE query
				let query = 'DELETE FROM promotion WHERE promotionid = ?;';
				conn.query(query, [promotionid], (err, result) => {
	
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

	// Given productid and promotionid, remove the discount that
	// is induced by the promotion from that product.
	removeDiscountOfProduct: async function(productid, promotionid) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing removeDiscountOfProduct Query");

		// Executing DELETE query
		let query = 'DELETE FROM discount WHERE fk_productid = ? AND fk_promotionid = ?;';
		let result = await conn.query(query, [productid, promotionid]);
		await conn.end();
		return result;
	},
	removeDiscountOfProductSync: function(productid, promotionid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing removeDiscountOfProductSync Query");
	
				// Executing DELETE query
				let query = 'DELETE FROM discount WHERE fk_productid = ? AND fk_promotionid = ?;';
				conn.query(query, [productid, promotionid], (err, result) => {
	
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


	// Given productid and promotionid, remove the discount that
	// is induced by the promotion from that product.
	getAllDiscounts: async function() {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[promotion.js] Executing removeDiscountOfProduct Query");

		// Executing DELETE query
		let query =
		`
		SELECT
			discount.product_discount, product.productid, product.name, promotion.promotionid, promotion.promotionname
		FROM
			discount,
			product,
			promotion
		WHERE
			discount.fk_productid = product.productid
				AND
			discount.fk_promotionid = promotion.promotionid
		ORDER BY
			product.name ASC
		;
		`
		let result = await conn.query(query, []);
		await conn.end();
		return result;
	},
	getAllDiscountsSync: function(callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Check for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[promotion.js] Executing removeDiscountOfProductSync Query");
	
				// Executing DELETE query
				let query = 'DELETE FROM discount WHERE fk_productid = ? AND fk_promotionid = ?;';
				conn.query(query, [], (err, result) => {
	
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

// Export the model
module.exports = mainModel;