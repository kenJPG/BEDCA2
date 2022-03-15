//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ProductNotFoundError extends Error {
	constructor(productid, response = "No results") {
		super(`Product with productid: ${productid}`);
		this.name = this.constructor.name;
		this.response = response
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ProductNotFoundError;