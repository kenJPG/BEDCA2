function fadeInProductCreate(delay, duration = 150, speed) {
	const observer = new IntersectionObserver(function
		(entries, observer) {
			entries.forEach(element => {

				// Check if the element is intersecting with the viewport
				if (element.isIntersecting) {

					// If so, setTimeout the fadeIn function by $delay and pass
					// parameters $element and $duration
					setTimeout(function() {fadeInProduct(element, duration, speed);}, delay);
				}
			});
		}
	);
	return observer;
}

// Fade In function changes the opacity to 1 and makes the transition smooth
function fadeInProduct(element, duration, speed = "cubic-bezier(0, 0.07, 0, 0.97)") {
	element.target.style.opacity = 1;
	element.target.style.transition = `opacity ${duration}ms ${speed}`;
}

var clickedSearchBar = false

async function init() {

	fadeInProductCreate(300, 1300).observe(document.querySelector('#product_background_image'))

	fadeInProductCreate(500, 800).observe(document.querySelector('#search-bar'))

	$(document).on('click', '#search-bar', function(event) {
		setTimeout(() => {
			clickedSearchBar = true
		}, 100)
		$(this).css('box-shadow', '0px 10px 11px -2px rgba(0,0,0,0.75)')
		$(this).css('margin-bottom', '1vh')
		$(this).css('transition', 'box-shadow 0.2s cubic-bezier(0, 0.07, 0, 0.97), margin-bottom 0.2s ease-out')
	})

	$(document).on('click', ':not(#search-bar)', function(event) {
		if (clickedSearchBar) {
			clickedSearchBar = false 
			$('#search-bar').css('box-shadow', 'none')
			$('#search-bar').css('margin-bottom', '0')
			$(this).css('transition', 'all 0.2s cubic-bezier(0, 0.07, 0, 0.97), margin-bottom 0.2s ease-in')
		}
	})
}

init()