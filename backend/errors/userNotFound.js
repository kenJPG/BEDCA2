//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class UserNotFoundError extends Error {
	constructor(Userid) {
		super(`User with Userid: ${Userid}`);
		this.name = this.constructor.name;
		this.response = "No results"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = UserNotFoundError;