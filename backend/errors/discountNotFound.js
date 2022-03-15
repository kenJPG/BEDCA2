//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class DiscountNotFoundError extends Error {
	constructor() {
		super(`The product does not have any discount could not be found`);
		this.name = this.constructor.name;
		this.response = "Discounts not found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = DiscountNotFoundError;