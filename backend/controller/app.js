//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

/**
 * ========================================
 * 
 *	This file contains all endpoints for the backend API 
 * 
 * ========================================
 */


//======================
// npm modules
//======================
const express = require('express');
const multer = require('multer')
const path = require('path');

// jwt
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRETKEY

let router = express();
const upload = multer();

// cors
const cors = require('cors');
router.options('*', cors());
router.use(cors());

router.use(express.json());
router.use(express.urlencoded({extended: false}));


// Models
const userModel = require('../model/user.js');
const productModel = require('../model/product.js');
const categoryModel = require('../model/category.js');
const promotionModel = require('../model/promotion.js');
const interestModel = require('../model/interest.js');
const orderModel = require('../model/order.js');
const addressModel = require('../model/address.js')
const paymentModel = require('../model/payment.js')

// Custom Errors
const AddressNotFoundError = require('../errors/addressNotFound.js')
const BadFileTypeError = require('../errors/badFileType.js')
const BadRequestError = require('../errors/badRequest.js')
const BrandNotFoundError = require('../errors/brandNotFound.js')
const CategoryNotFoundError = require('../errors/badRequest.js')
const DataTooLongError = require('../errors/dataTooLong.js')
const DiscountNotFoundError = require('../errors/discountNotFound.js')
const ExistingAddressForUserError = require('../errors/existingAddressForUser.js')
const ExistingCardForUserError = require('../errors/existingCardForUser.js')
const ExistingCategoryError = require('../errors/existingCategory.js')
const ExistingDiscountError = require('../errors/existingDiscount.js')
const ExistingEmailError = require('../errors/existingEmail.js')
const ExistingProductError = require('../errors/existingProduct.js')
const ExistingPromotionError = require('../errors/existingPromotion.js')
const ExistingReviewError = require('../errors/existingReview.js')
const ExistingUserError = require('../errors/existingUser.js')
const FileTooLargeError = require('../errors/fileTooLarge.js')
const ImageNotFoundError = require('../errors/imageNotFound.js')
const InterestNotFoundError = require('../errors/interestNotFound.js')
const InvalidCartError = require('../errors/InvalidCart.js')
const InvalidTokenError = require('../errors/invalidToken.js')
const OrderHistoryNotFoundError = require('../errors/orderHistoryNotFound.js')
const OrderNotFoundError = require('../errors/orderNotFound.js')
const PaymentNotFoundError = require('../errors/paymentNotFound.js')
const ProductNotFoundError = require('../errors/productNotFound.js')
const PromotionNotFoundError = require('../errors/promotionNotFound.js')
const ReviewsNotFoundError = require('../errors/reviewsNotFound.js')
const UnauthorizedError = require('../errors/unauthorized.js')
const UserAlreadyLoggedInError = require('../errors/userAlreadyLoggedIn.js')
const UserNotFoundError = require('../errors/userNotFound.js')

// Middleware
const verifyTokenMiddleware = require('../auth/verifyTokenMiddleware.js')
const verifyLoginMiddleware = require('../auth/verifyLoginMiddleware.js')

// Libs (Custom made functions)
const fileTools = require('../libs/fileTools.js');
const cardValid = require('../libs/validateCard.js')
const addressValid = require('../libs/validateAddress.js')

//===================================================

router.use(verifyTokenMiddleware)

// ----- Endpoint Labeling ------
// Below is how endpoints will be commented.
// [<Endpoint Number>] <summarized description of endpoint> (<Roles authorized to access the endpoint>)
// ------------------------------


