//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function addCategoryToFilter(data) {
	/*
	=============================
		Given an array of categories data, add the HTML to
		the filter box
	=============================
	*/

	let categories = (getJsonFromUrl()['categories'])

	if (categories == undefined) {
		$('#category_check').append(
			`
			<div class="form-check">
				<input class="form-check-input category_filter" type="checkbox" value="${data.categoryid}" id="category_filter_${data.categoryid}" checked>
				<label class="form-check-label" for="category_filter_${data.categoryid}">
					${data.category}
				</label>
			</div>
			`
		)
	} else {
		$('#category_check').append(
			`
			<div class="form-check">
				<input class="form-check-input category_filter" type="checkbox" value="${data.categoryid}" id="category_filter_${data.categoryid}" ${categories.indexOf(data.categoryid.toString()) > -1 ? "checked" : ""}>
				<label class="form-check-label" for="category_filter_${data.categoryid}">
					${data.category}
				</label>
			</div>
			`
		)
	}

}


function updateCategoryFilter() {
	/*
	=============================
		Returns a promoise chain to retrieve all
		categories from backend and display them.
	=============================
	*/

	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/category'
	}).then(response => {
		response.data.map(element => {
			addCategoryToFilter(element)
		})
	}).catch(err => {
		// console.log(err)
	}) 
}

function addBrandToFilter(data) {
	/*
	=============================
		Given an array of brand data, add the HTML to
		the filter box
	=============================
	*/

	let brands = (getJsonFromUrl()['brands'])

	if (brands == undefined) {
		$('#brand_check').append(
			`
			<div class="form-check">
				<input class="form-check-input brand_filter" type="checkbox" value="${data.brand}" id="brand_filter_${data.brand}" checked>
				<label class="form-check-label" for="brand_filter_${data.brand}">
					${data.brand}
				</label>
			</div>
			`
		)
	} else {
		$('#brand_check').append(
			`
			<div class="form-check">
				<input class="form-check-input brand_filter" type="checkbox" value="${data.brand}" id="brand_filter_${data.brand}" ${brands.indexOf(data.brand.toString()) > -1 ? "checked" : ""}>
				<label class="form-check-label" for="brand_filter_${data.brand}">
					${data.brand}
				</label>
			</div>
			`
		)
	}
}


function updateBrandFilter() {
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

		response.data.map(element => {
			addBrandToFilter(element)
		})
	}).catch(err => {
		// console.log(err)
	}) 
}

function addPromotionToFilter(data) {
	/*
	=============================
		Given data on promotions, display
		them in the filter box
	=============================
	*/
	
	// Add the "LIVE" tag to any promotions that are
	// currently active
	let start = (new Date(data.start)).getTime()
	let end = (new Date(data.end)).getTime()
	let live = ""
	if ((start <= Date.now()) && (Date.now() <= end)) {
		live = "<span class='badge bg-danger'>Live!</span>"
	}

	let promotions = (getJsonFromUrl()['promotions'])

	if (promotions == undefined) {
		$('#promotion_check').append(
			`
			<div class="form-check">
				<input class="form-check-input promotion_filter" type="checkbox" value="${data.promotionid}" id="promotion_filter_${data.promotionid}">
				<label class="form-check-label" for="promotion_filter_${data.promotionid}">
					${data.promotionname} ${live}
				</label>
			</div>
			`
		)
	} else {
		$('#promotion_check').append(
			`
			<div class="form-check">
				<input class="form-check-input promotion_filter" type="checkbox" value="${data.promotionid}" id="promotion_filter_${data.promotionid}" ${promotions.indexOf(data.promotionid.toString()) > -1 ? "checked" : ""}>
				<label class="form-check-label" for="promotion_filter_${data.promotionid}">
					${data.promotionname} ${live}
				</label>
			</div>
			`
		)
	}
}

function updatePromotionFilter() {
	/*
	=============================
		Returns a promoise chain to retrieve all
		promotions from backend and display them.
	=============================
	*/
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/promotion'
	}).then(response => {
		response.data.map(element => {
			addPromotionToFilter(element)
		})
	}).catch(err => {
		// console.log(err)
	}) 
}


