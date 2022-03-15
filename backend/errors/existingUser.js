//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingUserError extends Error {
	constructor(username) {
		super(`Cannot register with existing username: ${username}`);
		this.name = this.constructor.name;
		this.response = "This username already exists"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingUserError;