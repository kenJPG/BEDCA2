//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class InvalidTokenError extends Error {
	constructor() {
		super(`Invalid Token from user`);
		this.name = this.constructor.name;
		this.response = "Token is invalid, please refresh the page"
		this.code = 401
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = InvalidTokenError;