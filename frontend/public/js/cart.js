//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

//===============================
// 	This file deals with operations regarding
//  the card. NOTE, a div with id #cart has to
//	be made under the HTML body element for this
// 	to work.
//===============================

function validateCart() {
	/**
	 * Read and validate the cart.
	 * If any errors are found with the cart,
	 * remove the errors and overwrite the
	 * now 'validated' cart back into local storage.
	 * 
	 * Return a dictionary, containing
	 * <key>
	 * 	- productid
	 * <value>
	 * 	- quantity
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

	writeCartToStorage(product_cart_dictionary)

	return product_cart_dictionary
}

function writeCartToStorage(product_cart_dictionary) {
	/**
	 * Given a dictionary containing
	 * <key>
	 * 	- product id
	 * <value>
	 * 	- product quantity
	 * 
	 * Encode the dictionary into a string,
	 *	 <productid>=<product_quantity>,<productid2>=<product_quantity2>,...
	 * and store into local storage.
	 */

	let cart_array = []

	Object.keys(product_cart_dictionary).forEach(productid => {
		cart_array.push(`${productid}=${product_cart_dictionary[productid]}`)
	})

	localStorage.setItem('cart', cart_array.join(","))
}

function addItemToCart(productid, quantity) {
	/**
	 * Given a productid and quantity of that productid, add that item
	 * to cart. 
	 * 
	 * This function handles potential duplication errors.
	 */
	let cart = validateCart()

	if (Object.keys(cart).indexOf(productid) > -1) {
		cart[productid] += quantity
	} else {
		cart[productid] = quantity
	}

	writeCartToStorage(cart)

	updateCartHtml()
}


function processPromotionCart(detailed_product_info) {
	/**
	 * Given a dictionary containing product information, send to
	 * backend server and determine if there are any promotions
	 * that are active for this product. 
	 * 
	 * If there are active promotions, return the HTML
	 * of the strikethrough price, along with the name
	 * start and end date of the active promotion.
	 */
	let priceHTML = `$<span>${detailed_product_info.price}</span>`
	return axios({
		method: 'get',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		},
		url: `http://localhost:8081/api/product/${detailed_product_info.productid}/promotion`
	}).then(response => {

		let promotionname = ""
		let promotionstart = ""
		let promotionend = ""

		let promotion_info_array = response.data || []

		// Checking for active promotion
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

		return {priceHTML, promotionname, promotionstart, promotionend}
	}).catch(err => {
		// console.log(err.response)
		return {priceHTML}
	})
}

async function updateCartHtml() {
	/**
	 * This function is run to update the cart modal that
	 * is displayed to the user.
	 */
	$('#cart_body').html('')

	let cart = validateCart()

	let product_item_array = localStorage.getItem('cart').split(',')
	if (product_item_array.length == 0) {

	} else {
		let product_info_array = await Promise.all(
			product_item_array.map(async(product_string) => {
				let [productid, count] = product_string.split('=')
				return await axios({
					method: 'get',
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('authtoken')
					},
					url: `http://localhost:8081/api/product/${productid}`
				}).then(response => {
					let product_info = response.data[0]
					return product_info
				}).catch(err => {
					// console.log(err)
					return undefined
				})
			})
		)

		let productCount = 0;
		await Promise.all(
			product_info_array.map(async (product) => {
				if (product != undefined) {
					let {priceHTML} = await processPromotionCart(product)

					let imageBase64 = await loadImage(product.productid)
					$('#cart_body').append(
						`
							<div class="row container" style="min-height: 10vh;">
								<div class="col-2 h-100 d-flex justify-content-center align-items-center" style="min-height: 10vh;">
									<img src="${imageBase64}" width=100 height=100 style="object-fit: cover;"/>
								</div>
								<div class="col-5 h-100" style="min-height: 10vh;">
									<p class="d-1 text-truncate" style="font-size: 1.5rem; max-width: 100%">
										${product.name}
									</p>
									<p class="text-muted d-1" style="font-size: 1.3rem;">
										${priceHTML}
									</p>
								</div>
								<div class="col-3 d-flex justify-content-center align-items-center" style="min-height: 10vh;">
									<div class="display-5" style="font-size: 1.5rem">
										Quantity: <span>${cart[product.productid]}</span>
									</div>
								</div>
								<div class="col-2 d-flex justify-content-end align-items-center" style="min-height: 10vh;">
									<div>
										<button class="btn btn-danger product_remove_button" data-target-product="${product.productid}">
											Remove
										</button>
									</div>
								</div>
							</div>
							<hr />
						`
					)

					productCount++;

					$('.product_remove_button').on('click', (event) => {

						event.stopPropagation()
						event.stopImmediatePropagation()

						let cart = validateCart()

						cart[$(event.target).attr('data-target-product')] = 0


						writeCartToStorage(cart)

						updateCartHtml()
					})
				}
			})
		)

		if (productCount == 0) {
			$('#cart_body').html(
				`
				<div class="display-5" style="font-size: 1.5rem;">
					Your cart is empty.
				</div>
				`
			)
		}

	}
}


function initCart() {
	/**
	 * Initialise the cart.
	 * 
	 */
	$('#cart').html(
		`
		<div class="modal" tabindex="-1" id="cart_modal">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Cart</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div id="cart_body" class="modal-body">
					</div>
					<div class="modal-footer">
						<a href="/checkout"><button type="button" class="btn btn-primary">Checkout</button></a>
					</div>
				</div>
			</div>
		</div>
		`
	)
	if (localStorage.getItem('cart') == undefined) {
		localStorage.setItem('cart', '')
	}

	let myModal = document.getElementById('cart_modal')

	myModal.addEventListener('show.bs.modal', function(event) {
		updateCartHtml()
	})

	$('#cart_button').on('click', () => {
		let myModal = new bootstrap.Modal(document.getElementById('cart_modal'))
		myModal.show()
	})

}

initCart()