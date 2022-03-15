//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

var alertDisappear = 0;

function bootstrapAlert(message, color_class = 'alert-success', time = 4) {
	/**
	 * Display an alert. Default time of 4seconds.
	 * 
	 * For this to work, a div with id #alert_container has to be in the HTML
	 * as the child of the body element.
	 */
	alertDisappear = time
	$('#alert_container').html(
		`
		<div id="alert" style="top: 90vh; right: 5vw; position: fixed; z-index: 10;" class="alert alert-dismissible ${color_class} fade m-0 show" role="alert">
			<span id="alertText" style="text-align: right;">${message}</span>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
		`
	)
}

setInterval(() => {
	alertDisappear--
	if (alertDisappear == 0) {
		$('#alert_container').empty()
	}
}, 1000);