//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class InvalidUserCredsError extends Error {
	constructor(username) {
		super(`Invalid login attempt by username ${username}`)
		this.name = this.constructor.name
		this.response = "Username or password is incorrect"
		this.code = 401

		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = InvalidUserCredsError