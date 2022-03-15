/*
=======================
This file contains all the functions that are related to the product and reviews tables

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const db = require('./databaseConfig.js');

let mainModel = {

	// Insert a new product
	addProduct: async function(name, description, categoryid, brand, price) {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing addProduct Query");

		// Executing query
		let query = `INSERT INTO product (name, description, categoryid, brand, price) VALUES (?, ?, ?, ?, ?);`;
		let result = conn.query(query, [name, description, categoryid, brand, price]);
		await conn.end();

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result; 
	},
	addProductSync: function(name, description, categoryid, brand, price, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Checking for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing addProductSync Query");
	
				let query = `INSERT INTO product (name, description, categoryid, brand, price) VALUES (?, ?, ?, ?, ?);`;
				// Execute the query
				conn.query(query, [name, description, categoryid, brand, price], (err, result) => {
	
					// End connection
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

	// Edit product
	editProductByID: async function(productid, name, description, categoryid, brand, price) {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing editProductByID Query");

		// Executing query
		let query = `
			UPDATE product
			SET 
				name = ?, description = ?, categoryid = ?, brand = ?, price = ?
			WHERE
				productid = ?
				
			;
		`
		let result = conn.query(query, [name, description, categoryid, brand, price, productid]);
		await conn.end();

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result; 
	},
	editProductByIDSync: function(productid, name, description, categoryid, brand, price, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Checking for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing editProductByIDSync Query");
	
				let query = `
					UPDATE product
					SET 
						name = ?, description = ?, categoryid = ?, brand = ?, price = ?
					WHERE
						productid = ?
						
					;
				`
				// Execute the query
				conn.query(query, [name, description, categoryid, brand, price, productid], (err, result) => {
	
					// End connection
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

	// Get all products
	getAllProducts: async function() {

		// Upgrade the connection to use promises
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing getAllProducts Query");

		// Executing query
		let query = `SELECT productid, name, description, categoryid, brand, price FROM product`;
		let result = conn.query(query);
		await conn.end();

		// Returns a list
		//		[rows, fields]
		// where rows is the typical return you may expect when you run
		// sql models synchronously.
		return result; 
	},
	getAllProductsSync: function(callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			// Checking for connection error
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing getAllProductsSync Query");
	
				let query = `SELECT productid, name, description, categoryid, brand, price FROM product`;
				// Execute the query
				conn.query(query, [], (err, result) => {
	
					// End connection
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


	// Given productid, get the details of that product
	getProductByID: async function(id) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[category.js] Executing getProductByID Query");

		let query = `
			SELECT
				product.productid, product.name, product.description, product.categoryid, category.category as categoryname, product.brand, product.price, AVG(reviews.rating) as rating, COUNT(product.productid) as review_count, product.imageURL 
			FROM
				category, product
			LEFT JOIN
				reviews
					ON
				product.productid = reviews.fk_productid
			WHERE
				product.categoryid = category.categoryid
					AND
				productid = ?
			;
		`;
		let result = await conn.query(query, [id]);
		await conn.end();
		return result;
	},
	getProductByIDSync: function(id, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[category.js] Executing getProductByIDSync Query");
	
				let query = `
					SELECT
						product.productid, product.name, product.description, product.categoryid, category.category as categoryname, product.brand, product.price, AVG(reviews.rating) as rating, COUNT(product.productid) as review_count, product.imageURL 
					FROM
						category, product
					LEFT JOIN
						reviews
							ON
						product.productid = reviews.fk_productid
					WHERE
						product.categoryid = category.categoryid
							AND
						productid = ?

					;
				`;
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

	// Get all brands 
	getAllBrands: async function(id) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[category.js] Executing getAllBrands Query");

		let query = `
			SELECT
				brand
			FROM
				product
			GROUP BY
				brand
			ORDER BY
				brand ASC
			;
		`;
		let result = await conn.query(query, [id]);
		await conn.end();
		return result;
	},
	getAllBrandsSync: function(id, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[category.js] Executing getAllBrandsSync Query");
	
				let query = `
					SELECT
						brand
					FROM
						product
					GROUP BY
						brand
					ORDER BY
						brand ASC
					;
				`;
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

	// Given query(search term), category ids, brands and promotion ids, search for that product
	searchProducts: async function(search_term, categories, promotions, brands, left_range = 0, product_count = 100) {
		// product_count is the number of products to show, starting from the left_range

		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[category.js] Executing searchProducts Query");

		// We need to use left join. This is because some products may not have any promotions, and using
		// a JOIN or WHERE statement will exclude all products without promotions.
		let query = `
			SELECT
                product.productid, product.name, product.description
			FROM
				product

			LEFT JOIN
				(
					SELECT
						discount.fk_productid, promotion.promotionid, promotion.promotionname
							FROM
						discount,
						promotion
							WHERE
						discount.fk_promotionid = promotion.promotionid
				) AS discount

                    ON

				product.productid = discount.fk_productid

			WHERE
				product.categoryid in (?)

					AND

				product.brand in (?)

					AND

				(
					IF (0 in (?),
                        TRUE,
                        discount.promotionid in (?)
					)
				)

					AND

				(
					IF (? = '',
                        TRUE,
						(product.name REGEXP ?
							OR
						product.description REGEXP ?
							OR
						product.brand REGEXP ?)
					)
				)

			GROUP BY
					product.productid

			ORDER BY
					product.name ASC
			LIMIT
				?, ?
			;
		`

		let result = await conn.query(query, [categories, brands, promotions, promotions, search_term, search_term, search_term, search_term, left_range, product_count]);

		await conn.end();
		return result;
	},
	searchProductsSync: function(search_term, promotions, categories, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[category.js] Executing getProductByIDSync Query");
	
				let query = `
					SELECT
						product.productid, product.name, product.description
					FROM
						product

					LEFT JOIN
						(
							SELECT
								discount.fk_productid, promotion.promotionid, promotion.promotionname
									FROM
								discount,
								promotion
									WHERE
								discount.fk_promotionid = promotion.promotionid
						) AS discount

							ON

						product.productid = discount.fk_productid

					WHERE
						product.categoryid in (?)
							AND
						(
							IF (? = 0,
								TRUE,
								discount.promotionid in (?)
							)
						)

							AND

						(
							IF (? = '',
								TRUE,
								(product.name REGEXP ?
									OR
								product.description REGEXP ?
									OR
								product.brand REGEXP ?)
							)
						)

					GROUP BY
							product.productid

					ORDER BY
							product.name ASC
					;
				`
				conn.query(query, [categories, promotions, promotions, search_term, search_term, search_term, search_term], (err, result) => {
	
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


	// Given productid, delete that product.
	// NOTE: this has a cascading effect; any other
	// rows/data that have a foreign key linked to the product
	// will also be deleted.
	deleteProductByID: async function(id) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing deleteProductByID Query");

		let query = 'DELETE FROM product WHERE productid = ?;';
		let result = await conn.query(query, [id]);
		await conn.end();
		return result;
	},
	deleteProductByIDSync: function(id, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing deleteProductByIDSync Query");
	
				let query = 'DELETE FROM product WHERE productid = ?;';
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


	// Add a review to the product
	addReviewToProductByID: async function(id, userid, rating, review) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing addReviewToProductByID Query");

		let query = `INSERT INTO reviews (fk_productid, fk_userid, rating, review) VALUES (?, ?, ?, ?);`;
		let result = await conn.query(query, [id, userid, rating, review]);
		await conn.end();
		return result;
	},
	addReviewToProductByIDSync: function(id, userid, rating, review, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing addReviewToProductByIDSync Query");
	
				let query = `INSERT INTO reviews (fk_productid, fk_userid, rating, review) VALUES (?, ?, ?, ?);`;
				conn.query(query, [id, userid, rating, review], (err, result) => {
	
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

	// Given a productid, get all reviews of that product
	getAllReviewsOfProductByID: async function(productid) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[category.js] Executing addCategory Query");

		let query = `
		SELECT
			r.fk_productid AS productid, r.fk_userid AS userid, u.username, r.rating, r.review, DATE_FORMAT(r.created_at, '%Y-%m-%d %T') as created_at
		FROM
			reviews r, user u 
		WHERE
			r.fk_userid = u.userid
				AND
			r.fk_productid = ?
		ORDER BY
			r.created_at DESC
		;
		`;
		let result = await conn.query(query, [productid]);
		await conn.end();
		return result;
	},
	getAllReviewsOfProductByIDSync: function(productid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("Executing SELECT Query");
	
				let query = `
				SELECT
					r.fk_productid AS productid, r.fk_userid AS userid, u.username, r.rating, r.review, DATE_FORMAT(r.created_at, '%Y-%m-%d %T') as created_at
				FROM
					reviews r, user u 
				WHERE
					r.fk_userid = u.userid
						AND
					r.fk_productid = ?
				ORDER BY
					r.created_at DESC
				;
				`;
				conn.query(query, [productid], (err, result) => {
	
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

	// Given the URL of an image and a product id,
	// update the product's image url.
	// NOTE: this only contains the URL of the image, not
	// the image content itself. The image is stored
	// and intended to be retrieved from the file system.
	// This stores the RELATIVE URL of the image, the ROOT
	// DIRECTORY ends at ...\backend\.
	updateImageURLByID: async function(imageURL, id) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing updateImageByID Query");

		// Executing INSERT query
		let query = 'UPDATE product SET imageURL = ? WHERE productid = ?;';
		let result = await conn.query(query, [imageURL, id]);
		await conn.end();
		return result;
	},
	updateImageURLByIDSync: function(imageURL, id, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing updateImageByIDSync Query");
	
				let query = 'UPDATE product SET imageURL = ? WHERE productid = ?;';
				conn.query(query, [imageURL, id], (err, result) => {
	
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


	// Returns the imageURL.
	// NOTE: to get the content of an image, retrieve the
	// image url first, and locate the image through this url.
	// The urls are all RELATIVE PATHS, with the ROOT DIRECTORY
	// ending at ...\backend\.
	getImageURLByID: async function(productid) {
		let conn = (db.getConnection()).promise();
		await conn.connect()
		// console.log("[product.js] Executing getImageURLByID Query");

		let query = 'SELECT imageURL FROM product WHERE productid = ?';
		let result = await conn.query(query, [productid]);
		await conn.end();
		return result;
	},
	// Returns the imageURL synchronously
	getImageURLByIDSync: function(productid, callback) {
		let conn = db.getConnection();
		conn.connect((err) => {
	
			if (err) {
				Console.log(err);
				callback(err, null);
			} else {
	
				// console.log("[product.js] Executing getImageURLByIDSync Query");

				let query = 'SELECT imageURL FROM product WHERE productid = ?';
				conn.query(query, [productid], (err, result) => {
	
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