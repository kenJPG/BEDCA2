//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ReviewsNotFoundError extends Error {
	constructor(productid) {
		super(`No reviews found for product with productid: ${productid}`);
		this.name = this.constructor.name;
		this.response = "No reviews found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ReviewsNotFoundError;