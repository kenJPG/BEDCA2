//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingCategoryError extends Error {
	constructor(category_name) {
		super(`Category ${category_name}`);
		this.name = this.constructor.name;
		this.response = `This category name ${category_name} already exists`
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingCategoryError;