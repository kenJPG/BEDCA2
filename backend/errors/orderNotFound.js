//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================
class OrderNotFoundError extends Error {
	constructor(orderid) {
		super(`Requested order id ${orderid} not found`);
		this.name = this.constructor.name;
		this.response = "That order does not exist"
		this.code = 404
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = OrderNotFoundError;