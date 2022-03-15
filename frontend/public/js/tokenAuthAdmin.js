//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function authorizeAdminToken() {
	if (localStorage.getItem('role') !== 'Admin') {
		alert("You are unauthorized. Only admins are allowed")
		window.location = '/'
	}
}

authorizeAdminToken()