//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

/*
	Retrieve the Bearer token from Authorization Header and check if the token is valid.
	If the token is valid, return the role of that token. If the token is empty(user is a public user),
	return "Public" as role.
*/

const InvalidTokenError = require('../errors/invalidToken.js')

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRETKEY

async function verifyToken(req, res, next) {
	try {

		let token = req.headers.authorization || "Bearer "; // Handle empty or undefined tokens. This is important when a client first loads the page

		// If token doesn't start with bearer, the token is invalid.
		if (!token.startsWith("Bearer")) {
			throw new InvalidTokenError()
		} else {

			// Both replace statements are needed. This is because when user passes "Bearer ",
			// the white space at the end is ignored, and this middleware receives "Bearer".
			token = token.replace("Bearer ", "").replace("Bearer", "")

			if (token.length == 0) {
				req.role = "Public"
				next()
			} else {

				// Try-catch wrapped around the jwt.verify, ready to throw InvalidTokenError
				// if there is any problem with verify. 
				try {
					let decodedToken = jwt.verify(token, JWT_SECRET, {algorithm: "HS256"});
					req.userid = decodedToken.userid
					req.role = decodedToken.role
	
				} catch (err) {
					console.log(err) // Returns specific information about the jwt error
					throw new InvalidTokenError()
				}

				next()
			}
		}
	} catch (err) {
		console.log(err)
		if (err instanceof InvalidTokenError) {
			res.status(err.code).json(err) // 401 error
		} else {
			res.status(500).json({message: "Something went wrong."})
		}
	}
}

module.exports = verifyToken