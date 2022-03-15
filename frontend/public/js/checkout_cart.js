//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function validateCart() {
	/**
	 * Identical function to validateCart in cart.js.
	 * 
	 * However, it does not write the validated function 
	 * to the localstorage, instead only returning the
	 * dictionary of the cart.
	 */
	let split_array = localStorage.getItem('cart').split(',')
	let product_cart_dictionary = {}
	split_array.forEach(keypair => {
		let key_value_array = keypair.split('=')
		if (key_value_array.length == 2) {

			let product_id = parseInt(key_value_array[0])
			let product_count = parseInt(key_value_array[1])

			if (!(isNaN(product_id) || isNaN(product_count))) {
				if (product_count != 0) {
					product_cart_dictionary[product_id] = product_count
				}
			}
		}
	})

	return product_cart_dictionary
}

function getProductDetails(productid) {
	/**
	 * Given productid, return product details of
	 * that product.
	 */
	return axios({
		method: 'get',
		url: `http://localhost:8081/api/product/${productid}`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err)
	})
}

async function processDiscount(ele) {
	/**
	 * Given a product, determine the best
	 * discounted price across all promotions
	 * and apply it to the product.
	 */

	// Get data on all promotions
	let promotions = await axios({
		method: 'get',
		url: `http://localhost:8081/api/product/${ele.productid}/promotion`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		if (err.response.data) {
			if (err.response.data.code == 404) {
				;
			} else {
				// console.log(err)
			}
		}
	}) || []

	ele["discounted_price"] = ele.price // Contains the minimum discounted price

	if (promotions.length != 0) {

		let discount = 0;

		promotions.forEach(promotion => {

			let start = new Date(promotion.start)
			let end = new Date(promotion.end)

			if (start.getTime() <= Date.now() && Date.now() <= end.getTime()) {
				discount = Math.max(discount, promotion.product_discount)
			}
		})

		ele["discounted_price"] = ele.price * ((100 - discount) / 100)
	}

	// Update the object's discounted price and return the object
	return ele
}

async function getCartInfo() {
	/**
	 * Return detailed information about the cart,
	 * such as productname, etc... 
	 * 
	 * This is done by reading the cart using the function
	 * validateCart() then requesting product information through
	 * getProductDetails
	 * 
	 */
	let cart_count = validateCart()

	let product_detail_array = await Promise.all(
		(Object.keys(cart_count)).map(async(productid) => {
			return getProductDetails(productid)
		})
	)


	product_detail_array = await Promise.all(
		product_detail_array.map(async(ele) => {
			ele = ele[0]
			ele = await processDiscount(ele)
			return ele
		})
	)

	product_detail_array = product_detail_array.map((product_info) => {
		product_info['quantity'] = cart_count[product_info.productid]
		return product_info
	})

	return product_detail_array
}

var checkout_total = 0 // This variable stores the total checkout amount.

async function initCart() {
	/**
	 * Initialising the checkout cart
	 */

	// Get detailed information on all items in the cart
	let cart_info = await getCartInfo()

	$('#cart_items').empty()

	cart_info.forEach(item => {
		$('#cart_items').append(
		`
			<li class="list-group-item d-flex justify-content-between lh-sm">
				<div>
					<h6 class="product_name my-0"></h6>
					<small class="product_info text-muted"></small>
				</div>
				<span class="product_total text-muted">$12</span>
			</li>
		`
		)
		$('.product_name').last().text(
			item.name
		)
		$('.product_info').last().text(
			`$${item.discounted_price} x ${item.quantity}`
		)
		$('.product_total').last().text(
			`$${item.discounted_price * item.quantity}`
		)

		checkout_total += item.discounted_price * item.quantity
	})

	$('#checkout_total').text(`$${checkout_total.toFixed(2)}`)
}