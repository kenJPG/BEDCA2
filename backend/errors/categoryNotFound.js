//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class CategoryNotFoundError extends Error {
	constructor() {
		super(`No categories were found`);
		this.name = this.constructor.name;
		this.response = "No categories found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = CategoryNotFoundError;