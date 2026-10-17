var headerElement = null;
var navbarTogglerBtn = null;
var offcanvasElement = null;
var navItems = null;
var navControlContainer = null;

let menuIcon = `	
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
`;

let closeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
`;

document.addEventListener("DOMContentLoaded", function(){
	headerElement = document.querySelector("header");
	navbarTogglerBtn = document.querySelector(".navbar-toggler");
	navbarTogglerBtn.innerHTML = menuIcon;
	offcanvasElement = document.querySelector(".offcanvas");
	navItems = document.querySelectorAll(".nav-item");
	navControlContainer = document.getElementById("nav-control-container");
	var myOffcanvas = document.getElementById('offcanvasNavbar');
	var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
	navbarTogglerBtn.addEventListener('click', function() {
		toggleNavBtn();
	});
	
	navItems.forEach((navItem) => {
		var navLink = navItem.querySelector("a");
		if (navLink.hash || navItem.innerText === "Home") {
			navItem.addEventListener("click", () => {
				toggleNavBtn();
				bsOffcanvas.hide();
			});
		}
	});
	
	window.addEventListener('resize', trackScreenWidth);
	setActiveItem();
});

function toggleNavBtn() {
	if (offcanvasElement.classList.contains('show')) {
		headerElement.classList.remove("headerBorderBottom");
		navbarTogglerBtn.innerHTML = menuIcon;
	} else {
		headerElement.classList.add("headerBorderBottom");
		navbarTogglerBtn.innerHTML = closeIcon;
	}
}

function trackScreenWidth() {
	let screenWidth = window.innerWidth;
	if (screenWidth > 991) {
		headerElement.classList.remove("headerBorderBottom");
		offcanvasElement.classList.remove('show');
	}
}

function setActiveItem() {
	const currentPath = window.location.pathname;
	navItems.forEach(item => {
		const link = item.querySelector('a');
		if (link && link.getAttribute('href') === currentPath) {
			item.classList.add('active');
		}
	});
}

function setNavbarHeightToCSSVariable() {
	if (headerElement) {
		document.documentElement.style.setProperty('--header-height', headerElement.offsetHeight + 'px');
	}
}