// [Endpoint 1] Get token information (Public, Customer, Admin)
router.get('/api/token', async(req, res) => {
	/**
	 * This endpoint decodes the token passed by Authorization Header and returns
	 * the role from that token.
	 * 
	 * If the token is empty, we return the "Public" role.
	 */
	try {

		// NOTE:
		// we replace both Bearer with and without the space. This is because if the token is empty, "Bearer " is shortened to "Bearer".
		let token = req.headers.authorization.replace("Bearer ", "").replace("Bearer", "")
		
		// If token is empty, we use a public token
		let responseToken = token || jwt.sign({userid: undefined, role: "Public"}, JWT_SECRET, {algorithm: 'HS256', expiresIn: 86400})


		// NESTED try-catch to throw custom error
		try {
			let {userid, role} = jwt.verify(responseToken, JWT_SECRET, {algorithm: 'HS256'})

			res.status(200).json(
				{
					"role": role
				}
			)
		} catch (err) {
			throw new InvalidTokenError()
		}


	} catch (err) {
		console.log(err)
		if (err instanceof InvalidTokenError) {
			res.status(err.code).json(err) // 401
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})




//=======================================
//	User-related endpoints
//=======================================

// [Endpoint 2] (Public)
router.post('/api/login/', verifyLoginMiddleware, async(req, res) => {
	/**
	 * Given login information, we return the respective token if the credentials
	 * are correct.
	 */
	try {

		// Only public is allowed to login. This is handled in verifyLoginMiddleware.js, throwing a UserAlreadyLoggedInError

		// Both req.userid and req.role are derived from verifyTokenMiddleware OR overwritten by verifyLoginMiddleware.
		let token = jwt.sign({userid: req.userid, role: req.role}, JWT_SECRET, {algorithm: 'HS256', expiresIn: 86400}) // 24 hour expiry time

		res.status(200).json({role: req.role, token: token})
	} catch (err) {
		console.log(err);
		if (err instanceof UserAlreadyLoggedInError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 3] Register user (Public)
router.post('/api/register/', async(req, res) => {
	/**
	 * 
	 * This endpoint receives information of
	 * 	<username>, <email>, <contact>, <password>, <profile_pic_url> 
	 * through the form body and 'registers' the user.
	 * 
	 */
	try {

		let {username, email, contact, password, profile_pic_url} = req.body;

		// Only accepting Public users
		if (req.role !== "Public") {
			throw new UserAlreadyLoggedInError(req.userid)
		} else {

			// Data validation.
			if (username.length < 3) throw new BadRequestError("Username needs to be three or more characters")

			if (email.length < 3) throw new BadRequestError("Invalid Email")
			
			if (password.length < 5) throw new BadRequestError("Password needs to be 5 or more characters")

			// Once the data have passed validation checks, we can proceed with the rest of the endpoint
			try {

				let [registerResult, registerFields] = await userModel.addUser(username, email, contact, password, "Customer", profile_pic_url)
				let [result, fields] = await userModel.getUserByID(registerResult.insertId)

				let token = jwt.sign({userid: result[0].userid, role: result[0].type}, JWT_SECRET, {algorithm: 'HS256', expiresIn: 86400});

				res.status(201).json({role: result[0].type, token})
			} catch (err) {
				switch (err.code) {

					// Duplicate entry in MYSQL
					case "ER_DUP_ENTRY":

						// Check if the duplicate is username or from email
						let processingArray = err.sqlMessage.replaceAll("\'", "").split('.')
						let duplicateErrorColumn = processingArray[processingArray.length - 1]
						
						if (duplicateErrorColumn == "username") {
							throw new ExistingUserError(username)
						} else if (duplicateErrorColumn == "email") {
							throw new ExistingEmailError(email)
						} else {

							// By throwing the error again, we allow the outermost try-catch
							// to handle the error instead
							throw err
						}

					case "ER_DATA_TOO_LONG":
						throw new DataTooLongError("The credentials you have entered are too long!")

					default:
						throw err
				}
			} 
		}
	} catch (err) {
		console.log(err);
		if (err instanceof ExistingUserError) {
			res.status(err.code).json(err) // 422 error
		} else if (err instanceof ExistingEmailError) {
			res.status(err.code).json(err) // 422 error
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400 error
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413 error
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 4] Get user information (Customer, Admin)
router.get('/api/user', async(req, res) => {
	/**
	 * This endpoint returns information of the currently logged in user.
	 * The middleware verifyTokenMiddleware allows us to access the userid through
	 * req.userid, which we use to query the user's information. This prevents
	 * users from snooping into other users' details.
	 */
	try {

		// Public users do not have the authority to view user information
		if (req.role === "Public") {
			throw new UnauthorizedError("Public user cannot view user information")
		}

		let [result, fields] = await userModel.getUserByID(req.userid);

		// Check if any user is found by the userid.
		if (result.length == 0) {
			throw new UserNotFoundError()
		}

		// Result is returned as an array of objects. As we are guaranteed
		// that there is either only one or no results, we can access the first
		// index directly.
		res.status(200).json(result[0])
	} catch (err) {

		console.log(err);
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof UserNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

//=======================================
//	Product-related endpoints
//=======================================

// [Endpoint 5] Get all products (Public, Customer, Admin)
router.get('/api/products', async(req, res) => {
	/**
	 * This endpoint returns the very basic information on all products
	 */
	try {

		let [result, fields] = await productModel.getAllProducts()

		// Custom error thrown if there are no products in the database
		if (result.length == 0) {
			throw new ProductNotFoundError()
		}
		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 6: ADVANCED FEATURE] Get image of product (Public, Customer, Admin)
router.get('/api/product/:productid/image', async(req, res) => {
	/**
	 * This endpoint returns the image given productid
	 */
	try {

		let [result, fields] = await productModel.getProductByID(req.params.productid)

		if (result.length == 0) {
			throw new ProductNotFoundError(req.params.productid, "No product found")
		}

		// NESTED try-catch to catch errors such as the requested image not existing
		try {

			// We update the array of image details such that the imageURL is prepended
			// with '/assets'.
			result = result.map(image_details => {
				image_details.imageURL = path.join('./assets', image_details.imageURL)
				return image_details
			})

			let base64Image = await fileTools.generateImageHTML(result)

			// Return the base64 image data.
			res.status(200).json({image_data: base64Image})
		} catch (err) {
			console.log(err)
			throw new ImageNotFoundError(req.params.productid)
		}

	} catch (err) {
		console.log(err)
		if (err instanceof ImageNotFoundError) {
			res.status(err.code).json(err) // 404
		} else if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 7: ADVANCED FEATURE] Get image from backend (Public, Customer, Admin)
router.get('/api/image/', async(req, res) => {
	/**
	 * To retrieve image data from the backend, we will be doing so
	 * via an endpoint. This is more secure than using static.
	 */
	try {

		// The name/location of the requested image is passed as a query
		let name = req.query.name;

		try {

			// Get the base64 image data
			let imageBase64 = await fileTools.getImageB64(path.join('./assets', name))

			res.status(200).json({image_data: imageBase64})
		} catch (err) {
			console.log(err)
			if (err instanceof BadRequestError) {
				throw err
			} else {
				throw new ImageNotFoundError()
			}
		}

	} catch (err) {
		console.log(err)
		if (err instanceof ImageNotFoundError) {
			res.status(err.code).json(err) // 404
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 8: ADVANCED FEATURE] Search product (Public, Customer, Admin)
router.get('/api/search/', async(req, res) => {
	/**
	 * This endpoint searches a product given the queries
	 * 
	 * 	<query>
	 * 		- The search term that searches across product name, product brand and product description
	 * 	<categoryids>
	 * 		- A string that contains comma separated categoryids <- ADVANCED EFATURE
	 * 	<promotionids>
	 * 		- A string that contains comma separated promotionids <- ADVANCED FEATURE
	 * 	<brands>
	 * 		- A string that contains comma separated brand names
	 */

	try {

		let query = req.query.query;

		// The value -1 is used if categories are not specified. This is
		// because if categoryids are not specified, we assume that no
		// categoryid has been selected. By searching for -1, we can guarantee
		// no results to appear
		let categoryids = req.query.categories || "-1"

		// The value 0 is used if promotions are not specified. This indicates
		// that the user has NOT filtered for any promotions and thus ALL products
		// will be displayed
		let promotionids = req.query.promotions || "0"

		// To prevent undefined errors, we use an empty string. This empty value
		// indicates that the user has de-selected all possible brands
		let brands = req.query.brands || ""

		// For performance reasons, this query keeps track of which page the user
		// would like to view. The number of products per page can be edited below.
		let page = req.query.page || 1
		
		let search_multiple = 12 // We limit to 12 products per page


		// NESTED try-catch handling attempt to parse the strings into an array.
		// If there is any sort of error, we will throw a bad request error.
		try {

			// Check categoryids
			categoryids = categoryids.split(",").map((element) => {

				// parse into int and check if a valid number
				let intElement = parseInt(element);
				if (isNaN(intElement)) {
					throw new BadRequestError()
				}
				return intElement
			})
	
			// Check promotionids
			promotionids = promotionids.split(",").map((element) => {
				let intElement = parseInt(element);
				if (isNaN(intElement)) {
					throw new BadRequestError()
				}
				return intElement
			});

			// Convert string into array
			brands = brands.split(",")
		} catch (err) {
			throw new BadRequestError()
		}

		let [result, fields] = await productModel.searchProducts(query, categoryids, promotionids, brands, search_multiple * (page - 1), search_multiple);
	
		if (result.length == 0) {
			throw new ProductNotFoundError()
		}
		res.status(200).json(result);

	} catch (err) {
		console.log(err)
		if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 9] Get information of product (Public, Customer, Admin)
router.get('/api/product/:productid', async(req, res) => {
	/**
	 * Given a productid, this endpoint returns even
	 * more detailed information of that product.
	 *  
	 * To see exactly what information is returned,
	 * the specific SQL query can be found in 
	 * `/model/product.js`
	 */
	try {

		let productid = req.params.productid;
	
		let [result, fields] = await productModel.getProductByID(productid)

		// Handle null products
		if (result.length == 0 || result[0].productid == null) {
			throw new ProductNotFoundError(productid)
		}

		res.status(200).json(result)

	} catch (err) {
		console.log(err)
		if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 10] Return all brand names (Public, Customer, Admin)
router.get('/api/brands', async(req, res) => {
	/**
	 * Return all brand names.
	 */
	try {
		let [result, fields] = await productModel.getAllBrands();

		if (result.length == 0) {
			throw new BrandNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof BrandNotFoundError) {
			res.status(err.code).json(err)
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 11] Get product reviews (Public, Customer, Admin)
router.get('/api/product/:productid/reviews', async(req, res) => {
	/**
	 * Return all reviews information of a product. To see exactly what information
	 * is returned, the specific SQL query can be found in `/model/product.js`. 
	 */
	try {
		let productid = req.params.productid

		let [productCheck, productFields] = await productModel.getProductByID(productid)

		if (productCheck.length == 0 || productCheck[0].productid == null) {
			throw new ProductNotFoundError(productid)
		}

		let [result, fields] = await productModel.getAllReviewsOfProductByID(productid)

		// Handle null reviews
		if (result.length == 0 || result[0] == null) {
			throw new ReviewsNotFoundError(productid)
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof ReviewsNotFoundError) {
			res.status(err.code).json(err) // 404
		} else if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 12] Add a product review (Customer)
router.post('/api/product/:productid/reviews', async(req, res) => {
	/**
	 * This endpoint posts a review on a product, by taking in the following:
	 * 
	 * > parameter
	 * 	<productid>
	 * 		- The id of that product
	 * 
	 * > body
	 * 	<rating>
	 * 		- The number value of rating. Decimals are allowed
	 * 	<review_content>
	 * 		- The text in the review itself
	 *  
	 */
	try {
		let productid = req.params.productid

		let {rating, review_content} = req.body

		// Public users are not authorized
		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can post a review")
		}

		// The rating is an invalid number.
		if (!(1 <= rating && rating <= 5)) {
			throw new BadRequestError("You cannot have a rating of 0 stars")
		}

		// NESTED try-catch for MySQL statement
		try {
			await productModel.addReviewToProductByID(productid, req.userid, rating, review_content)
		} catch (err) {

			// We check if the SQL error is something we can return back to 
			// the user
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingReviewError()

				case 'ER_DATA_TOO_LONG':
					throw new DataTooLongError("The review is too long!")

				case 'ER_NO_REFERENCED_ROW_2':
					throw new ProductNotFoundError(productid, "That product does not exist")

				default:
					throw err;
			}
		}

		res.status(201).json({message: "Review created!"})
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ExistingReviewError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413
		} else if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 13] Add new products (Admin)
router.post('/api/product', upload.single('image'), async(req, res) => {
	/**
	 * This endpoint adds a new product, taking in:
	 * 
	 * 	<product_name>
	 * 		- name of product
	 * 	<product_price>
	 * 		- raw price of product
	 * 	<product_category>
	 * 		- category of product
	 * 	<product_brand>
	 * 		- brand of product
	 * 	<product_desc>
	 * 		- description of product
	 * 	<image>
	 * 		- image of the product
	 * 
	 * This endpoint uses multer to handle the form data.
	 */
	try {

		// Only admins are permitted to add images
		if (req.role !== "Admin") {
			throw new UnauthorizedError("Only admins are allowed to add new products")
		}

		let {product_name, product_price, product_category, product_brand, product_desc} = req.body;


		// Validating product name
		product_name = product_name.replace(/^\s+/gm, '').replace(/\s+$/gm, ''); // Left strip and right strip white spaces
		if (product_name.length == 0) {
			throw new BadRequestError('Product name is not valid.')
		}

		product_name = product_name.toUpperCase() // Capitalize product name before attempting to insert into database

		// Add the product details
		let result, fields; // NOTE these variables are declared outside of the try-catch. This is because we need to access the inserted
							// product id later
		try {
			[result, fields] = await productModel.addProduct(product_name, product_desc, product_category, product_brand, product_price)
		} catch (err) {
			console.log(err)

			// Check if the SQL error contains information that we can
			// relay back to the user
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingProductError(product_name)
					
				case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
					throw new BadRequestError(`Price must be a number`)

				case 'ER_DATA_TOO_LONG':
					throw new DataTooLongError('The product name or description or brand is too long!')

				default:
					// Unhandled SQL errors will be thrown again
					throw err
			}
		}


		// We handle the image and text inputs separately, handling the text inputs first.
		// This is to avoid the situation where a text input may be invalid, yet the image gets downloaded.
		
		let downloadedFileURL = null // store the new fileURL
		try {
			// This will throw BadFileTypeError or FileTooLargeError, if
			// the file validation is not successful
			let mimetype = await fileTools.validateFile(req.file);
	
			// Download the file. If the download is successfully, we 
			// are returned the new URL of the downloaded file
			downloadedFileURL = await fileTools.downloadFile({
				file: req.file,
				name: `product_image_${Date.now()}`,
				ext: mimetype.ext,
				dest: path.resolve(__dirname, `../assets/img`),
				accessDest: 'img/'
			})

		} catch (err) {
			if (err instanceof BadFileTypeError || err instanceof FileTooLargeError) {
				await productModel.deleteProductByID(result.insertId)
				throw err;
			} else {
				// If there is any other error, we will ignore such error and use the default image.
				console.log(err)
			}

		}


		// Add image to the product if an image was uploaded
		if (downloadedFileURL !== null) {
			await productModel.updateImageURLByID(downloadedFileURL, result.insertId)
		}

		res.status(201).json({response: "Product created!"})

	} catch (err) {
		console.log(err)
		if (err instanceof BadFileTypeError) {
			res.status(err.code).json(err) // 415
		} else if (err instanceof FileTooLargeError) {
			res.status(err.code).json(err) // 413
		} else if (err instanceof ExistingProductError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 14: ADVANCED FEATURE] Update products (Admin)
router.put('/api/product/:productid', upload.single('image'), async(req, res) => {
	/**
	 * This endpoint edits a product given the same
	 * information as Endpoint 13.
	 */
	try {

		if (req.role !== 'Admin') {
			throw new UnauthorizedError("Only admins are allowed to edit products")
		}

		let productid = req.params.productid

		let {product_name, product_price, product_category, product_brand, product_desc} = req.body;

		// This variable contains the new URL of the image. The value stays as null
		// if no image is uploaded.
		let downloadedFileURL = null

		
		// Check if this productid belongs to an existing product
		let [allProductResult, allProductFields] = await productModel.getAllProducts()
		let allProductIds = (allProductResult.map(ele => {
			return parseInt(ele.productid)
		}))
		if (allProductIds.indexOf(parseInt(productid)) < 0) {
			throw new ProductNotFoundError(productid, "Unable to edit. Product does not exist.")
		}


		// Validating product name
		product_name = product_name.replace(/^\s+/gm, '').replace(/\s+$/gm, ''); // Left strip and right strip white spaces
		if (product_name.length == 0) {
			throw new BadRequestError('Product name is not valid.')
		}

		product_name = product_name.toUpperCase() // NOTE: All product names are full uppercase.


		// Add the product details
		try {
			let [result, fields] = await productModel.editProductByID(productid, product_name, product_desc, product_category, product_brand, product_price)
		} catch (err) {
			console.log(err)

			// Switch statement to check if the SQL error contains
			// information that can be relayed to the end user
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingProductError(product_name)
					
				case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
					throw new BadRequestError(`Price must be a number`)

				case 'ER_DATA_TOO_LONG':
					throw new DataTooLongError(`Text length is too long`)

				default:
					throw err
			}
		}

		// We handle the image and text inputs separately, handling the text inputs first.
		// This is to avoid the situation where a text input may be invalid, yet the image gets downloaded.
		try {
			// Get the mimetype if the file is valid
			let mimetype = await fileTools.validateFile(req.file);
	
			// Get location of the image if the image was successfully downloaded
			downloadedFileURL = await fileTools.downloadFile({
				file: req.file,
				name: `product_image_${Date.now()}`,
				ext: mimetype.ext,
				dest: path.join(__dirname, `../assets/img`),
				accessDest: 'img/'
			})
		} catch (err) {
			console.log(err)
			if (err instanceof BadFileTypeError || err instanceof FileTooLargeError) {
				throw err;
			}
			// If error is something else, we will use the default image
		}


		// Add image to the product if an image was uploaded. If there is no image
		// uploaded, the image URL stays the same.
		if (downloadedFileURL !== null) {

			let [urlResult, urlFields] = await productModel.getImageURLByID(productid)

			let oldFileURL = urlResult[0].imageURL
			if (oldFileURL.startsWith('img\\product_image')) {

				// Delete old image
				try {
					await fileTools.deleteImage(path.resolve(__dirname, '../assets'), oldFileURL)
				} catch (err) {
					console.log("Unable to delete old image.")
				}
			}

			// Update image URL
			await productModel.updateImageURLByID(downloadedFileURL, productid)
		}

		res.status(201).json({message: "Product edited!"})

	} catch (err) {
		console.log(err)
		if (err instanceof BadFileTypeError) {
			res.status(err.code).json(err) // 415
		} else if (err instanceof FileTooLargeError) {
			res.status(err.code).json(err) // 413
		} else if (err instanceof ExistingProductError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413
		} else if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 15: ADVANCED FEATURE] Delete products (Admin)
router.delete('/api/product/:productid', async(req, res) => {
	/**
	 * Given a productid, delete the image and database records
	 * of that productid if it exists. NOTE this endpoint
	 * is omnipotent
	 */
	try {

		// Only admins are authorized
		if (req.role !== 'Admin') {
			throw new UnauthorizedError('Only admins can delete products')
		}

		let {productid} = req.params;

		if (isNaN(parseInt(productid))) {
			throw new BadRequestError("Productid is not a valid number")
		}

		let [urlResult, urlFields] = await productModel.getImageURLByID(productid)

		let oldFileURL = urlResult[0].imageURL

		// All product images are named starting with product_image.
		// This prevents images such as the default product image from being deleted
		if (oldFileURL.startsWith('img\\product_image')) {
			await fileTools.deleteImage(path.resolve(__dirname, '../assets'), oldFileURL)
		}

		let [result, fields] = await productModel.deleteProductByID(productid);

		res.status(204).json();
	} catch (err) {
		console.log(err);
		if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({response: "Something went wrong"});
		}
	}
})

// [Endpoint 16: ADVANCED FEATURE] Get promotions of a product (Public, Customer, Admin)
router.get('/api/product/:productid/promotion', async(req, res) => {
	/**
	 * Get all promotions of a product, given the productid in parameters.
	 */
	try {
		let productid = req.params.productid

		if (isNaN(parseInt(productid))) {
			throw new BadRequestError('Productid must be an integer')
		}

		let [productCheck, productFields] = await productModel.getProductByID(productid)

		if (productCheck.length == 0 || productCheck[0].productid == null) {
			throw new ProductNotFoundError()
		}

		let [result, fields] = await promotionModel.getPromotionOfProduct(productid)

		// Handle null promotions
		if (result.length == 0 || result[0] == null) {
			throw new PromotionNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof PromotionNotFoundError) {
			res.status(err.code).json(err) // 404
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ProductNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

//=======================================
//	Interest-related endpoints
//=======================================

// [Endpoint 17] Get interests of user (Customer)
router.get('/api/interests', async(req, res) => {
	/**
	 * This endpoint returns the categories a customer
	 * is interested in
	 */
	try {

		// Only customers are authorized
		if (req.role !== 'Customer') {
			throw new UnauthorizedError('Only customers are allowed to have category interests')
		}

		let [result, fields] = await interestModel.getInterestOfUser(req.userid)

		// Check if result is empty
		if (result.length == 0) {
			throw new InterestNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof InterestNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 18] Add interests (Customer)
router.post('/api/interests/', async(req, res) => {
	/**
	 * This endpoint takes in a comma separated string of
	 * categoryids, and inserts them into the user's
	 * interests if the categoryid is not already inserted.
	 */
	try {

		// Only customers are authorized
		if (req.role !== 'Customer') {
			throw new UnauthorizedError("Only customers are allowed to add category interests")
		}

		let {categoryids} = req.body;

		let categoryid_array;

		// Validating the array of categoryids.
		try {
			categoryid_array = categoryids.split(',')

			// Check if the array is empty
			if (categoryid_array.length == 0) {
				throw new BadRequestError()
			}

			// Check if the array does not consist of numbers
			categoryid_array = categoryid_array.map(categoryid => {

				let integerCategoryId = parseInt(categoryid)
				if (isNaN(integerCategoryId)) {
					throw new BadRequestError()
				}

				return integerCategoryId
			})

		} catch (err) {
			console.log(err)
			throw new BadRequestError("Invalid categoryids format")
		}

		// Inserting categoryids into database. NOTE that the error thrown
		// from this statement is an array. More details of the function can be
		// found at /model/interest.js
		await interestModel.addInterestsToUser(req.userid, categoryid_array)
		res.status(201).json({message: "successfully added interests"})

	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else {
			try {

				// Check the error of the first insertion. If
				// err[0] is undefined, it may cause err[0].code to
				// throw an error. As such, we handle this using 
				// a try-catch statement
				if (err[0].code === 'ER_DUP_ENTRY') {
					res.status(422).json(err) // 422

				} else {
					res.status(500).json({response: "Something went wrong"})
				}
			} catch (err) {
				res.status(500).json({response: "Something went wrong"})
			}
		}
	}
})

// [Endpoint 19] Delete interests (Customer)
router.delete('/api/interests', async(req, res) => {
	/**
	 * Given a comma-separated string of categoryids, delete
	 * the respective categoryids from the user's interest if they exist.
	 * Note this is omnipotent
	 */

	try {
		// Only customers are authorized
		if (req.role !== 'Customer') {
			throw new UnauthorizedError("Only customers are allowed to delete category interests")
		}

		let {categoryids} = req.body;

		let categoryid_array;

		// Validating the array of categoryids.
		try {
			categoryid_array = categoryids.split(',')

			// Check if the array is empty
			if (categoryid_array.length == 0) {
				throw new BadRequestError()
			}

			// Check if the array does not consist of numbers
			categoryid_array = categoryid_array.map(categoryid => {

				let integerCategoryId = parseInt(categoryid)
				if (isNaN(integerCategoryId)) {
					throw new BadRequestError()
				}

				return integerCategoryId
			})

		} catch (err) {
			console.log(err)
			throw new BadRequestError("Invalid categoryids format")
		}

		// Inserting categoryids into database. NOTE that the error thrown
		// from this statement is an array. More details of the function can be
		// found at /model/interest.js
		await interestModel.deleteInterestOfUser(req.userid, categoryid_array)

		res.status(201).json({message: "successfully deleted interests"})
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else {
			try {

				// Check the error of the first insertion. If
				// err[0] is undefined, it may cause err[0].code to
				// throw an error. As such, we handle this using 
				// a try-catch statement
				if (err[0].code === 'ER_DUP_ENTRY') {
					res.status(422).json(err) // 422

				} else {
					res.status(500).json({response: "Something went wrong"})
				}
			} catch (err) {
				res.status(500).json({response: "Something went wrong"})
			}
		}
	}
})


//=======================================
//	Category-related endpoints
//====================================

// [Endpoint 20] Get category information (Public, Customer, Admin)
router.get('/api/category', async(req, res) => {
	/**
	 * This endpoint returns the categoryid, category name and description of all categories
	 */
	try {
		let [result, fields] = await categoryModel.getAllCategories();
		
		// Throw an error if no categories are found
		if (result.length == 0) {
			throw new CategoryNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof CategoryNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}

})

// [Endpoint 21] Add new category (Admin)
router.post('/api/category', upload.none(), async(req, res) => {
	/**
	 * This endpoint allows admins to add an category.
	 */
	try {
		
		// Only admins can create categories
		if (req.role !== "Admin") {
			throw new UnauthorizedError("Only admins can create categories")
		}

		let {category_name, category_description} = req.body;
		// Validating category name
		category_name = category_name.replace(/^\s+/gm, '').replace(/\s+$/gm, ''); // Left strip and right strip white spaces
		if (category_name.length == 0) {
			throw new BadRequestError('Category name is not valid.')
		}

		// Capitalise only the first letter, and the rest as lower case letters.
		category_name = category_name[0].toUpperCase() + (category_name.slice(1, category_name.length)).toLowerCase()


		// Add the category details
		try {
			await categoryModel.addCategory(category_name, category_description);
		} catch (err) {
			console.log(err)
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingCategoryError(category_name)

				case 'ER_DATA_TOO_LONG':
					throw new DataTooLongError("Category name or description is too long!")

				default:
					throw err
			}
		}

		res.status(201).json({message: "Category created!"})

	} catch (err) {
		console.log(err)
		if (err instanceof ExistingCategoryError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

//=======================================
//	Promotion-related endpoints
//=======================================

// [Endpoint 22: ADVANCED FEATURE] Create a promotion (Admin)
router.post('/api/promotion/', upload.none(), async(req, res) => {
	/**
	 * Create a promotion given
	 * 	<promotion_name>
	 * 		- Name of promotion
	 * 	<promotion_start>
	 * 		- Format: YYYY/MM/DD
	 * 	<promotion_end>
	 * 		- Format: YYYY/MM/DD
	 */
	try {
		
		if (req.role !== 'Admin') {
			throw new UnauthorizedError("Only admins can create promotions")
		}

		let {promotion_name, promotion_start, promotion_end} = req.body;

		// Validating promotion name
		promotion_name = promotion_name.replace(/^\s+/gm, '').replace(/\s+$/gm, ''); // Left strip and right strip white spaces
		if (promotion_name.length == 0) {
			throw new BadRequestError('Promotion name is not valid.')
		}

		// Validating dates
		let start_date = new Date(promotion_start)
		let end_date = new Date(promotion_end)

		if (end_date < start_date) {
			throw new BadRequestError('End date cannot be earlier than start date')
		}

		// Add the promotion details
		try {
			await promotionModel.addPromotion(promotion_name, promotion_start, promotion_end)
		} catch (err) {
			console.log(err)
			switch (err.code) {
				// Duplicate entry error
				case 'ER_DUP_ENTRY':
					throw new ExistingPromotionError(promotion_name)

				// Wrong format, e.g. string when expecting number
				case 'ER_TRUNCATED_WRONG_VALUE':
					throw new BadRequestError("The format for the dates are wrong")

				case 'ER_DATA_TOO_LONG':
					throw new DataTooLongError("The promotion name is too long!")

				default:
					throw err
			}
		}

		res.status(201).json({message: "Promotion created!"})

	} catch (err) {
		console.log(err)
		if (err instanceof ExistingPromotionError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 23: ADVANCED FEATURE] Get promotion information (Public, Customer, Admin)
router.get('/api/promotion', async(req, res) => {
	/**
	 * Get information on all existing promotions
	 */
	try {
		let [result, fields] = await promotionModel.getAllPromotions();

		// Throw error if no promotion is found for that product
		if (result.length == 0) {
			throw new PromotionNotFoundError()
		}

		res.status(200).json(result)

	} catch (err) {
		console.log(err)
		if (err instanceof PromotionNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 24: ADVANCED FEATURE] Update promotion (Admin)
router.put('/api/promotion/:promotionid', upload.none(), async(req, res) => {
	/**
	 * Update a promotion, given
	 * 
	 * > Parameters
	 * 	<promotionid>
	 * 		- Id of promotion
	 * 
	 * > Body
	 * 	<promotion_name>
	 * 		- Name of promotion
	 * 	<promotion_start>
	 * 		- Format: YYYY/MM/DD
	 * 	<promotion_end>
	 * 		- Format: YYYY/MM/DD
	 * 
	 */
	try {

		// Only admins are authorized
		if (req.role !== 'Admin') {
			throw new UnauthorizedError("Only admins can edit promotions")
		}

		let promotionid = req.params.promotionid

		
		let [allPromotionResult, allPromotionFields] = await promotionModel.getAllPromotions()

		// Check if this productid belongs to an existing product
		let allPromotionIds = (allPromotionResult.map(ele => {
			return parseInt(ele.promotionid)
		}))
		if (allPromotionIds.indexOf(parseInt(promotionid)) < 0) {
			throw new PromotionNotFoundError()
		}

		let {promotion_name, promotion_start, promotion_end} = req.body;

		if (!promotion_name) {
			promotion_name = ""
		}
		if (!promotion_start) {
			promotion_start = ""
		}
		if (!promotion_end) {
			promotion_end = ""
		}

		// Validating promotion name
		promotion_name = promotion_name.replace(/^\s+/gm, '').replace(/\s+$/gm, ''); // Left strip and right strip white spaces
		if (promotion_name.length == 0) {
			throw new BadRequestError('Promotion name is not valid.')
		}

		// Validating dates
		let start_date = new Date(promotion_start)
		let end_date = new Date(promotion_end)

		if (end_date < start_date) {
			throw new BadRequestError('End date cannot be earlier than start date')
		}

		// Add the promotion details
		try {
			await promotionModel.updatePromotionByID(promotionid, promotion_name, promotion_start, promotion_end)
		} catch (err) {
			console.log(err)
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingPromotionError(promotion_name)

				case 'ER_TRUNCATED_WRONG_VALUE':
					throw new BadRequestError("The format for the dates are wrong")

				case 'ER_DATA_TOO_LONG':
					throw new DataTooLongError("Promotion name is too long!")

				default:
					throw err
			}
		}

		res.status(204).json();

	} catch (err) {
		console.log(err)
		if (err instanceof ExistingPromotionError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof DataTooLongError) {
			res.status(err.code).json(err) // 413
		} else if (err instanceof PromotionNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 25: ADVANCED FEATURE] Delete promotion (Admin)
router.delete('/api/promotion/:promotionid', async(req, res) => {
	/**
	 * Given promotionid, delete that promotion.
	 * NOTE this endpoint is intended to be omnipotent
	 */
	try {

		// Only admins are authorized
		if (req.role !== 'Admin') {
			throw new UnauthorizedError("Only admins can delete promotions")
		}

		let promotionid = req.params.promotionid

		let [result, fields] = await promotionModel.deletePromotionByID(promotionid)

		res.status(204).json();
	} catch (err) {
		console.log(err);
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({response: "Something went wrong"});
		}
	}
})

//=======================================
//	Discount-related endpoints
//=======================================

/* 
	Discounts are the links that connect a product to
	a promotion/vice versa in a many-to-many relationship.

	This is because a product can have many promotions and
	a promotion can have many products.

	The columns of discounts are as such:

		discountid, productid(foreign key), promotionid(foreign key), discount_value

	where discount_value is a value between 0-100, representing how much the value should
	be discounted by. An example would be

		1, 2, 3, 25

	In this case, the product with id 2 has a promotion with promotionid 3. When that
	promotion goes live(the current date falls inbetween the start and end dates), that
	25% discount will be applied onto the product with id 2.

*/

// [Endpoint 26: ADVANCED FEATURE] Get information on discounts (Public, Customer, Admin)
router.get('/api/discount', async(req, res) => {
	/**
	 * This endpoint returns information on all discounts
	 */
	try {
		let [result, fields] = await promotionModel.getAllDiscounts();

		// Check if there are any discounts
		if (result.length == 0) {
			throw new DiscountNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof DiscountNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json("Something went wrong")
		}
	}
})

// [Endpoint 27: ADVANCED FEATURE] Delete a discount (Admin)
router.delete('/api/discount', async(req, res) => {
	/**
	 * Given the productid and promotionid, we delete
	 * the discount that links the two together. NOTE
	 * this endpoint is omnipotent.
	 * 
	 * This can be done as both productid and promotionid combined
	 * MUST be unique, according to the database structure.
	 */
	try {
		
		if (req.role !== 'Admin') {
			throw new UnauthorizedError("Only admins can delete discounts")
		}

		let {productid, promotionid} = req.body;

		await promotionModel.removeDiscountOfProduct(productid, promotionid)

		res.status(204).json()
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 28: ADVANCED FEATURE] Add a discount (Admin)
router.post('/api/discount', upload.none(), async(req, res) => {
	/**
	 * Create a discount, given:
	 * 	<productid>
	 * 		- Id of product
	 * 	<promotionid>
	 * 		- Promotion of product
	 * 	<discount_value>
	 * 		- Percent of discount, taking values between 0-100.
	 * 		  For instance, 25 here would indicate that product
	 * 		  receives 25% off when the promotion goes live.
	 */
	try {

		// Only admins are authorized
		if (req.role !== 'Admin') {
			throw new UnauthorizedError("Only admins can add discounts")
		}

		let {productid, promotionid, discount_value} = req.body;

		// Validating discount value
		if (isNaN(parseInt(discount_value))) {
			throw new BadRequestError("Bad discount value")
		}

		if (parseInt(discount_value) > 100 || parseInt(discount_value) < 0) {
			throw new BadRequestError("Discount value falls outside of the acceptable range")
		}

		// NESTED try-catch to handle SQL errors
		try {
			await promotionModel.addDiscountToProduct(promotionid, productid, discount_value)
		} catch (err) {
			console.log(err);
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingDiscountError()

				default:
					throw new BadRequestError("Invalid format");
			}
		}
		res.status(204).json();
	} catch (err) {
		console.log(err)
		if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ExistingDiscountError) {
			res.status(err.code).json(err) // 422
		} else if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})


//=======================================
//	Payment-related endpoints
//=======================================

/*
	A user can have many payment methods in a one-to-many relationship
*/

// [Endpoint 29: ADVANCED FEATURE] Get payment methods of user (Customer)
router.get('/api/payments', async(req, res) => {
	/**
	 * This endpoint returns information on all payment methods
	 * of the currently logged-in user.
	 */
	try {

		// Only customers are authorized
		if (req.role !== 'Customer') {
			throw new UnauthorizedError("Only customers can have payment methods")
		}

		let [result, fields] = await paymentModel.getPaymentIdsOfUser(req.userid)

		if (result.length == 0) {
			throw new PaymentNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err);
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof PaymentNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 30: ADVANCED FEATURE] Get payment details (Customer, Admin)
router.get('/api/payment/:paymentid', async(req, res) => {
	/**
	 * Given a paymentid, return information of that payment id
	 */
	try {

		let paymentid = req.params.paymentid

		if (isNaN(parseInt(paymentid))) {
			throw new BadRequestError("Payment id is in an invalid format")
		}

		// Public cannot interact with payment methods
		if (req.role === 'Public') {
			throw new UnauthorizedError("Public user cannot have interact with payment methods")

		// Customers are only allowed to view payment methods that are from them
		} else if (req.role === 'Customer') {
			
			// We get all payment ids of that Customer
			let [paymentResult, fields] = await paymentModel.getPaymentIdsOfUser(req.userid)
	
			// Using set for more efficient checking
			let validPaymentIds = new Set(paymentResult.map((payment_info) => {
				return payment_info.paymentid
			}))
	
			// Throw an error if Customer is attempting to view payment details of another person
			if (!(validPaymentIds.has(parseInt(paymentid)))) {
				throw new UnauthorizedError("Cannot view another person's payment details")
			}
		}
		// Admins can view any paymentid

		// NOTE we use the Clean model function. This is because there is no need for admins or customers to
		// view sensitive information such as the full credit card number or the CVV. The last four digits proves
		// to be identifiable.
		let [result, fields] = await paymentModel.getPaymentDetailsByIdClean(paymentid);

		if (result.length == 0) {
			throw new PaymentNotFoundError()
		}

		res.status(200).json(result)
		
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 401
		} else if (err instanceof PaymentNotFoundError) {
			res.status(err.code).json(err) // 404
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 31: ADVANCED FEATURE] Add a payment method (Customer)
router.post('/api/payment', upload.none(), async(req, res) => {
	/**
	 * Add a payment method given:
	 * 	<card_number>
	 * 		- Credit/Debit card number
	 *	<cvv>
	 *		- Security number
	 * 	<card_name>
	 * 		- The name on the card
	 * 	<card_expiration>
	 * 		- Expiry date of card. Format: YYYY/MM
	 */
	try {

		// Only customers are authorized
		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can add payment methods")
		}

		let {card_number, cvv, card_name, card_expiration} = req.body;

		// Card validation
		cardValid.validateCard(card_number, cvv, card_expiration)

		// As we accept only months, we need to append such that the format
		// is valid for MySQL
		card_expiration = card_expiration + '/01'

		try {
			let [result, fields] = await paymentModel.addPaymentMethod(req.userid, card_number, cvv, card_name, card_expiration)
		} catch (err) {
			console.log(err)
			switch (err.code) {

				// User already has an existing card added
				case 'ER_DUP_ENTRY':
					throw new ExistingCardForUserError()

				case 'ER_TRUNCATED_WRONG_VALUE':
					throw new BadRequestError("Invalid format")

				default:
					throw new BadRequestError("Invalid format")
			}
		}

		res.status(201).json({message: "Payment method created"})
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ExistingCardForUserError) {
			res.status(err.code).json(err) // 422
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 32: ADVANCED FEATURE] Update a payment method (Customer)
router.put('/api/payment/:paymentid', upload.none(), async(req, res) => {
	/**
	 * Update a payment method given
	 * 
	 * > Parameter
	 * 	<paymentid>
	 * 		- Id of payment method
	 * 
	 * > Body
	 * 	<card_number>
	 * 		- Credit/Debit card number
	 *	<cvv>
	 *		- Security number
	 * 	<card_name>
	 * 		- The name on the card
	 * 	<card_expiration>
	 * 		- Expiry date of card. Format: YYYY/MM
	 */
	try {

		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can update payment methods")
		}

		let paymentid = req.params.paymentid

		if (isNaN(parseInt(paymentid))) {
			throw new BadRequestError("Payment id is in an invalid format")
		}

		let {card_number, cvv, card_name, card_expiration} = req.body;

		// Users are only allowed to update their own paymentid
		let [paymentResult, fields] = await paymentModel.getPaymentIdsOfUser(req.userid)

		// Using set for more efficient checking
		let validPaymentIds = new Set(paymentResult.map((payment_info) => {
			return payment_info.paymentid
		}))

		if (!(validPaymentIds.has(parseInt(paymentid)))) {
			throw new UnauthorizedError("User cannot update another person's payment details")
		}


		// NOTE here, we do not use the Clean version of getPaymentDetailsById, as we need to keep the same full card number
		// if the user decides not to update it
		let [oldPaymentDetails, oldPaymentFields] = await paymentModel.getPaymentDetailsById(paymentid)
		
		oldPaymentDetails = oldPaymentDetails[0]

		// If card number is 12 digit asterisk and the last four digits are from the old card,
		// we continue to use this old card
		if (card_number == `****************${oldPaymentDetails.last_card_digits}`) {
			card_number = oldPaymentDetails.card_number
		}
		
		// If CVV is all asterisk, we continue to use the old card detail. 
		if (cvv === '***') {
			cvv = oldPaymentDetails.cvv
		}

		
		// Validate card
		cardValid.validateCard(card_number, cvv, card_expiration)
		
		card_expiration = card_expiration + '/01'

		try {
			let [result, fields] = await paymentModel.updatePaymentDetailsById(paymentid, card_number, card_name, card_expiration, cvv)
		} catch (err) {
			console.log(err)
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingCardForUserError()

				case 'ER_TRUNCATED_WRONG_VALUE':
					throw new BadRequestError("Invalid format")

				default:
					throw new BadRequestError("Invalid format")
			}
		}

		res.status(204).json()
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ExistingCardForUserError) {
			res.status(err.code).json(err) // 422
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 33: ADVANCED FEATURE] Delete a payment method (Customer)
router.delete('/api/payment/:paymentid', upload.none(), async(req, res) => {
	/**
	 * Given paymentid, delete the payment method
	 * if it exists. NOTE this endpoint is omnipotent.
	 */
	try {

		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can delete their payment methods")
		}

		let paymentid = req.params.paymentid

		if (isNaN(parseInt(paymentid))) {
			throw new BadRequestError("Payment id is in an incorrect format")
		}

		// Users are only allowed to delete their own paymentid
		let [paymentResult, paymentFields] = await paymentModel.getPaymentIdsOfUser(req.userid)

		let validPaymentIds = new Set(paymentResult.map((payment_info) => {
			return payment_info.paymentid
		}))

		if (!(validPaymentIds.has(parseInt(paymentid)))) {
			throw new UnauthorizedError("User cannot delete another person's payment details")
		}

		let [result, fields] = await paymentModel.deletePaymentById(paymentid)

		res.status(204).json();
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

//=======================================
//	Address-related endpoints
//=======================================

/*
	A user can have many address methods in a one-to-many relationship
*/

// [Endpoint 34: ADVANCED FEATURE] Get addresses of user (Customer)
router.get('/api/addresses', async(req, res) => {
	/**
	 * Get basic information of all addresses a user has
	 */
	try {

		if (req.role !== 'Customer') {
			throw new UnauthorizedError("Only customers can have addresses")
		}

		let [result, fields] = await addressModel.getAddressIdsOfUser(req.userid)

		if (result.length == 0) {
			throw new AddressNotFoundError()
		}

		res.status(200).json(result)
	} catch (err) {
		console.log(err);
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof AddressNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 35: ADVANCED FEATURE] Get address details (Customer, Admin)
router.get('/api/address/:addressid', async(req, res) => {
	/**
	 * This endpoint returns detailed information of an address
	 * given the addressid
	 */
	try {

		let addressid = req.params.addressid

		// Public users cannot view addresses
		if (req.role === 'Public') {
			throw new UnauthorizedError("Public user cannot have interact with addresses")

		// Customers cannot view another customer's address
		} else if (req.role === 'Customer') {
			
			// Check if the address id belongs to the customer
			let [addressResult, fields] = await addressModel.getAddressIdsOfUser(req.userid)

			if (addressResult.length == 0) {
				throw new AddressNotFoundError()
			}
	
			let validAddressIds = new Set(addressResult.map((address_info) => {
				return address_info.addressid
			}))
	
			if (!(validAddressIds.has(parseInt(addressid)))) {
				throw new UnauthorizedError("Cannot view another person's address")
			}
		}
		// Admins can view any customer's address

		let [result, fields] = await addressModel.getAddressById(addressid)

		if (result.length == 0) {
			throw new AddressNotFoundError()
		}

		res.status(200).json(result)
		
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof AddressNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 36: ADVANCED FEATURE] Create address (Customer)
router.post('/api/address', upload.none(), async(req, res) => {
	/**
	 * Create an address for the logged-in customer, given
	 * 	<address_name>
	 * 		- Name of the receiver/person who lives at the address
	 * 	<address>
	 * 		- Address detail itself. No format.
	 * 	<postal_code>
	 * 		- A six-digit number
	 */
	try {

		// Only customers are authorized
		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can add addresses")
		}

		let {address_name, address, postal_code} = req.body;

		addressValid.validatePostalCode(postal_code)

		// NESTED try-catch to handle MySQL errors
		try {
			let [result, fields] = await addressModel.createAddress(req.userid, address, address_name, postal_code)
		} catch (err) {
			console.log(err)
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingAddressForUserError()

				case 'ER_TRUNCATED_WRONG_VALUE':
					throw new BadRequestError("Invalid format")

				default:
					throw new BadRequestError("Invalid format")
			}
		}

		res.status(201).json({message: "Address created"})
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ExistingAddressForUserError) {
			res.status(err.code).json(err) // 422
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 37: ADVANCED FEATURE] Update an address (Customer)
router.put('/api/address/:addressid', upload.none(), async(req, res) => {
	/**
	 * Update an address given information similar to
	 * to [Endpoint 36]
	 */
	try {

		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can update addresses")
		}

		let addressid = req.params.addressid

		let {address_name, address, postal_code} = req.body;

		// Users are only allowed to update their own paymentid
		let [addressResult, fields] = await addressModel.getAddressIdsOfUser(req.userid)

		let validAddressIds = new Set(addressResult.map((address_info) => {
			return address_info.addressid
		}))

		if (!(validAddressIds.has(parseInt(addressid)))) {
			throw new UnauthorizedError("User cannot update another person's address details")
		}


		let [oldAddressDetails, oldAddressFields] = await addressModel.getAddressById(addressid)
		
		oldAddressDetails = oldAddressDetails[0]

		addressValid.validatePostalCode(postal_code)
		
		// NESTED try-catch to handle MySQL errors
		try {
			let [result, fields] = await addressModel.updateAddressById(addressid, address, address_name, postal_code)
		} catch (err) {
			console.log(err)
			switch (err.code) {
				case 'ER_DUP_ENTRY':
					throw new ExistingAddressForUserError()

				case 'ER_TRUNCATED_WRONG_VALUE':
					throw new BadRequestError("Invalid format")

				default:
					throw new BadRequestError("Invalid format")
			}
		}

		res.status(204).json()
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof ExistingAddressForUserError) {
			res.status(err.code).json(err) // 422
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 38: ADVANCED FEATURE] Delete address (Customer)
router.delete('/api/address/:addressid', upload.none(), async(req, res) => {
	/**
	 * Given addressid, delete the address associated with it if it exists.
	 * NOTE: this endpoint is omnipotent.
	 */
	try {

		let addressid = req.params.addressid

		// Only customers can delete addresses
		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers can delete their addresses")
		}

		// Users are only allowed to update their own paymentid
		let [addressResult, addressFields] = await addressModel.getAddressIdsOfUser(req.userid)

		let validAddressIds = new Set(addressResult.map((address_info) => {
			return address_info.addressid
		}))

		if (!(validAddressIds.has(parseInt(addressid)))) {
			throw new UnauthorizedError("User cannot delete another person's address")
		}

		let [result, fields] = await addressModel.deleteAddressById(addressid)

		res.status(204).json();
	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})


//=======================================
//	Order-related endpoints
//=======================================

// [Endpoint 39: ADVANCED FEATURE] Create order (Customer)
router.post('/api/order/', async(req, res) => {
	/**
	 * Create an order given:
	 * 	<paymentid>
	 * 		- Id of the payment method
	 * 	<addressid>
	 * 		- Id of the address
	 * 	<cart>
	 * 		- String containing cart information
	 *  <total>
	 * 		- The total amount paid for the items
	 */
	try {
		let {paymentid, addressid, cart, total} = req.body;

		// Only customers are authorized to order
		if (req.role !== "Customer") {
			throw new UnauthorizedError("Only customers are allowed to order")
		}

		let product_cart_dictionary = {} // This object contains productid as keys and quantity as value

		// Validating cart
		try {
			let split_array = cart.split(',')
			split_array.forEach(keypair => {
				let key_value_array = keypair.split('=')
				if (key_value_array.length == 2) {
	
					let product_id = parseInt(key_value_array[0])
					let product_count = parseInt(key_value_array[1])
	
					if (!(isNaN(product_id) || isNaN(product_count))) {
						if (product_count != 0) {
							product_cart_dictionary[product_id] = product_count
						}
					}
				}
			})
		} catch (err) {
			console.log(err);
			throw new InvalidCartError()
		}


		// Check the both the paymentid and addressid belong to the user. This is such that
		// customers cannot use another customer's payment method for their order.
		let [paymentids, paymentfields] = await paymentModel.getPaymentIdsOfUser(req.userid)
		paymentids = paymentids.map(ele => {
			return ele.paymentid
		})

		let [addressids, addressfields] = await addressModel.getAddressIdsOfUser(req.userid)
		addressids = addressids.map(ele => {
			return ele.addressid
		})
		
		if (paymentids.indexOf(parseInt(paymentid)) > -1 && addressids.indexOf(parseInt(addressid)) > -1) {
			// Once we know that both paymentid and addressid belong to the same customer, we can
			// create an order.

			let [paymentResult, paymentFields] = await paymentModel.getPaymentDetailsById(paymentid)

			paymentResult = paymentResult[0]

			let [addressResult, addressFields] = await addressModel.getAddressById(addressid)
			addressResult = addressResult[0]

			let [orderResult, orderFields] = await orderModel.createOrder(req.userid, paymentResult.card_number, paymentResult.cvv, paymentResult.card_name, paymentResult.card_expiration, addressResult.address, addressResult.name, addressResult.postal_code, total);

			// Keep track of products for an order
			(Object.keys(product_cart_dictionary)).forEach(async(productid) => {
				await orderModel.purchaseItem(orderResult.insertId, productid, product_cart_dictionary[productid] )
			})

			res.status(201).json({message: `Order #${orderResult.insertId} created!`, orderid: orderResult.insertId})
		} else {
			throw new UnauthorizedError("Cannot use another user's payment details/address")
		}

	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err) // 403
		} else if (err instanceof InvalidCartError) {
			res.status(err.code).json(err) // 400
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

// [Endpoint 40: ADVANCED FEATURE] Get order history (Customer)
router.get('/api/orders', async(req, res) => {
	/**
	 * Return information of user's order history
	 */
	try {
		if (req.role !== 'Customer') {
			throw new UnauthorizedError('Only customers have an order history')
		}

		let [result, fields] = await orderModel.getOrdersOfUser(req.userid)

		if (result.length == 0) {
			throw new OrderHistoryNotFoundError(req.userid);
		}

		res.status(200).json(result)

	} catch (err) {
		console.log(err)
		if (err instanceof UnauthorizedError) {
			res.status(err.code).json(err)
		} else if (err instanceof OrderHistoryNotFoundError) {
			res.status(err.code).json(err)
		} else {
			res.status(500).json({message: "Something went wrong"})
		}
	}
})

// [Endpoint 41: ADVANCED FEATURE] Get purchased items of an order (Public, Customer, Admin)
router.get('/api/order/:orderid', async(req, res) => {
	/**
	 * Get the list of items bought, from an order. This does not contain any sensitive information, and thus all roles, Public, Customer and Admin
	 * have the permission to view this.
	 */
	try {
		let {orderid} = req.params;

		if (isNaN(parseInt(orderid))) {
			console.log(isNaN(parseInt(orderid)))
			throw new BadRequestError("Order id is invalid")
		}

		let [result, fields] = await orderModel.getPurchasesByOrderId(orderid)

		if (result.length == 0) {
			throw new OrderNotFoundError(orderid)
		}
		
		res.status(200).json(result)
	} catch (err) {
		console.log(err)
		if (err instanceof BadRequestError) {
			res.status(err.code).json(err) // 400
		} else if (err instanceof OrderNotFoundError) {
			res.status(err.code).json(err) // 404
		} else {
			res.status(500).json({response: "Something went wrong"})
		}
	}
})

router.all('*', (req, res) => {
	res.status(404).end("Error 404. Page Not Found")
})

module.exports = {router}