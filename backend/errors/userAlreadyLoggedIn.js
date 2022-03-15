//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class UserAlreadyLoggedInError extends Error {
	constructor(userid) {
		super(`Log in attempt after logging in by userid ${userid}`)
		this.name = this.constructor.name
		this.response = "You are already logged in. Please logout before trying again."
		this.code = 403

		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = UserAlreadyLoggedInError