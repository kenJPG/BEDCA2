//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class BrandNotFoundError extends Error {
	constructor() {
		super(`Brand could not be found`);
		this.name = this.constructor.name;
		this.response = "Brand not found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = BrandNotFoundError;