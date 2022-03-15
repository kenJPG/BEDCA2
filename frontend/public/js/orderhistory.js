//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

function getAllOrders() {
	/**
	 * Return information on all orders
	 */
	return axios({
		method: 'get',
		url: 'http://localhost:8081/api/orders',
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

async function displayOrders() {
	$('#order_container').html('')
	let orders = await getAllOrders()
	if (orders.length == 0) {
		$('#order_container').html(
			`
			<div class="text-center lead" style="font-size: 1.5rem;">
				No orders found
			</div>
			`
		)
	} else {
		orders.forEach(order_info => {
			// console.log(order_info)
			$('#order_container').prepend(
				`
				<div class="card" style="width: 60%; min-height: 10vh;">
					<div class="card-body">
						<div class="d-flex justify-content-between align-items-center flex-wrap" style="min-height: 8vh;">
							<div class="col-2 lead d-flex flex-wrap justify-content-center">
								<strong class="order_number">
								</strong>
								<span class="order_date text-center" style="font-size: 0.9rem;"></span>
							</div>
							<div class="col-4 d-flex flex-wrap justify-content-center text-center">
								<div>
									<p><strong>Paid: $${order_info.total}</strong></p>
									<p class="order_card_info"></p>
								</div>
							</div>
							<div class="order_address_info col-4 d-flex flex-wrap justify-content-center">
							</div>
							<div class="col-2">
								<a href="/order/${order_info.orderid}">
									<div class="view_item_button btn btn-primary">
										View order
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				`
			)
			$('.order_date').first().text(
				`${(new Date(order_info.created_at)).toString()}`
			)
			$('.order_number').first().text(
				`Order #${order_info.orderid}`
			)
			$('.order_card_info').first().text(
				`************${order_info.last_card_digits}`
			)
			$('.order_address_info').first().html(
				`${order_info.address_name}<br />${order_info.address}<br />${order_info.address_postal}`
			)
		})
	}
}

async function setupOrderDisplay() {
	await displayOrders()
}

async function init() {
	try {
		await validateToken()

		authorizeCustomerToken()

		await setupOrderDisplay()

	} catch (err) {
		// console.log(err)
	}
}

init()