function processPromotionHTML(detailed_product_info, promotion_info_array) {
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



async function produceHTMLOfProduct(detailed_product_info, promotion_info_array) {
	let {priceHTML, promotionname} = processPromotionHTML(detailed_product_info, promotion_info_array)
	let imageBase64 = await loadImage(detailed_product_info.productid);
	return (
		`
			<div class="col-md-4 col-sm-6" style="float: left; width: 30vh;">
				<div class="product_box w-100 h-100" style="float: left;">
					<a class="w-100" href="/product/${detailed_product_info.productid}" style="text-decoration: none;">
						<div class="card w-100 h-100" style="position: relative; border-radius: 0; border: 0;">
							<ul class="list-group">
								<div class="list-group-item" style="border-bottom: 0;">
									<div style="position: absolute; top: 5%; right: 5%">
										<span class="promotion_badge badge bg-danger">${promotionname}</span>
									</div>
									<img src="${imageBase64}" class="card-img-top" alt="productimg" style="object-fit:cover;" height=300>
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
												${priceHTML}
											</div>
										</div>
									</div>
								</div>
							</ul>
						</div>
					</a>
				</div>
			</div>
		`
	)
}

function displayProducts(data) {
	let productCounter = 0;
	let productResultObject = {}
	data.forEach(async (basic_product_info) => {
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
		if (productCounter == data.length) {
			const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
			$('#product_container').html(
				(Object.values(sortObject(productResultObject))).join('')
			)
			$('#loading_spinner').addClass('visually-hidden')
		}
	})
}

function displayProductError() {
	$('#product_container').html(
		`
		<div class="w-100 d-flex justify-content-center align-items-center">
			<div class="display-5">
				No results found.
			</div>
		</div>
		`
	)
	$('#loading_spinner').addClass('visually-hidden')
}

function updateAccountDropdown() {
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `/home/partial/${localStorage.getItem('role')}`
	}).then(response => {
		$('#account_dropdown').html(
			response.data
		)
	}).catch(err => {
		// console.log(err)
	})
}

function getJsonFromUrl() {
	let url = location.search;
	let query = url.substr(1);
	let result = {};
	query.split("&").forEach(function(part) {
		let item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

async function runSearch() {
	let urlQuery = getJsonFromUrl()

	if (Object.keys(urlQuery).length == 1) {
		$('#search_button').click()
	}

	// console.log(Object.keys(urlQuery).length)

	// console.log("PAGE", urlQuery['page'])

	await axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: 'http://localhost:8081/api/search',
		params: {
			query: urlQuery['query'],
			categories: urlQuery['categories'],
			promotions: urlQuery['promotions'],
			brands: urlQuery['brands'],
			page: urlQuery['page']
		}
	}).then(response => {
		// console.log(response.data)
		displayProducts(response.data)
	}).catch(err => {
		// console.log(err)
		displayProductError()
	})
}

async function updateQuery() {
	let urlQuery = getJsonFromUrl()
	$('#search_input').val(urlQuery['query'])
}

async function updatePagination() {
	let urlQuery = getJsonFromUrl()
	$('#pagination').empty()
	let min_number = Math.max(1, parseInt(urlQuery['page']) - 2)
	let max_number = min_number + 2;
	for (let page_number = min_number; page_number <= max_number; page_number++) {
		let paginationURL = `/search?query=${urlQuery['query']}&categories=${urlQuery['categories']}&promotions=${urlQuery['promotions']}&brands=${urlQuery['brands']}&page=${page_number}`
		await axios({
			method: 'get',
			url: `http://localhost:8081/api${paginationURL}`,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('authtoken')
			}
		}).then(response => {
			$('#pagination').append(
				`
					<li class="page-item ${page_number == urlQuery['page'] ? "active" : ""}"><a class="page-link" href="${paginationURL}">${page_number}</a></li>
				`
			)
		}).catch(err => {
			if (err.response.status == 404) {
				// $('#pagination').append(
				// 	`
				// 		<li class="page-item disabled"><a class="page-link" href="${paginationURL}">${page_number}</a></li>
				// 	`
				// )
			}
		})
	}
}


async function init() {
	try {
		await validateToken()
		await Promise.all(
			[updateCategoryFilter(), updatePromotionFilter(), updateBrandFilter(), updateAccountDropdown(), updateQuery()]
		)

		await setupLogoutButton()

		await updatePagination()

		$('#search_button').on('click', async(event) => {
			event.preventDefault()

			$('#loading_spinner').removeClass('visually-hidden')

			let query = $('#search_input').val()

			// Read checked boxes from category filter
			let categoriesArray =
			($(".category_filter").map(function (){
				if ($(this).is(":checked")) {
					return $(this).val()
				}
			})).get()
			let categoriesString = ""
	
			categoriesArray.forEach(element => {
				categoriesString += element + ','
			})
	
			if (categoriesString.length > 0) {
				categoriesString = categoriesString.slice(0, categoriesString.length - 1)
			}
	

			// Read checked boxes from promotion filter
			let promotionsArray =
			($(".promotion_filter").map(function (){
				if ($(this).is(":checked")) {
					return $(this).val()
				}
			})).get()

			let promotionsString = ""
	
			promotionsArray.forEach(element => {
				promotionsString += element + ','
			})
	
			if (promotionsString.length > 0) {
				promotionsString = promotionsString.slice(0, promotionsString.length - 1)
			}

			// Read checked boxes from brands filter
			let brandsArray =
			($(".brand_filter").map(function (){
				if ($(this).is(":checked")) {
					return $(this).val()
				}
			})).get()
			let brandsString = ""
	
			brandsArray.forEach(element => {
				brandsString += element + ','
			})
	
			if (brandsString.length > 0) {
				brandsString = brandsString.slice(0, brandsString.length - 1)
			}

			window.location = `/search?query=${query}&categories=${categoriesString}&promotions=${promotionsString}&brands=${brandsString}&page=1`
		})

		await runSearch()

	} catch (err) {
		// console.log(err)
	}
}

init()