//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function authorizeCustomerToken() {
	if (localStorage.getItem('role') !== 'Customer') {
		alert("Please log in as a customer first.")
		window.location = '/'
	}
}

authorizeCustomerToken()