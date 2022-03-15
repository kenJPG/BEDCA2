//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

const alertIncorrectPassword = function() {
	$("#loginMessage").text("Incorrect Username or Password")
	setTimeout(() => {
		$("#loginMessage").text("")
	}, 2000);
}

$('#login_form').submit(event => {
	/**
	 * Event listener for login form.
	 */
	event.preventDefault()
	let username = $('#username').val()
	let password = $('#password').val()

	// Axios request to login the user.
	axios({
		method: 'post',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/login',
		data: {
			username,
			password
		}
	}).then(response => {

		// We are returned token and role, which we will store in the localstorage
		// and reload the page
		localStorage.setItem('authtoken', response.data.token)
		localStorage.setItem('role', response.data.role)
		location.reload(true)
	}).catch(err => {
		// console.log(err)
		if (err.response.data) {
			switch (err.response.status) {
				case 401:
					// console.log("Incorrect Username or Password")
					alertIncorrectPassword()
					break

				default:
					bootstrapAlert(err.response.data.response, "alert-danger")
					break
			}
		}
	})
})

async function init() {
	/**
	 * Initialise
	 */
	await validateToken()
}

init()

if (localStorage.getItem('role') != "Public") {
	$(location).attr('href', '/')
}