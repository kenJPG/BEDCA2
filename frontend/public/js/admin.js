//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

// ======================================
// Add Products
// ======================================
async function updateAddProductCategory() {
	let category_info_array = await getAllCategories()

	$('#add_product_category').empty()

	category_info_array.forEach(category_info => {
		$('#add_product_category').append(
			`
			<option class="add_product_category_option" value="${category_info.categoryid}"></option>
			`
		)
		$('.add_product_category_option').last().text(
			category_info.category
		)
		$('.add_product_category_option').last().attr('value', category_info.categoryid)
	})
}

function updateAddProductButton() {
	$('#add_product_button').on('click', (event) => {
		console.log("Clicked!")

		let fd = new FormData(document.querySelector('#add_product_form'))

		axios({
			method: 'post',
			url: 'http://localhost:8081/api/product/',
			data: fd,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: fd
		}).then(response => {
			bootstrapAlert('Product added!', 'alert-success')
		}).catch(err => {
			console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response, 'alert-danger')
			}
		})
	})
}

async function setupAddProducts() {
	await updateAddProductCategory()
	updateAddProductButton()
}

// ======================================
// Edit products
// ======================================
var currentEditProductId; // This variable contains currently selected productid 

async function updateEditProductCategory() {
	/*

		Update the category list in case there are new categories

	*/

	let category_info_array = await getAllCategories()
	$('#edit_product_category').empty()

	category_info_array.forEach(category_info => {
		$('#edit_product_category').append(
			`
			<option class="edit_product_category_option" id="edit_option_id_${category_info.categoryid}" value="${category_info.categoryid}"></option>
			`
		)
		$('.edit_product_category_option').last().text(
			category_info.category
		)
		$('.edit_product_category_option').last().attr('value', category_info.categoryid)
	})
}

async function updateCurrentEditProduct(product_info) {
	/*

		Given information about that product, load the
		current details into the form

	*/
	if (product_info === undefined) {
		$('#edit_product_box').html(
			`
			<div class="d-flex w-100 justify-content-center align-items-center" style="height: 60vh">
				<div class="display-3" style="font-size: 2rem">
					Click a product from below to edit
				</div>
			</div>
			`
		)
	} else {

		$('#edit_product_box').html(
			`
				<div style="width: 50vw;">
					<form id="edit_product_form" enctype="multipart/form-data">
						<div class="col-4 p-2" style="float: left;">
							<img id="edit_product_image" src="" class="w-100" />
						</div>
						<div class="col-8 p-2" style="float: right;">
							<div class="flex-nowrap mb-3">
								<label for="edit_product_name" class="form-label">Product Name</label>
								<input id="edit_product_name" type="text" class="form-control" name="product_name" placeholder="name" aria-label="name" aria-describedby="addon-wrapping">
							</div>
							<div class="flex-nowrap mb-3">
								<label for="edit_product_price" class="form-label">Price</label>
								<input id="edit_product_price" type="text" class="form-control" name="product_price" placeholder="100" aria-label="100" aria-describedby="addon-wrapping">
							</div>
							<div class="flex-nowrap mb-3">
								<label for="edit_product_category" class="form-label">Category</label>
								<select class="form-select" id="edit_product_category" name="product_category">
									<option value="1">One</option>
									<option value="2">Two</option>
									<option value="3">Three</option>
								</select>
							</div>
							<div class="flex-nowrap mb-3">
								<label for="edit_product_brand" class="form-label">Brand</label>
								<input id="edit_product_brand" type="text" class="form-control" placeholder="brand name" aria-label="brand name" aria-describedby="addon-wrapping" name="product_brand">
							</div>
							<div class="mb-3">
								<label for="edit_product_description" class="form-label">Description</label>
								<textarea id="edit_product_description" class="form-control" aria-label="With textarea" placeholder="Text here" name="product_desc"></textarea>
							</div>
							<div class="mb-3">
								<label for="edit_product_image" class="form-label">Product Image</label>
								<input type="file" class="form-control" id="add_product_image" name="image">
							</div>
							<div class="col-12 py-5 w-100 d-flex justify-content-center">
								<div id="edit_product_button" class="btn btn-success mx-4" style="width: 40%">
									Save changes
								</div>
								<div id="delete_product_button" class="btn btn-danger mx-4" style="width: 40%">
									Delete product
								</div>
							</div>
						</div>
					</form>
				</div>
			`
		)
		await updateEditProductCategory()

		$('#edit_product_name').val(product_info.name)
		$('#edit_product_price').val(product_info.price)
		$(`#edit_option_id_${product_info.categoryid}`).prop('selected', true)
		$('#edit_product_brand').val(product_info.brand)
		$('#edit_product_description').val(product_info.description)

		let imageBase64 = await loadImage(product_info.productid)
		$('#edit_product_image').attr('src', imageBase64)
	}
}

