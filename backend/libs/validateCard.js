/*
=======================
This file contains functions that are related to
validating card details

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/

const BadRequestError = require('../errors/badRequest.js')

const valid = require('card-validator') // This module is used to check card validity using Luhn's algorithm.


function validateExpiration(card_expiration) {
	/**
	 * This function validates the card expiration date.
	 * 
	 * Format of expiration date: YYYY/MM
	 */
	let validDate = false;

	// Checking expiration date format
	if (card_expiration.split('/').length != 2) {
		throw new BadRequestError("Invalid expiration date format")
	}

	let expireYear = parseInt(card_expiration.split('/')[0]);
	let expireMonth = parseInt(card_expiration.split('/')[1]);
	
	// Checking if the expiration date is incorrect, e.g. negative numbers/not a number
	if (isNaN(expireYear) || isNaN(expireMonth) || expireMonth <= 0 || expireMonth >= 13) {
		throw new BadRequestError("Invalid expiration date")
	}


	// Check if the expiration date has passed
	try {
		let timeNow = Date.now()
		let timeExpiration = (new Date(card_expiration)).getTime()
		if (timeNow > timeExpiration) {
			throw new BadRequestError("Card expiration date has passed")
		}
	} catch (err) {

		if (err instanceof BadRequestError) {
			// Throw the "card expiration date has passed error from the try statement above"
			throw err
		} else {
			// Separate error if there is anything else that went wrong.
			throw new BadRequestError("Invalid expiration date")
		}
	}

	return true
}

function validateCVV(cvv) {
	/**
	 * This function checks for a valid cvv.
	 */
	cvv = cvv.toString()

	// Using regex to match a valid CVV. NOTE, we are not
	// using parseInt to check whetehr cvv is valid. This is because
	// CVVs can have leading 0's
	let cvvRegex = /^[0-9]{3,4}$/
	if (cvv == cvv.match(cvvRegex)) {
		return true
	} else {
		throw new BadRequestError("Invalid CVV")
	}
}

function validateCard(card_number, cvv, card_expiration) {
	/**
	 * This function utilises the other two functions, checking
	 * all details of the card.
	 */

	let numberValidation = valid.number(card_number)

	validateExpiration(card_expiration)

	validateCVV(cvv)
	
	if (!numberValidation.isValid) {
		throw new BadRequestError('Card number is invalid')
	}
}

module.exports = {validateCard}