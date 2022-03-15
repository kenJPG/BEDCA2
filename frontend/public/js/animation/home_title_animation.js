//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

var animationDone = false

function fadeInCreate(delay, duration = 150, speed) {
	const observer = new IntersectionObserver(function
		(entries, observer) {
			entries.forEach(element => {

				// Check if the element is intersecting with the viewport
				if (element.isIntersecting) {

					// If so, setTimeout the fadeIn function by $delay and pass
					// parameters $element and $duration
					setTimeout(function() {fadeIn(element, duration, speed);}, delay);
				}
			});
		}
	);
	return observer;
}

// Fade In function changes the opacity to 1 and makes the transition smooth
function fadeIn(element, duration, speed = "cubic-bezier(0, 0.07, 0, 0.97)") {
	element.target.style.opacity = 1;
	animationDone = true
	element.target.style.transition = `opacity ${duration}ms ${speed}`;
}

function fadeOutCreate(delay, duration = 150) {
	const observer = new IntersectionObserver(function
		(entries, observer) {
			entries.forEach(element => {

				// Check if the element is intersecting with the viewport
				if (element.isIntersecting) {

					// If so, setTimeout the fadeIn function by $delay and pass
					// parameters $element and $duration
					setTimeout(function() {fadeOut(element, duration);}, delay);
				}
			});
		}
	);
	return observer;
}

function fadeOut(element, duration) {
	element.target.style.opacity = 0;
	element.target.style.transition = `opacity ${duration}ms cubic-bezier( 0, 0.07, 0, 0.97 )`;
}

function moveCreate(delay) {
	const observer = new IntersectionObserver(function
		(entries, observer) {
			entries.forEach(element => {

				// Check if the element is intersecting with the viewport
				if (element.isIntersecting) {

					// If so, setTimeout the fadeIn function by $delay and pass
					// parameters $element and $duration
					setTimeout(function() {move(element);}, delay);
				}
			});
		}
	);
	return observer;
}

function move(element) {
	element.target.classList.add('animate');
	element.target.classList.remove('shiftLeft')
}

function shiftLeft(element) {
	// console.log("elemnt:",element);
	element.classList.add('shiftLeft')
}


function animationInit() {

	fadeInCreate(400, 800).observe(document.querySelector('#title_text'))
	fadeInCreate(400, 800).observe(document.querySelector('#title_motto'))
	setTimeout(function() {
		shiftLeft(document.querySelector('#title_text_container'));
	}, 400)
	fadeInCreate(400, 800, "linear").observe(document.querySelector('#title_img'))
}