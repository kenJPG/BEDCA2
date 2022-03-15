//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function validateToken() {
	/**
	 * This function validates the token in localStorage. This should get called before any other js function.
	 */
	if (localStorage.getItem('authtoken') == undefined) {
		localStorage.setItem('authtoken', '')
	}
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/token'
	}).then(response => {
		// Update the role
		localStorage.setItem('role', response.data.role)
	}).catch(err => {
		// console.log(err.response)
		if (err.response.data.code === 401 && err.response.data.name === "InvalidTokenError") {
			window.alert("Your token is invalid. Please refresh the page.")
			localStorage.removeItem('authtoken')
			location.reload()
			throw err
		}
	})
}