//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingProductError extends Error {
	constructor(name) {
		super(`Cannot create duplicate product with name: ${name}`);
		this.name = this.constructor.name;
		this.response = "A product with the same name already exists"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingProductError;