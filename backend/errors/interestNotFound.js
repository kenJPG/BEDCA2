//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class InterestNotFoundError extends Error {
	constructor() {
		super(`No interests could not be found`);
		this.name = this.constructor.name;
		this.response = "No interests found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = InterestNotFoundError;