//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class AddressNotFoundError extends Error {
	constructor() {
		super(`Addresse could not be found`);
		this.name = this.constructor.name;
		this.response = "Address not found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = AddressNotFoundError;