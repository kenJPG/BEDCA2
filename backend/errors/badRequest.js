//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class BadRequestError extends Error {
	constructor(response = "Bad request.") {
		super(`There was a bad request from client`);
		this.name = this.constructor.name;
		this.response = response
		this.code = 400
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = BadRequestError;