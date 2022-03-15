//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingAddressForUserError extends Error {
	constructor(userid) {
		super(`Userid ${userid} already has an existing same address`);
		this.name = this.constructor.name;
		this.response = "You already have this address added"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingAddressForUserError;