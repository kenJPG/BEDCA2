//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ImageNotFoundError extends Error {
	constructor(productid) {
		super(`Product ${productid} image not found`);
		this.name = this.constructor.name;
		this.response = "No image found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ImageNotFoundError;