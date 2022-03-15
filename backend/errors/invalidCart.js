//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class InvalidCartError extends Error {
	constructor() {
		super(`Invalid cart from user`);
		this.name = this.constructor.name;
		this.response = "Cart is in an invalid format"
		this.code = 400
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = InvalidCartError;