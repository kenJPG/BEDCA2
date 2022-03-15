//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class ExistingCardForUserError extends Error {
	constructor(card, userid) {
		super(`Userid ${userid} already has a payment method with this card`);
		this.name = this.constructor.name;
		this.response = "You already have this card added"
		this.code = 422
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = ExistingCardForUserError;