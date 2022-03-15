//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function setupLogoutButton() {
	if (localStorage.getItem('loggedOut') === 'true') {
		bootstrapAlert("Successfully logged out", "alert-warning")
		localStorage.setItem('loggedOut', 'false')
	}

	$('#logout_button').on('click', event => {
		try {
			event.preventDefault()
			localStorage.setItem('authtoken', '')
			localStorage.setItem('role', 'Public')
			localStorage.setItem('cart', '')
			localStorage.setItem('loggedOut', 'true')
			location.reload()
		} catch (err) {
			// console.log(err)
			bootstrapAlert("<strong>Error!</strong> We're unable to log you out", 'alert-danger')
		}
	})
}