//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class BadFileTypeError extends Error {
	constructor() {
		super(`Admin uploaded an image that is not allowed`)
		this.name = this.constructor.name;
		this.response = "Only png/jpg/jpeg files are allowed."
		this.code = 415
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = BadFileTypeError;