//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function displayOrderNumber() {
	let url_array = ((window.location).toString()).split('/')
	let orderid = parseInt(url_array[url_array.length - 1])
	// console.log("orderid:",orderid);
	if (!(isNaN(orderid))) {
		$('#orderid').text(
			` #${orderid}`
		)
	}
}

function getOrderId() {
	let split_array = (window.location).toString().split('/');
	return split_array[split_array.length - 1]
}

function getPurchasesOfOrder() {
	return axios({
		method: 'get',
		url: `http://localhost:8081/api/order/${getOrderId()}`,
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('authtoken')
		}
	}).then(response => {
		return response.data
	}).catch(err => {
		// console.log(err.response)
		if (err.response.data) {
			$('#order_page').html(
				`
				<div class="d-flex justify-content-center align-items-center w-100 h-100">
					<div class="display-3">
						${err.response.data.response}
					</div>
				</div>
				`
			)
		} else {
			bootstrapAlert("Something went wrong", 'alert-danger')
		}
		throw err
	})
}

async function getProductById(productid) {
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
		throw err
	})
}

async function displayOrderItems() {
	let purchases = await getPurchasesOfOrder() || []
	let purchase_info_array = await Promise.all(
		purchases.map(async(purchase_info) => {
			return (
				getProductById(purchase_info.fk_productid)
				.then((item) => {
					item[0].quantity = purchase_info.quantity
					return item[0]
				}).catch(err => {
					// console.log(err)
					// console.log('product', purchase_info.fk_productid, 'had an error')
				})
			)
		})
	)

	// console.log(purchase_info_array);
	let html_array = await Promise.all(
		purchase_info_array.map(item => {
			if (item == undefined) {
				return (
					`
						<div class="row container" style="min-height: 10vh;">
							<div class="col-4 h-100 d-flex justify-content-center align-items-center" style="min-height: 10vh;">
								<img src="/" alt="deleted_product" style="object-fit: cover; width: 20vh; height: 20vh;"/>
							</div>
							<div class="col-5 h-100" style="min-height: 10vh;">
								<p class="d-1 text-center" style="font-size: 1.5rem; max-width: 100%; text-align: center;">
									Deleted product
								</p>
							</div>
							<div class="col-3 d-flex justify-content-center align-items-center" style="min-height: 10vh;">
								<div class="display-5" style="font-size: 1.5rem">
								</div>
							</div>
						</div>
						<hr />
					`
				)
			} else {
				return loadImage(item.productid)
				.then(imageBase64 => {
					return (
						`
							<div class="row container" style="min-height: 10vh;">
								<div class="col-4 h-100 d-flex justify-content-center align-items-center" style="min-height: 10vh;">
									<img src="${imageBase64}" style="object-fit: cover; width: 20vh; height: 20vh;"/>
								</div>
								<div class="col-5 h-100" style="min-height: 10vh;">
									<p class="d-1 text-center" style="font-size: 1.5rem; max-width: 100%; text-align: center;">
										${item.name}
									</p>
								</div>
								<div class="col-3 d-flex justify-content-center align-items-center" style="min-height: 10vh;">
									<div class="display-5" style="font-size: 1.5rem">
										Quantity: <span>${item.quantity}</span>
									</div>
								</div>
							</div>
							<hr />
						`
					)
				}).catch(err => {
					// console.log(err)
				})
			}
		})
	)

	// console.log(html_array)

	html_array.forEach(ele => {
		$('#item_container').append(ele)
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

async function init() {
	try {
		await validateToken()
		displayOrderNumber()
		displayOrderItems()
	} catch (err) {
		// console.log(err)
	}
}
	
init()