async function selectEditProduct(productid) {
	/*

		Given a product id, we will 'select' it.

	*/

	// Retrieve information of that productid
	await axios({
		method: 'get',
		url: `http://localhost:8081/api/product/${productid}`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {

		// Update the editable area such that it displays that product
		updateCurrentEditProduct(response.data[0])
	}).catch(err => {
		// console.log(err)
	})
}

async function updateEditProductsDisplay() {
	/*

		Run to update the edit products display

	*/
	let products = await getAllProducts()
	let productCounter = 0
	let productResultObject = {}
	products.forEach(async (basic_product_info) => {
		basic_product_info.productid
		await axios({
			method: 'get',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			url: `http://localhost:8081/api/product/${basic_product_info.productid}`
		}).then(async (response) => {
			let detailed_product_info = response.data[0]
			await axios({
				method: 'get',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('authtoken')
				},
				url: `http://localhost:8081/api/product/${detailed_product_info.productid}/promotion`
			}).then(async(response) => {
				let promotion_info_array = response.data
				productResultObject[detailed_product_info.name] = await produceHTMLOfProduct(detailed_product_info, promotion_info_array)
			}).catch(async(err) => {
				productResultObject[detailed_product_info.name] = await produceHTMLOfProduct(detailed_product_info, [])
			})
		}).catch(err => {
			// console.log(err)
		})
		productCounter++
		if (productCounter == products.length) {
			const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
			$('#edit_products_display').html(
				(Object.values(sortObject(productResultObject))).join('')
			)
			$('#loading_spinner').addClass('visually-hidden')
		}
	})
}


async function setupEditProducts() {
	/*
		Initialise/setup for 'Edit products'
	*/
	
	updateCurrentEditProduct()

	await updateEditProductsDisplay()

	$('#edit_products_display').on('click', '.product_box_link', async function(event) {
		Object.values($('.product_box_link')).forEach(element => {
			$(element).removeClass('highlighted')
		})
		$(this).addClass('highlighted')

		await selectEditProduct($(this).attr('data-productid'))

		currentEditProductId = $(this).attr('data-productid')

		$('#edit_product_button').on('click', (event) => {

			let fd = new FormData(document.querySelector('#edit_product_form'))

			axios({
				method: 'put',
				url: `http://localhost:8081/api/product/${currentEditProductId}`,
				data: fd,
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('authtoken')
				},
			}).then(response => {
				bootstrapAlert('Product edited!', 'alert-success')

				updateEditProductsDisplay() // Update the display such that changes are applied 

				updateCurrentEditProduct()
			}).catch(err => {
				// console.log(err)
				if (err.response.data) {
					bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
				}
			})

		})

		$('#delete_product_button').on('click', (event) => {

			axios({
				method: 'delete',
				url: `http://localhost:8081/api/product/${currentEditProductId}`,
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('authtoken')
				}
			}).then(response => {
				bootstrapAlert(`Product deleted if it exists`)

				updateEditProductsDisplay()

				updateCurrentEditProduct()
			}).catch(err => {
				// console.log(err);
				bootstrapAlert('Unable to delete that product', 'alert-danger')
			})
		})
	})
}

// ======================================
// Add categories
// ======================================

