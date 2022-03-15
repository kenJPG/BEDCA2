//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class FileTooLargeError extends Error {
	constructor(filesize) {
		super(`Admin uploaded an image that is too large. Filesize: ${filesize} bytes`)
		this.name = this.constructor.name;
		this.response = "That file size is too large. Only less than 1MB is permitted."
		this.code = 413
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = FileTooLargeError;