//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class DataTooLongError extends Error {
	constructor(response = "Too much data! Please reduce the amount of text.") {
		super(`Too much data`);
		this.name = this.constructor.name;
		this.response = response
		this.code = 413
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = DataTooLongError;