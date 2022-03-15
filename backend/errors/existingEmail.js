//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingEmailError extends Error {
	constructor(email) {
		super(`Cannot register with existing email: ${email}`);
		this.name = this.constructor.name;
		this.response = "This email has already been registered"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingEmailError;