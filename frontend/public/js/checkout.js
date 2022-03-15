//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function setupCheckoutButton() {
	/**
	 * Setup the checkout button, to display
	 * the correct error messages in case there are any.
	 */
	$('#checkout_button').on('click', async(event) => {

		// Check if cart is empty
		if ((Object.keys(validateCart())).length == 0) {
			bootstrapAlert("You have no items in your cart", "alert-danger")
		} else {

			// Check if valid payment method is selected
			if (currentPaymentId == -1) {
				bootstrapAlert("Please select a payment method", "alert-danger")

			// Check if valid address is selected
			} else if (currentAddressId == -1) {
				bootstrapAlert("Please an address", "alert-danger")
			} else {

				// Axios request to create an order
				await axios({
					method: 'post',
					url: 'http://localhost:8081/api/order',
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('authtoken')
					},
					data: {
						paymentid: currentPaymentId,
						addressid: currentAddressId,
						cart: localStorage.getItem('cart'),
						total: checkout_total
					}
				}).then(response => {

					bootstrapAlert("Checking out!", 'alert-success')
					localStorage.setItem('cart', '')

					// Redirect the user to the page with order details
					window.location = `/order/${response.data.orderid}`

				}).catch(err => {
					// console.log(err)
					if (err.response.data) {
						// console.log(err.response.data)
						bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
					} else {
						bootstrapAlert("Something went wrong", 'alert-danger')
					}
				})
			}
		}
	})
}

async function init() {
	/**
	 * Initialising function for set up
	 */
	try {
		await validateToken()

		await Promise.all(
			[setupPaymentMethods(), setupAddresses()]
		)

		await initCart() // Initialise checkout cart

		setupCheckoutButton()

	} catch (err) {
		// console.log(err)
	}
}

init()