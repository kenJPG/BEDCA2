/*
=======================
This file contains functions that are related to
validating postal code

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const BadRequestError = require('../errors/badRequest.js')

function validatePostalCode(postal_code) {
	/**
	 * This function validates the postal code. An error is
	 * thrown if there is anything wrong with it.
	 */
	try {
		if (((postal_code).toString()).length != 6) {
			throw new BadRequestError("Postal code format is incorrect")
		}
		if (isNaN(parseInt(postal_code))) {
			throw new BadRequestError("Postal code format is incorrect")
		}
	} catch (err) { 
		console.log(err)
		throw new BadRequestError("Invalid format for postal code")
	}
}

module.exports = {validatePostalCode}