function updateAddCategoryButton() {
	$('#add_category_button').on('click', (event) => {

		let fd = new FormData(document.querySelector('#add_category_form'))

		axios({
			method: 'post',
			url: 'http://localhost:8081/api/category/',
			data: fd,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			}
		}).then(response => {
			$('#add_category_form')[0].reset()

			bootstrapAlert('Category added!', 'alert-success')
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	})
}

async function setupAddCategory() {
	updateAddCategoryButton()
}


// ==========================
// Add promotions
// ==========================


function updateAddPromotionButton() {
	$('#add_promotion_button').on('click', (event) => {

		let fd = new FormData(document.querySelector('#add_promotion_form'))

		axios({
			method: 'post',
			url: 'http://localhost:8081/api/promotion/',
			data: fd,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			}
		}).then(response => {
			bootstrapAlert('Promotion created!', 'alert-success')
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	})
}

async function setupAddPromotion() {
	updateAddPromotionButton()
}


// ==========================
// Edit promotions
// ==========================
var currentEditPromotionId;

async function updateCurrentEditPromotion(promotion_info) {
	/*

		Given information about that promotion, load the
		current details into the form

	*/
	if (promotion_info === undefined) {
		$('#edit_promotion_box').html(
			`
			<div class="d-flex w-100 justify-content-center align-items-center" style="height: 60vh">
				<div class="display-3" style="font-size: 2rem">
					Click a promotion from below to edit
				</div>
			</div>
			`
		)
	} else {

		$('#edit_promotion_box').html(
			`
				<div style="width: 50vw;">
					<form id="edit_promotion_form" enctype="multipart/form-data">
						<div class="col-8 p-2" style="float: right;">
							<div class="flex-nowrap mb-3">
								<label for="edit_promotion_name" class="form-label">Product Name</label>
								<input id="edit_promotion_name" type="text" class="form-control" name="promotion_name" placeholder="name" aria-label="name" aria-describedby="addon-wrapping">
							</div>
							<div class="flex-nowrap mb-3">
								<label for="edit_promotion_start" class="form-label">Start Date</label>
								<input id="edit_promotion_start" type="text" class="form-control" name="promotion_start" placeholder="100" aria-label="100" aria-describedby="addon-wrapping">
							</div>
							<div class="flex-nowrap mb-3">
								<label for="edit_promotion_end" class="form-label">End Date</label>
								<input id="edit_promotion_end" type="text" class="form-control" name="promotion_end" placeholder="100" aria-label="100" aria-describedby="addon-wrapping">
							</div>
							<div class="col-12 py-5 w-100 d-flex justify-content-center">
								<div id="edit_promotion_button" class="btn btn-success mx-4" style="width: 40%">
									Save changes
								</div>
								<div id="delete_promotion_button" class="btn btn-danger mx-4" style="width: 40%">
									Delete promotion
								</div>
							</div>
						</div>
					</form>
				</div>
			`
		)

		let start_date = new Date(promotion_info.start)
		let start_date_string = `${start_date.getFullYear()}/${start_date.getMonth()+1}/${start_date.getDate()}`
		let end_date = new Date(promotion_info.end)
		let end_date_string = `${end_date.getFullYear()}/${end_date.getMonth()+1}/${end_date.getDate()}`

		$('#edit_promotion_name').val(promotion_info.promotionname)
		$('#edit_promotion_start').val(start_date_string)
		$('#edit_promotion_end').val(end_date_string)
	}
}

async function selectEditPromotion(promotionid) {
	/*

		Given a promotion id, we will select it.

	*/

	// Retrieve information of that productid
	try {
		let promotions = await getAllPromotions()
		let promotionObject = {}
	
		promotions.map(promotion_info => {
			promotionObject[promotion_info.promotionid] = promotion_info
		})
	
		// Update the editable area such that it displays that product
		updateCurrentEditPromotion(promotionObject[promotionid])
	} catch (err) {
		// console.log(err)
	}
}

async function updateEditPromotionDisplay() {
	/*

		Run to update the edit products display

	*/
	let promotions = await getAllPromotions()
	let promotionHTML = ""
	let promotionCounter = 0
	promotions.forEach((basic_promotion_info) => {
		let start_date = new Date(basic_promotion_info.start)
		let start_date_string = `${start_date.getFullYear()}/${start_date.getMonth()+1}/${start_date.getDate()}`
		let end_date = new Date(basic_promotion_info.end)
		let end_date_string = `${end_date.getFullYear()}/${end_date.getMonth()+1}/${end_date.getDate()}`
		promotionHTML +=
		`
			<div class="col-md-4 col-sm-6 p-1" style="float: left; ">
				<div class="promotion_box p-1 h-100" style="float: left;">
					<div class="promotion_box_link p-2" style="text-decoration: none; cursor: pointer;" data-promotionid="${basic_promotion_info.promotionid}">
						<div class="card" style="position: relative; width: 33vh;">
							<ul class="list-group">
								<div class="list-group-item">
									<div class="card-body">
										<div class="promotion_title w-100" class="card-title">
											<div class='col-12 d-flex align-items-center'>
												<span class="h5 promotion_name d-inline-block text-truncate" style="max-width: 10vw";>
													${basic_promotion_info.promotionname}
												</span>
											</div>
										</div>
										<div class="promotion_desc" class="card-subtitle">
											<span class="promotion_start text-muted">${start_date_string}</span> - <span class="promotion_price text-muted">${end_date_string}</span>
										</div>
									</div>
								</div>
							</ul>
						</div>
					</div>
				</div>
			</div>
		`
		promotionCounter++
		if (promotionCounter == promotions.length) {
			$('#edit_promotion_display').html(
				promotionHTML
			)
		}
	})
}


async function setupEditPromotion() {
	/*
		Initialise/setup for 'Edit promotion'
	*/
	
	updateCurrentEditPromotion()

	await updateEditPromotionDisplay()

	$('#edit_promotion_display').on('click', '.promotion_box_link', async function(event) {
		Object.values($('.promotion_box_link')).forEach(element => {
			$(element).removeClass('highlightedPromotion')
		})
		$(this).addClass('highlightedPromotion')

		await selectEditPromotion($(this).attr('data-promotionid'))

		currentEditPromotionId = $(this).attr('data-promotionid')

		$('#edit_promotion_button').on('click', (event) => {

			let fd = new FormData(document.querySelector('#edit_promotion_form'))

			axios({
				method: 'put',
				url: `http://localhost:8081/api/promotion/${currentEditPromotionId}`,
				data: fd,
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('authtoken')
				},
			}).then(response => {
				bootstrapAlert('Promotion edited!', 'alert-success')

				updateEditPromotionDisplay() // Update the display such that changes are applied 

				updateCurrentEditPromotion()
			}).catch(err => {
				// console.log(err)
				if (err.response.data) {
					bootstrapAlert(err.response.data.response, 'alert-danger')
				}
			})

		})

		$('#delete_promotion_button').on('click', (event) => {

			axios({
				method: 'delete',
				url: `http://localhost:8081/api/promotion/${currentEditPromotionId}`,
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('authtoken')
				}
			}).then(response => {
				bootstrapAlert(`Promotion deleted if it exists`)

				updateEditPromotionDisplay()

				updateCurrentEditPromotion()
			}).catch(err => {
				// console.log(err);
				bootstrapAlert('Unable to delete that promotion', 'alert-danger')
			})
		})
	})
}


// ======================================
// Manage Discounts
// ======================================

async function updateManageDiscountProducts() {
	$('#add_discount_product').empty()

	let products_array = await getAllProducts();

	let productHTMLObject = {}

	products_array.forEach(product_info => {
		productHTMLObject[product_info.name] = `<option value="${product_info.productid}">${product_info.name}</option>`
	})
	
	const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});

	productHTMLObject = sortObject(productHTMLObject);

	(Object.keys(productHTMLObject)).forEach(key => {
		$('#add_discount_product').append(productHTMLObject[key])
	})
}

async function updateManageDiscountPromotions() {
	$('#add_discount_promotion').empty()

	let promotions_array = await getAllPromotions()

	let promotionHTMLObject = {}

	promotions_array.forEach(promotion_info => {
		promotionHTMLObject[promotion_info.promotionname] = `<option value="${promotion_info.promotionid}">${promotion_info.promotionname}</option>`
	})
	
	const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});

	promotionHTMLObject = sortObject(promotionHTMLObject);

	(Object.keys(promotionHTMLObject)).forEach(key => {
		$('#add_discount_promotion').append(promotionHTMLObject[key])
	})
}

function setupAddDiscountButton() {
	$('#add_discount_button').on('click', async(event) => {
		let fd = new FormData(document.querySelector('#add_discount_form'));

		await axios({
			method: 'post',
			url: 'http://localhost:8081/api/discount',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: fd
		}).then(response => {
			bootstrapAlert('Added discount!', 'alert-success')
			updateManageDiscountDisplay()
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	})
}

function setupDeleteDiscountButton() {
	$('.delete_discount_button').on('click', async function() {
		let productid = $(this).attr('data-productid')
		let promotionid = $(this).attr('data-promotionid')

		await axios({
			method: 'delete',
			url: 'http://localhost:8081/api/discount',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			},
			data: {
				productid,
				promotionid
			}
		}).then(response => {
			bootstrapAlert('Deleted discount!', 'alert-success')
			updateManageDiscountDisplay()
		}).catch(err => {
			// console.log(err)
			if (err.response.data) {
				bootstrapAlert(err.response.data.response || "Something went wrong", 'alert-danger')
			}
		})
	})
}

function getAllDiscounts() {
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/discount',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err);
	})
}

