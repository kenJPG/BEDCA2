//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class OrderHistoryNotFoundError extends Error {
	constructor(userid) {
		super(`No order history for this user ${userid}`);
		this.name = this.constructor.name;
		this.response = "You have no order history"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = OrderHistoryNotFoundError;