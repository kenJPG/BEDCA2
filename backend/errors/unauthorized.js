//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class UnauthorizedError extends Error {
	constructor(action = "unspecified") {
		super(`Unauthorized action <${action}>`)
		this.name = this.constructor.name
		this.response = `Not authorized. ${action}`
		this.code = 403

		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = UnauthorizedError