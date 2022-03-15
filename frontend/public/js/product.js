//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

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

function getProductID() {
	/**
	 * Get the productid from the URL
	 */
	let split_path = String(window.location.pathname).split('/');
	return split_path[split_path.length - 1]
}

function getProductDetails(productid) {
	/**
	 * Get product details given a productid
	 */
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `http://localhost:8081/api/product/${productid}`
	})
	.then(response => {
		// console.log(response)
		return response.data[0]
	}).catch(err => {
		// console.log(err.response)
	})
}

function processPromotion(detailed_product_info, productid) {
	let priceHTML = `$<span>${detailed_product_info.price}</span>`
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `http://localhost:8081/api/product/${productid}/promotion`
	}).then(response => {

		let promotionname = ""
		let promotionstart = ""
		let promotionend = ""

		let promotion_info_array = response.data || []

		promotion_info_array.forEach(promotion_info => {
			let promotion_start = (new Date(promotion_info.start)).getTime()
			let promotion_end = (new Date(promotion_info.end)).getTime()

			let discounted_price = detailed_product_info.price

			if ((promotion_start <= Date.now()) && (Date.now() <= promotion_end)) {
				discounted_price *= 1 - (parseFloat(promotion_info.product_discount) / 100)
				promotionname = promotion_info.promotionname
				promotionstart = promotion_start
				promotionend = promotion_end
				priceHTML = `<span style="color: red; text-decoration:line-through;">$${detailed_product_info.price}</span> $${discounted_price.toFixed(2)}`
			}
			promotion_info.promotionname
		})
		// console.log(priceHTML, promotionname, promotionstart, promotionend)
		return {priceHTML, promotionname, promotionstart, promotionend}
	}).catch(err => {
		// console.log(err.response)
		return {priceHTML}
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


async function displayProductDetails(productid) {
	let result = await getProductDetails(productid);
	if (result === undefined) {
		$('#product_page').html(
			`
			<div class="d-flex justify-content-center align-items-center h-100 w-100" style="padding-top: 10vh">
				<div class="display-3">
					Product not found
				</div>
			</div>
			`
		)
		$('#reviews_page').empty()
	} else {
		let product_promotion_info = await processPromotion(result, productid);

		$('#product_name').text(
			result.name
		)
		$('#product_category').text(
			result.categoryname
		)
		$('#product_brand').text(
			result.brand
		)
		$('#product_price').html(
			product_promotion_info.priceHTML
		)
		$('#product_description').text(
			result.description
		)

		$('#product_sale_container').text(
			product_promotion_info.promotionname
		)

		let rating_text = (parseFloat(result.rating)).toFixed(2)
		if (isNaN(rating_text)) {
			rating_text = "No ratings"
		}
		$('#product_rating').html(
			`${getStarsFromRating(result.rating)}<span class="lead fw-normal mx-2">${rating_text}</span>`
		)

		let imageBase64 = await loadImage(productid)
		$('#product_image').attr('src', imageBase64)
	}
}

function postReview(text, rating) {
	return axios({
		method: 'post',
		url: `http://localhost:8081/api/product/${getProductID()}/reviews`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		data: {
			rating: rating,
			review_content: text
		}
	}).then(response => {
		bootstrapAlert('Review posted!', 'alert-success')
		displayReviews(getProductID())
	}).catch(err => {
		// console.log(err.response)
		if (err.response.data) {
			bootstrapAlert(err.response.data.response, 'alert-danger')
		}
	})
}

function setupPostReviewButton() {
	if (localStorage.getItem('role') === "Customer") {
		$('#review_post').on('click', async(event) => {
			let review_post_text = $('#review_post_text').val()
			await postReview(review_post_text, $('#review_post_rating').attr('data-rating'))
		})
	} else {
		$('#review_post').addClass('d-none')
		$('#review_post_text').prop('disabled', true)
		$('#review_post_text').attr('placeholder', 'You must be a customer to leave a review.')
	}
}

function updateStarRating() {
	let rating = $('#review_post_rating').attr('data-rating')
	for (let i = 0; i < 5; i++) {
		let tempStarDOM = $('.review_post_star')[i]
		if ($(tempStarDOM).attr('data-starid') <= rating) {
			$(tempStarDOM).css({'color': '#EEBD01'})
		} else {
			$(tempStarDOM).css({'color': '#DDDDDD'})
		}
	}
}

function setupStarRating() {
	if (localStorage.getItem('role') === "Customer") {
		$('#review_post_rating').on('click', '.review_post_star', (event) => {
			let rating = $(event.target).attr('data-starid')
			$('#review_post_rating').attr('data-rating', rating)
			updateStarRating()
		})
	} else {
		$('.review_post_star').css({cursor: 'default'})
	}
}

function getReviews(productid) {
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `http://localhost:8081/api/product/${productid}/reviews`
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err.response)
		throw err
	})
}

async function displayReviews(productid) {
	/**
	 * Display all the reviews, given the productid
	 */
	try {

		let review_array = await getReviews(productid);

		$('#review_content').empty()

		if (review_array.length == 0) {
			$('#review_content').html(
				`
				<div class="d-3" style="font-size: 2rem;">
					No reviews found.
				</div>
				`
			)
		} else {
			review_array.forEach(review => {
				$('#review_content').append(
					`
					<div class="bg-light">
						<div class="review_box list-group-item" style="min-height: 20vh; width: 50vw;">
							<div class="review_header d-flex align-items-center w-100 h-100 pt-3 pb-4" style="max-height: 5vh;">
								<div>
									<span class="review_name">
									</span>
									|
									<span class="review_time">
									</span>
								</div>
							</div>
							<div class="review_body">
								<div class="review_rating">
								</div>
								<div class="review_text">
								</div>
							</div>
						</div>
					</div>
					`
				)
				$('.review_name').last().text(
					review.username
				)
				$('.review_time').last().text(
					review.created_at
				)
				$('.review_rating').last().html(
					getStarsFromRating(review.rating)
				)
				$('.review_text').last().text(
					review.review
				)
			})
		}

	} catch (err) {
		if (err.response.status === 404) {
			// console.log("No reviews found")
			$('#review_content').html(
				`
				<div class="bg-light">
					<div class="display-4" style="font-size: 1.3rem">
						There are no reviews for this product.
					</div>
				</div>
				`
			)
		} else {
			// console.log("Unable to load reviews")
		}
	}
}


async function init() {
	try {
		await validateToken()
		let productid = getProductID()

		await Promise.all(
			[updateAccountDropdown(), displayProductDetails(productid), displayReviews(productid)]
		)

		setupLogoutButton()

		setupStarRating()
		
		setupPostReviewButton()

		$('#add_to_cart_button').on('click', event => {
			try {
				addItemToCart(getProductID(), 1)
				bootstrapAlert(`<strong>${$('#product_name').html()}</strong> added to cart`, "alert-success")
			} catch (err) {
				bootstrapAlert("Item could not be added to cart", "alert-danger")
			}
		})

	} catch (err) {
		// console.log(err)
	}
}
	
init()