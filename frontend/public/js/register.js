//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

const alertExisting = function(existingItem) {
	$("#registerMessage").text(`That ${existingItem} already exists. Please use another`)
	setTimeout(() => {
		$("#registerMessage").text("")
	}, 4000);
}


$('#register_form').submit(event => {
	event.preventDefault()

	let username = $('#username').val()
	let email = $('#email').val()
	let contact = $('#contact').val()
	let password = $('#password').val()
	let profile_pic_url = $('#profile_pic_url').val()

	axios({
		method: 'post',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/register',
		data: {
			username,
			email,
			contact,
			password,
			profile_pic_url
		}
	}).then(response => {

		// If user was successfully registered, we will automatically log them in
		localStorage.setItem('role', response.data.role)
		localStorage.setItem('authtoken', response.data.token)

		location.reload()

	}).catch(err => {
		// console.log(err)
		if (err.response) {
			switch (err.response.status) {
				case 422:

					if (err.response.data.name == "ExistingEmailError") {
						// console.log("Email already exists")
						alertExisting("email")
					} else if (err.response.data.name == "ExistingUserError") {
						// console.log("Username already exists")
						alertExisting("username")
					}
					break

				case 400:
					bootstrapAlert(err.response.data.response || "Something went wrong", "alert-danger")
					break;

				default:
					// console.log('Something went wrong');
					break
			}
		}
	})
})

if (localStorage.getItem('role') != "Public") {
	$(location).attr('href', '/')
}