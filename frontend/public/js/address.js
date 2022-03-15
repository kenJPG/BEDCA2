//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function getAllAddressIds() {
	/**
	 * Return an axios promise that returns data on all
	 * address ids of the currently logged in user.
	 * If any error is found, return an empty array.
	 */
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/addresses',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		if (err.response.status == 404) {
			// console.log("No addresses")
		} else {
			// console.log("Unable to setup addresses")
			// console.log(err)
		 }
		return []
	})
}

function getAddressDetails(addressid) {
	/**
	 * Return an axios promise that returns the address
	 * details given an address id.
	 */
	return axios({
		method: 'get',
		url: `http://localhost:8081/api/address/${addressid}`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err)
	})
}

function addAddressMethod(fd) {
	/**
	 * Given formdata, return an axios promise that
	 * POSTs the data. Upon success, execute a bootstrap
	 * alert
	 */
	return axios({
		method: 'post',
		url: `http://localhost:8081/api/address`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		data: fd
	}).then(response => {
		bootstrapAlert('Added address method', 'alert-success')
		return 'success'
	}).catch(err => {
		// console.log(err)
		if (err.response.data) {
			bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
		}
	})
}

async function deleteSelectedAddress() {
	/**
	 * When this function is run, the currently selected
	 * address is deleted.
	 */
	if (currentAddressId == -1) {
		bootstrapAlert("Please select an address first to delete")
	} else {
		await axios({
			method: 'delete',
			url: `http://localhost:8081/api/address/${currentAddressId}`,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			}
		}).then(response => {
			updateAddress()
			currentAddressId = -1
			$('#delete_address_button').addClass('d-none')
			$('#edit_address_button').addClass('d-none')
			bootstrapAlert('Deleted address!', 'alert-success')
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	}
}

async function loadEditAddressForm() {
	/**
	 * Retrieve the address details of the selected addressid and
	 * load them into the edit form.
	 */


	let address_details = (await getAddressDetails(currentAddressId))[0];

	$('#edit_address_name').val(address_details.name)
	$('#edit_address_address').val(address_details.address)
	$('#edit_address_postal').val(address_details.postal_code)

}

function editAddress(fd) {
	/**
	 * Given formdata, return an axios promise that
	 * performs a PUT request to update the address
	 */
	if (currentAddressId == -1) {
		bootstrapAlert("Please select an address method first", "alert-danger")
	} else {
		return axios({
			method: 'put',
			url: `http://localhost:8081/api/address/${currentAddressId}`,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: fd
		}).then(response => {
			bootstrapAlert('Edited address method', 'alert-success')
			$('#edit_address_button').addClass('d-none')
			$('#delete_address_button').addClass('d-none')
			return 'success'
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				// console.log(err.response.data)
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	}
}

function setupAddressesButton(addAddressModal, editAddressModal) {
	/**
	 * Responsible for setting up event listeners(buttons).
	 * NOTE: the model events are passed. This is because trying to make a bootstrap
	 * model instance within this function does not appear to capture
	 * the modal correctly.
	 */
	$('#add_address_button').on('click', (event) => {
		addAddressModal.show()
	})

	$('#edit_address_button').on('click', (event) => {
		loadEditAddressForm()
		editAddressModal.show()
	})
	
	$('#delete_address_button').on('click', (event) => {
		deleteSelectedAddress()
	})

	$('#submit_add_address_form_button').on('click', async(event) => {
		let fd = new FormData(document.getElementById('add_address_form'))
		let result = await addAddressMethod(fd)
		if (result === 'success') {
			addAddressModal.hide()
			updateAddress()
		}
	})
	$('#submit_edit_address_form_button').on('click', async(event) => {
		let fd = new FormData(document.getElementById('edit_address_form'))
		let result = await editAddress(fd)
		if (result === 'success') {
			editAddressModal.hide()
			updateAddress()
		}
	})

}

function produceAddressHTML(address_detail) {
	/**
	 * Given address details, add on a card that contains said
	 * address information onto the list of address methods
	 */
	$('#address_container').append(
	`
			<div class="col-lg-5 col-md-12 m-2" style="float: left; max-width: 30vh;">
				<div class="address_box h-100" style="float: left; cursor: pointer;" data-addressid="${address_detail.addressid}">
					<div class="card" style="h-100 position: relative;">
						<ul class="list-group">
							<div class="list-group-item">
								<div class="card-body">
									<div class="product_title w-100" class="card-title">
										<div class='col-12'>
											<span class="h5 address_name d-inline-block text-truncate" style="max-width: 10vw";>
											</span>
										</div>
									</div>
									<div class="card_desc" class="card-subtitle">
										<div class="address_address">
										</div>
										<div class="address_postal">
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

	$('.address_name').last().text(
		address_detail.name
	)

	// NOTE: .text is used to prevent XSS.
	$('.address_address').last().text(
		address_detail.address
	)

	$('.address_postal').last().text(
		address_detail.postal_code
	)
}

// This variable contains the currently seleted addressid. 
var currentAddressId = -1

function setupChooseAddress() {
	/**
	 * This sets up the functionality for user to click on a address
	 * method.
	 */
	$('#address_container').on('click', '.address_box', function() {
		Object.values($('.address_box')).forEach(element => {
			$(element).removeClass('highlighted')
		})
		$(this).addClass('highlighted')
		currentAddressId = $(this).attr('data-addressid')
		$('#delete_address_button').removeClass('d-none')
		$('#edit_address_button').removeClass('d-none')
	})
}

async function updateAddress() {
	/**
	 * Retrieve all address information from backend
	 * and display that information to the user
	 */

	$('#address_container').empty()

	let addressids = await getAllAddressIds()

	// Combining promise.all and async function to efficiently
	// retrieve information of address method.
	let address_detail_array = await Promise.all(
		addressids.map(async(addressid) => {
			return (await getAddressDetails(addressid.addressid))[0]
		})
	)

	// Display all address methods
	address_detail_array.forEach(address_detail => {
		produceAddressHTML(address_detail)
	})

	if (address_detail_array.length == 0) {
		$('#address_container').html(
			`
			<div class="display-2 my-3" style="font-size: 1.3rem;">
				You do not have any addresses.
			</div>
			`
		)
	}

	// Once we have finished displaying all address methods,
	// we can now allow user to choose the address methods
	setupChooseAddress()
}

async function setupAddresses() {
	/**
	 * The function that sets up all things related to address methods.
	 */

	// We first need to create bootstrap modal instances of the two target modals.
	let addCardModal = new bootstrap.Modal(document.getElementById('add_address_modal'))
	let editCardModal = new bootstrap.Modal(document.getElementById('edit_address_modal'))

	setupAddressesButton(addCardModal, editCardModal)

	// Once we are done setting up event listeners and buttons, we display the possible
	// address methods of that user
	updateAddress()
}