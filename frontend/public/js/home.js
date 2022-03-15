//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function showUsernameDisplay() {
	/**
	 * Display the username at the top right of the navigation bar
	 */
	if (localStorage.getItem('role') !== 'Public') {
		return axios({
			method: 'get',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			url: 'http://localhost:8081/api/user'
		}).then(response => {
	
			if (response.data.username !== undefined) {
	
				bootstrapAlert(`Logged in as <strong>${response.data.username}</strong>`, 'alert-success')
				$('#dropdownUser1').append(
					`
					<span id="username_display_dropdown"></span>
					`
				)
				$('#username_display_dropdown').text(
					response.data.username
				)
			}
		}).catch(err => {
			// console.log(err)
		})
	}
}

function updateAccountDropdown() {
	/**
	 *	Depending on the role of the user, display the correct
	 * account dropdown.  
	 */
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `http://localhost:3001/home/partial/${localStorage.getItem('role')}`
		// Retrieving the partial HTML depending on the role of the user
	}).then(response => {
		$('#account_dropdown').html(
			response.data
		)
	}).catch(err => {
		// console.log(err)
	})
}

function loadHomeImage() {
	/**
	 * This function returns a promise that displays
	 * the home image.
	 */
	return new Promise((resolve, reject) => {
		loadImageName('img\\home_pic.jpg')
		.then((data) => {
			let home_pic_b64 = data
			$('#title_img').attr('src', home_pic_b64)
			resolve()
		}).catch(err => {
			// console.log(err)
			reject()
		})
	})
}

function loadProductBackgroundImage() {
	/**
	 * This function returns a promise that displays
	 * the search background image.
	 */
	return new Promise((resolve, reject) => {
		loadImageName('img\\product_background_image.jpg')
		.then((data) => {
			let home_pic_b64 = data
			$('#product_background_image').attr('src', home_pic_b64)
			resolve()
		}).catch(err => {
			// console.log(err)
			reject()
		})
	})
}

function setupSearchButton() {
	/**
	 * Set up event listener for search button
	 */
	$('#search-button').on('click', async(event) => {
		event.preventDefault()

		$('#loading_spinner').removeClass('visually-hidden')

		let query = $('#search-input').val()

		window.location = `/search?query=${query}`
	})
}

async function init() {
	/**
	 * Initialise the home page
	 */
	try {

		await validateToken()

		await loadHomeImage()

		await loadProductBackgroundImage()

		await showUsernameDisplay()
		
		await updateAccountDropdown()

		setupSearchButton()

		animationInit()

		setupLogoutButton()

	} catch (err) {
		// console.log(err)
	}
}
	
init()