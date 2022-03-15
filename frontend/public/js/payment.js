//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================


function getAllPaymentIds() {
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/payments',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		if (err.response.status == 404) {
			// console.log("No payment methods")
		} else {
			// console.log("Unable to setup payment methods")
			// console.log(err)
		 }
		return []
	})
}

function getPaymentDetails(paymentid) {
	return axios({
		method: 'get',
		url: `http://localhost:8081/api/payment/${paymentid}`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err)
	})
}

function addPaymentMethod(fd) {
	/**
	 * Given formdata, return an axios promise that
	 * POSTs the data. Upon success, execute a bootstrap
	 * alert
	 */
	return axios({
		method: 'post',
		url: `http://localhost:8081/api/payment`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		data: fd
	}).then(response => {
		bootstrapAlert('Added payment method', 'alert-success')
		return 'success'
	}).catch(err => {
		// console.log(err)
		if (err.response.data) {
			bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
		}
	})
}

async function deleteSelectedCard() {
	/**
	 * When this function is run, the currently selected
	 * card is deleted.
	 */
	if (currentPaymentId == -1) {
		bootstrapAlert("Please select a card first to delete")
	} else {
		await axios({
			method: 'delete',
			url: `http://localhost:8081/api/payment/${currentPaymentId}`,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			}
		}).then(response => {
			updatePaymentMethods()
			currentPaymentId = -1
			$('#delete_card_button').addClass('d-none')
			$('#edit_card_button').addClass('d-none')
			bootstrapAlert('Deleted card!', 'alert-success')
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	}
}

async function loadEditPaymentForm() {

	/**
	 * Retrieve the payment details of the selected paymentid and
	 * load them into the edit form.
	 */

	try {
		let payment_details = (await getPaymentDetails(currentPaymentId))[0];
		// Used to display the correct format of date YYYY/MM to the user.
		let oldDate = (new Date(payment_details.card_expiration))
		
		$('#edit_card_number').val(`****************${payment_details.last_card_digits}`)
		$('#edit_card_name').val(payment_details.card_name)
		$('#edit_card_cvv').val(`***`)
		$('#edit_card_expiration').val(`${oldDate.getFullYear()}/${oldDate.getMonth()+1}`)
	} catch (err) {
		// console.log(err);
	}



}

function editPaymentMethod(fd) {
	/**
	 * Given formdata, return an axios promise that
	 * performs a PUT request to update the payment method
	 */
	if (currentPaymentId == -1) {
		bootstrapAlert("Please select a payment method first", "alert-danger")
	} else {
		return axios({
			method: 'put',
			url: `http://localhost:8081/api/payment/${currentPaymentId}`,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: fd
		}).then(response => {
			bootstrapAlert('Edited payment method', 'alert-success')
			$('#edit_card_button').addClass('d-none')
			$('#delete_card_button').addClass('d-none')
			return 'success'
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	}
}

function setupPaymentMethodButton(addPaymentModal, editPaymentModal) {
	/**
	 * Responsible for setting up event listeners(buttons).
	 * NOTE: the model events are passed. This is because trying to make a bootstrap
	 * model instance within this function does not appear to capture
	 * the modal correctly.
	 */
	$('#add_new_card_button').on('click', (event) => {
		addPaymentModal.show()
	})

	$('#edit_card_button').on('click', (event) => {
		loadEditPaymentForm()
		editPaymentModal.show()
	})
	
	$('#delete_card_button').on('click', (event) => {
		deleteSelectedCard()
	})

	$('#submit_add_card_form_button').on('click', async(event) => {
		let fd = new FormData(document.getElementById('add_card_form'))
		let result = await addPaymentMethod(fd)
		if (result === 'success') {
			addPaymentModal.hide()
			updatePaymentMethods()
		}
	})
	$('#submit_edit_card_form_button').on('click', async(event) => {
		let fd = new FormData(document.getElementById('edit_card_form'))
		let result = await editPaymentMethod(fd)
		if (result === 'success') {
			editPaymentModal.hide()
			updatePaymentMethods()
		}
	})

}

function producePaymentHTML(payment_detail) {
	/**
	 * Given payment details, add on a card that contains said
	 * payment information onto the list of payment methods
	 */
	$('#payment_container').append(
	`
			<div class="col-lg-5 col-md-12 m-2" style="float: left; max-width: 30vh;">
				<div class="payment_box h-100" style="float: left; cursor: pointer;" data-paymentid="${payment_detail.paymentid}">
					<div class="card" style="h-100 position: relative;">
						<ul class="list-group">
							<div class="list-group-item">
								<div class="card-body">
									<div class="product_title w-100" class="card-title">
										<div class='col-12'>
											<span class="h5 card_number d-inline-block text-truncate" style="max-width: 10vw";>
											</span>
										</div>
									</div>
									<div class="card_desc" class="card-subtitle">
										<div class="card_name">
										</div>
										<div class="card_expiration">
										</div>
									</div>
								</div>
							</div>
						</ul>
					</div>
				</div>
			</div>
	`
	)

	$('.card_number').last().text(
		`************${payment_detail.last_card_digits}`
	)

	// NOTE: .text is used to prevent XSS.
	$('.card_name').last().text(
		payment_detail.card_name
	)


	// Parsing the card expiration date into the correct format
	let card_expiry = new Date(payment_detail.card_expiration)
	card_expiry = `${card_expiry.getFullYear()}/${card_expiry.getMonth()+1}`

	$('.card_expiration').last().text(
		`Expires: ${card_expiry}`
	)
}

// This variable contains the currently seleted paymentid. 
var currentPaymentId = -1

function setupChoosePayment() {
	/**
	 * This sets up the functionality for user to click on a payment
	 * method.
	 */
	$('#payment_container').on('click', '.payment_box', function() {
		Object.values($('.payment_box')).forEach(element => {
			$(element).removeClass('highlighted')
		})
		$(this).addClass('highlighted')
		currentPaymentId = $(this).attr('data-paymentid')
		$('#delete_card_button').removeClass('d-none')
		$('#edit_card_button').removeClass('d-none')
	})
}

async function updatePaymentMethods() {
	/**
	 * Retrieve all payment information from backend
	 * and display that information to the user
	 */

	$('#payment_container').empty()

	let paymentids = await getAllPaymentIds()

	// Combining promise.all and async function to efficiently
	// retrieve information of payment method.
	let payment_detail_array = await Promise.all(
		paymentids.map(async(paymentid) => {
			return (await getPaymentDetails(paymentid.paymentid))[0]
		})
	)

	// Display all payment methods
	payment_detail_array.forEach(payment_detail => {
		producePaymentHTML(payment_detail)
	})

	if (payment_detail_array.length == 0) {
		$('#payment_container').html(
			`
			<div class="display-3 my-3" style="font-size: 1.3rem;">
				You do not have any payment methods
			</div>
			`
		)
	}

	// Once we have finished displaying all payment methods,
	// we can now allow user to choose the payment methods
	setupChoosePayment()
}

async function setupPaymentMethods() {
	/**
	 * The function that sets up all things related to payment methods.
	 */

	// We first need to create bootstrap modal instances of the two target modals.
	let addCardModal = new bootstrap.Modal(document.getElementById('add_card_modal'))
	let editCardModal = new bootstrap.Modal(document.getElementById('edit_card_modal'))

	setupPaymentMethodButton(addCardModal, editCardModal)

	// Once we are done setting up event listeners and buttons, we display the possible
	// payment methods of that user
	updatePaymentMethods()
}