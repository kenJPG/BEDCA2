//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class PromotionNotFoundError extends Error {
	constructor() {
		super(`Promotion could not be found`);
		this.name = this.constructor.name;
		this.response = "Promotion not found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = PromotionNotFoundError;