async function updateManageDiscountDisplay() {
	$('#discount_display').empty()

	let discount_array = await getAllDiscounts() || []

	$('#discount_display').append(
		`
		<div class="card w-100" style="min-height: 7vh">
			<div class="card-body d-flex justify-content-between">
				<div class="col-5 display_discount_product">
					Product
				</div>
				<div class="col-5 display_discount_promotion">
					Promotion
				</div>
				<div class="col-1 display_discount_value">
					Discount Value
				</div>
				<div class="col-1 delete_discount_button">
					Delete button
				</div>
			</div>
		</div>
		`
	)


	discount_array.forEach(element => {
		$('#discount_display').append(
			`
			<div class="card w-100" style="min-height: 7vh">
				<div class="card-body d-flex justify-content-between">
					<div class="col-5 display_discount_product">
					</div>
					<div class="col-5 display_discount_promotion">
					</div>
					<div class="col-1 display_discount_value">
					</div>
					<div class="col-1 delete_discount_button btn btn-danger" data-productid='${element.productid}' data-promotionid='${element.promotionid}'>
						<i class="fas fa-times"></i>
					</div>
				</div>
			</div>
			`
		)
		$('.display_discount_product').last().text(
			element.name
		)
		$('.display_discount_promotion').last().text(
			element.promotionname
		)
		$('.display_discount_value').last().text(
			element.product_discount
		)
	});

	setupDeleteDiscountButton()
}

async function setupManageDiscounts() {
	await updateManageDiscountProducts()
	await updateManageDiscountPromotions()

	setupAddDiscountButton()
	
	await updateManageDiscountDisplay()

	setupDeleteDiscountButton()
}

// ======================================
// Helper functions
// ======================================
function getAllBrands() {
	/*
	=============================
		Returns a promoise chain to retrieve all
		brand from backend and display them.
	=============================
	*/

	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/brands'
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err)
	}) 
}

function getAllPromotions() {
	/*
	=============================
		Returns a promoise chain to retrieve all
		brand from backend and display them.
	=============================
	*/

	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/promotion'
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err)
	}) 
}

function updateAccountDropdown() {
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `http://localhost:3001/home/partial/${localStorage.getItem('role')}`
	}).then(response => {
		$('#account_dropdown').html(
			response.data
		)
	}).catch(err => {
		// console.log(err)
	})
}


function getAllCategories() {
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/category',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err)
	})
}

function getStarsFromRating(rating) {
	let starHTML = ""
	for (let i = 0; i < Math.round(rating); i++) {
		starHTML += `<i class="fa fa-star" style="color: #EEBD01;"></i>`
	}
	for (let i = Math.round(rating); i < 5; i++) {
		starHTML += `<i class="fa fa-star"></i>`
	}
	return starHTML
}

