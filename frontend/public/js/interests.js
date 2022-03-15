//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function getCurrentInterests() {
	/*
		Get all interests the user is currently interested in
	*/

	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/interests',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err.response)
		return []
	})
}

function getAllCategories() {
	/*
		Get all categories that exist in the database
	*/
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/category',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err.response);
		return []
	})
}

async function displayCurrentInterests() {
	/*
		Gets all the interests of the user and
		displays them
	*/
	$('#current_interests').empty()
	let category_interests = await getCurrentInterests()
	if (category_interests.length > 0) {
		category_interests.forEach(category_info => {
			$('#current_interests').append(
				`
				<div class="col-4 p-1" style="float: left;">
					<div class="card" style="min-height: 15vh;">
						<div class="card-body">
							<div class="h5 card-title category_title">
							</div>
							<div class="card-text category_desc">
							</div>
						</div>
					</div>
				</div>
				`
			)
			$('.category_title').last().text(
				category_info.category
			)
			$('.category_desc').last().text(
				category_info.description
			)
		})
	} else {
		$('#current_interests').append(
			`
			<div class="display-5" style="font-size: 1.2rem">
				<strong>You have no current interests</strong>
			</div>
			`
		)
	}
}

async function deleteInterestsMsg(checked_array, category_error_array) {
	/*
		Given

			<checked_array> - An array that contains categoryids of all
			checkboxes the user has ticked
		
			<category_error_array> - An array of objects; each object
			contains the error code, and the category id that the error
			belongs to.

		display the respective/success messages to the user.
	*/

	let category_object = {} // Used in mapping categoryids to the category name

	// Initialise category_object
	let all_category_array = await getAllCategories()
	all_category_array.map(category_info => {
		category_object[category_info.categoryid] = category_info.category
	})


	
	// To determine which of the categories the user selected was successfully
	// inserted into the database, we will subtract all the error categories from
	// all categories the user has checked. 

	let checkedCategorySet = new Set() // This set contains category names of all checked categories

	checked_array.forEach(categoryid => {
		checkedCategorySet.add(category_object[categoryid])
	})

	function difference(setA, setB) {
		/*
			Return a set derived from setA - setB
		*/
		let _difference = new Set(setA)
		for (let elem of setB) {
			_difference.delete(elem)
		}
		return _difference
	}

	let categoryErrorSet = new Set() // This set contains category names of all error categories. i.e. categories that were unsuccessful in inserting
	category_error_array.map(category_error => {
		categoryErrorSet.add(category_object[category_error.categoryid])
	})

	$('#add_interests_error').empty()


	// We can now determine all the categories that were successfully inserted
	let success_categories = (difference(checkedCategorySet, categoryErrorSet))
	let error_categories = categoryErrorSet

	// Note we display the successful categories FIRST, and then proceed
	// with displaying the error messages.
	success_categories.forEach(categoryname => {
		$('#add_interests_error').append(
			`
			<p class="text-success"><strong>${categoryname}</strong> has been successfully deleted!</p>
			`
		)
	})

	category_error_array.forEach(category_error => {

		let message = "couldn't be deleted for some reason"
		$('#add_interests_error').append(
			`
			<p class="text-danger"><strong>${category_object[category_error.categoryid]}</strong> ${message}</p>
			`
		)
	})

}

async function addInterestsMsg(checked_array, category_error_array) {
	/*
		Given

			<checked_array> - An array that contains categoryids of all
			checkboxes the user has ticked
		
			<category_error_array> - An array of objects; each object
			contains the error code, and the category id that the error
			belongs to.

		display the respective/success messages to the user.
	*/

	let category_object = {} // Used in mapping categoryids to the category name

	// Initialise category_object
	let all_category_array = await getAllCategories()
	all_category_array.map(category_info => {
		category_object[category_info.categoryid] = category_info.category
	})


	
	// To determine which of the categories the user selected was successfully
	// inserted into the database, we will subtract all the error categories from
	// all categories the user has checked. 

	let checkedCategorySet = new Set() // This set contains category names of all checked categories

	checked_array.forEach(categoryid => {
		checkedCategorySet.add(category_object[categoryid])
	})

	function difference(setA, setB) {
		/*
			Return a set derived from setA - setB
		*/
		let _difference = new Set(setA)
		for (let elem of setB) {
			_difference.delete(elem)
		}
		return _difference
	}

	let categoryErrorSet = new Set() // This set contains category names of all error categories. i.e. categories that were unsuccessful in inserting
	category_error_array.map(category_error => {
		categoryErrorSet.add(category_object[category_error.categoryid])
	})

	$('#add_interests_error').empty()


	// We can now determine all the categories that were successfully inserted
	let success_categories = (difference(checkedCategorySet, categoryErrorSet))
	let error_categories = categoryErrorSet

	// Note we display the successful categories FIRST, and then proceed
	// with displaying the error messages.
	success_categories.forEach(categoryname => {
		$('#add_interests_error').append(
			`
			<p class="text-success"><strong>${categoryname}</strong> has been successfully added!</p>
			`
		)
	})

	category_error_array.forEach(category_error => {

		let message = "couldn't be added for some reason"
		if (category_error.code == 'ER_DUP_ENTRY') {
			message = "is already an existing interest!"
		}
		$('#add_interests_error').append(
			`
			<p class="text-danger"><strong>${category_object[category_error.categoryid]}</strong> ${message}</p>
			`
		)
	})

}

async function setupAddInterests() {
	/*
		This function sets up/initialises all the checkboxes
		for adding interests
	*/

	$('#add_interests').empty()

	let category_interests = await getAllCategories()

	category_interests.forEach(category_info => {
		$('#add_interests').append(
			`
				<div class="form-check form-check-inline">
					<input class="form-check-input interest_check" type="checkbox" value="${category_info.categoryid}">
					<label class="form-check-label interest_label"></label>
				</div>
			`
		)
		$('.interest_label').last().text(
			category_info.category
		)
	})

	$('#add_interests_button').on('click', async(event) => {
		let checked_array = ($('.interest_check').map(function() {
			if ($(this).is(':checked')) {
				return $(this).val()
			}
		})).get()

		await axios({
			method: 'post',
			url: 'http://localhost:8081/api/interests',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: {
				categoryids: checked_array.join(',')
			}
		}).then(response => {
			addInterestsMsg(checked_array, [])
		}).catch(err => {
			// console.log(err.response.data)
			if (err.response.status == 422 && err.response.data) {
				addInterestsMsg(checked_array, err.response.data)
			} else if (err.response.status == 400) {
				bootstrapAlert("You didn't select a category", "alert-danger")
			}
		})

		
		displayCurrentInterests()
	})

	$('#delete_interests_button').on('click', async(event) => {
		let checked_array = ($('.interest_check').map(function() {
			if ($(this).is(':checked')) {
				return $(this).val()
			}
		})).get()

		await axios({
			method: 'delete',
			url: 'http://localhost:8081/api/interests',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: {
				categoryids: checked_array.join(',')
			}
		}).then(response => {
			deleteInterestsMsg(checked_array, [])
		}).catch(err => {
			// console.log(err.response.data)
			if (err.response.status == 422 && err.response.data) {
				deleteInterestsMsg(checked_array, err.response.data)
			} else if (err.response.status == 400) {
				bootstrapAlert("You didn't select a category", "alert-danger")
			}
		})

		
		displayCurrentInterests()
	})
}

async function init() {
	try {
		await validateToken()

		await Promise.all(
			[setupAddInterests(), displayCurrentInterests()]
		)

	} catch (err) {
		// console.log(err) 
	}
}

init()