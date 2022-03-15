//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class PaymentNotFoundError extends Error {
	constructor() {
		super(`Payment method could not be found`);
		this.name = this.constructor.name;
		this.response = "Payment method not found"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = PaymentNotFoundError;