async function getAllProducts() {
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/products',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err.response)
	})
}

function processPromotion(detailed_product_info, promotion_info_array) {
	/*
	=============================
		Given the product information and information on all promotions,
		this function returns
	
			<priceHTML>
				- html containing original price(strikethrough)
				  and the newly discounted price
	
			<promotionname>
				- promotion that is currently active
				- NOTE if there are 2 or more promotions
				  active, only the right-most promotion
				  is returned.
	=============================
	*/

	let priceHTML = `$<span>${detailed_product_info.price}</span>`
	let promotionname = ""

	promotion_info_array.forEach(promotion_info => {
		let promotion_start = (new Date(promotion_info.start)).getTime()
		let promotion_end = (new Date(promotion_info.end)).getTime()

		let discounted_price = detailed_product_info.price

		if ((promotion_start <= Date.now()) && (Date.now() <= promotion_end)) {
			discounted_price *= 1 - (parseFloat(promotion_info.product_discount) / 100)
			promotionname = promotion_info.promotionname
			priceHTML = `<span style="color: red; text-decoration:line-through;">$${detailed_product_info.price}</span> $${discounted_price.toFixed(2)}`
		}
		promotion_info.promotionname
	})
	return {priceHTML, promotionname}
}

async function produceHTMLOfProduct(detailed_product_info, promotion_info_array) {
	let {promotionname} = processPromotion(detailed_product_info, promotion_info_array)
	let imageBase64 = await loadImage(detailed_product_info.productid)
	return (
		`

			<div class="col-md-4 col-sm-6" style="float: left; width: 30vh;">
				<div class="product_box w-100 h-100" style="float: left;">
					<div class="product_box_link p-1" style="text-decoration: none; cursor: pointer" data-productid="${detailed_product_info.productid}">
						<div class="card w-100 h-100" style="position: relative; border-radius: 0; border: 0;">
							<ul class="list-group">
								<div class="list-group-item">
									<div style="position: absolute; top: 5%; right: 5%">
										<span class="promotion_badge badge bg-primary">${promotionname}</span>
									</div>
									<img src="${imageBase64}" class="card-img-top" alt="productimg" style="object-fit:cover;" height="300">
								</div>
								<div class="list-group-item">
									<div class="card-body">
										<div class="product_title w-100" class="card-title">
											<div class='col-12'>
												<span class="h5 product_name d-inline-block text-truncate" style="max-width: 10vw";>
													${detailed_product_info.name}
												</span>
											</div>
											<div class='col-12 d-flex align-items-center'>
												<p class="text-muted category_name" style="font-size: 0.9rem;">
													${detailed_product_info.categoryname}
												</p>
											</div>
										</div>
										<div class="product_desc" class="card-subtitle">
											<div class="product_rating">
												${getStarsFromRating(detailed_product_info.rating)}
											</div>
											<div class="product_price">
												${detailed_product_info.price}
											</div>
										</div>
									</div>
								</div>
							</ul>
						</div>
					</div>
				</div>
			</div>
		`
	)
}

// =================
// Tab updates
// =================

var triggerTabList = [].slice.call(document.querySelectorAll('#admin_tab'))
triggerTabList.forEach(function (triggerEl) {

	// Update all tabs to newest information, when any tab is clicked.
	triggerEl.addEventListener('click', function (event) {
		event.preventDefault()

		updateAddProductCategory()
		updateEditProductsDisplay()
		updateEditProductCategory()
		updateEditPromotionDisplay()
		updateManageDiscountProducts()
		updateManageDiscountDisplay()
		updateManageDiscountPromotions()
	})
})

async function init() {
	await validateToken()

	authorizeAdminToken()

	await updateAccountDropdown()
	
	setupAddProducts()
	
	await setupEditProducts()

	await setupAddPromotion()
	
	await setupEditPromotion()

	setupAddCategory()


	setupManageDiscounts()

	setupLogoutButton()
}

init()
