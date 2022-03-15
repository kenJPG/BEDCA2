//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingReviewError extends Error {
	constructor() {
		super(`User has already posted a review on this product`);
		this.name = this.constructor.name;
		this.response = "You can only post one review!"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingReviewError;