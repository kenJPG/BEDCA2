//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================


/*
	Given `username` and `password` in req.body, verify that the
	login details are correct.
*/

const userModel = require('../model/user.js');

// Custom Error Types
const InvalidUserCredsError = require('../errors/invalidUserCreds.js')
const UserAlreadyLoggedInError = require('../errors/userAlreadyLoggedIn.js')

async function verifyLoginMiddleware(req, res, next) {
	try {

		console.log(`[verifyLoginMiddleware.js] The role from authtoken is ${req.role}`)

		// Only public is allowed to login
		if (req.role !== 'Public') {
			throw new UserAlreadyLoggedInError(req.userid)
		}

		console.log('[verifyLoginMiddleware.js] Verifying login credentials...')
		let [result, fields] = await userModel.loginUser(req.body.username, req.body.password) // userid and role is returned from the login information

		if (result.length == 0) {
			throw new InvalidUserCredsError(req.body.username)
		}

		req.userid = result[0].userid
		req.role = result[0].role

		console.log('[verifyLoginMiddleware.js] The login credentials entered are valid!')

		next()
	} catch (err) {
		console.log(err)
		if (err instanceof InvalidUserCredsError) {
			res.status(err.code).json(err) // 401
		} else if (err instanceof UserAlreadyLoggedInError) {
			res.status(err.code).json(err) // 403
		} else {
			res.status(500).json({message: "Something went wrong.", code: 500})
		}
	}
}

module.exports = verifyLoginMiddleware