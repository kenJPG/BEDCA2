//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingDiscountError extends Error {
	constructor() {
		super(`The product already has this promotion as a discount`)
		this.name = this.constructor.name;
		this.response = "The product already has this promotion as a discount"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingDiscountError;