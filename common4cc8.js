function uuidv4() {
	 return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	 );
}
function resetEHRTracking(){
	localStorage.removeItem('ehrName');
	localStorage.removeItem('formList');
	localStorage.removeItem('patientList');
	localStorage.removeItem('clinicianList');
	localStorage.removeItem('ehrSupportsGroupNotes');
	localStorage.removeItem('showEHR');
	localStorage.removeItem('ehrNeedsInit');
}
function signOut(){
	let clearAndRedirect = () => {
		sessionStorage.clear();
		localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		resetEHRTracking();
		window.location.href = '../index.html';
	}
	if(Swal && typeof Swal.fire == 'function'){
		let swalConfig = {
							title: "Are you sure?",
							text: "After Logging out, you will need to login again to use NuIQ.",
							icon: "warning",
							showCancelButton: true,
							confirmButtonText: 'Yes, log out!',
							cancelButtonText: 'Cancel',
							heightAuto: false,
							buttonsStyling: false,
							customClass: {
								confirmButton: 'btn btn-danger', 
								cancelButton: 'btn btn-secondary'
							},
						};
		if(typeof donotAllowRefresh != 'undefined' && typeof nuiqSession != 'undefined' && typeof nuiqSession?.recorder != 'undefined' && typeof nuiqSession.noteLogId != 'undefined'){
			if(donotAllowRefresh || nuiqSession?.recorder?.isRecording || nuiqSession.noteLogId){
				swalConfig.showDenyButton = true;
				swalConfig.denyButtonText = "Clear Session and Log Out";
				swalConfig.confirmButtonText = "Log Out";
				swalConfig.dangerMode = true;
				swalConfig.preDeny = () => "clear";
				swalConfig.customClass.denyButton = 'btn btn-primary';
			}
		}
		Swal.fire(swalConfig).then((result) => {
			if (result.isConfirmed) {
				clearAndRedirect();
			} else if (result.isDenied) {
				clearEverything();
				clearAndRedirect();
			}
		});
	}
	else {
		if(confirm("Are you sure you want to logout?")){
			clearAndRedirect();
		}
	}
}
function addButtonLog(buttonID, buttonAction ){
	if(!isUserLoggedIn){
		return;
	}
	jQuery.ajax({
		type: "POST",
		url: '/api/addButtonLog.php',
		data: {
			buttonID : buttonID,
			buttonAction : buttonAction,
		},
		dataType: 'json',
		success: function (res, status, req) {
			console.log(res);
		},
		error: function (err) {
			console.error(err);
		}
	 });
}

function showLoadingIndicator(btnId){
	 btnId.innerHTML =
	 `<div class="spinner-border spinner-border-sm" role="status">
		  <span class="sr-only"></span>
	 </div>`;
	 btnId.setAttribute('disabled', 'disabled');
}

function resetBtnStatus(btnId,initialState){
	 btnId.innerHTML = initialState;
	 btnId.removeAttribute('disabled');
}

function setUrlSearchParams(key, value) {
	const url = new URL(window.location);
	if (value == null || value == undefined) {
		// remove the key from the URL
		url.searchParams.delete(key);
	}
	else {
		url.searchParams.set(key, value);
	}
	history.pushState(null, '', url);
}

function getUrlSearchParams(key) {
  const url = new URL(window.location);
  return url.searchParams.get(key);
}
function scrollToWindowTop() {
  document.body.scrollTo({
		top: 0,
		behavior: 'smooth' // This makes the scroll smooth
  });
};
function getInitials(name){
  let initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}
function capitalizeFirstLetter(string) {
	 return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
function convertPHPdateToReadable(date){
	// First, ensure the date is in a format that's widely supported
	const formattedDate = date.replace(' ', 'T') + 'Z';

	// Create a new Date object
	const dateObj = new Date(formattedDate);

	// Check if the date is valid
	if (isNaN(dateObj.getTime())) {
	  return 'Invalid Date';
	}

	// Use Intl.DateTimeFormat for consistent formatting across browsers
	const options = {
	  year: 'numeric',
	  month: 'long',
	  day: 'numeric',
	  hour: '2-digit',
	  minute: '2-digit',
	  hour12: true
	};

	return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}
function removeTrailingNewlines(str) {
	if(typeof str !== 'string'){
		let errorMsg = "Error at removeTrailingNewlines method of common.js \n\n";
		let error = createError(errorMsg, {
			details : "Type of string(" + typeof str +"(" + str +")) is invalid",
			code : 'INVALID_PARAMETER',
			data : {
				type: typeof str,
				value: str
			}
		})
		reportError(error);
	}

	let strTxt = String(str);
	let resultStr = strTxt.replace(/[\n\r]+$/, '');
	return resultStr;
}
function removeLeadingNewlines(str) {
	return str.replace(/^\n\r/, '');
}
function escapeSpecialChars(str) {
	return str.replace(/['"\\]/g, '\\$&');
}
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) {
        return '';
    }

    const str = String(unsafe);

    // Comprehensive HTML escaping
    return str.replace(/[&<>"'/]/g, function(match) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return escapeMap[match];
    });

    /* return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;"); */
}
function validateAndFormatHexColor(input) {
	// Remove any leading '#' if present
	const cleanInput = input.replace(/^#/, '');

	// Regular expression to match valid hex color codes
	const hexRegex = /^([0-9A-Fa-f]{3}){1,2}$/;

	if (hexRegex.test(cleanInput)) {
		return `#${cleanInput}`;
	} else {
		return input;
	}
}
function formatSeconds(seconds) {
    // Handle invalid or negative input
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Round to integer seconds
    const totalSeconds = Math.floor(seconds);

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    // Create zero-padding helper function
    const pad = (num) => num.toString().padStart(2, '0');

    // Format the output based on hours
    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    } else {
        return `${pad(minutes)}:${pad(remainingSeconds)}`;
    }
}
function getCurrentEpochTime(){
	return Math.floor(Date.now() / 1000); // Current Epoch Time in seconds
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function getMonthName(monthIndex, mode = 'long'){
	let months = [
		{
			long : "january",
			short : 'jan'
		},
		{
			long : "february",
			short : "feb"
		},
		{
			long : "march",
			short : 'mar'
		},
		{
			long : "april",
			short : 'apr'
		},
		{
			long : "may",
			short : 'may'
		},
		{
			long : "june",
			short : 'jun'
		},
		{
			long : "july",
			short : 'jul'
		},
		{
			long : "august",
			short : 'aug'
		},
		{
			long : "september",
			short : 'sep'
		},
		{
			long : "october",
			short : 'oct'
		},
		{
			long : "november",
			short : 'nov'
		},
		{
			long : "december",
			short : 'dec'
		},
	];
	if(monthIndex >= 0 && monthIndex < 12){
		let month = months[monthIndex];
		if(mode == 'short'){
			return month.short;
		}
		else {
			return month.long;
		}
	}
	else{
		return null;
	}
}
function getVariableTrueValue(variable, defaultValue =''){
	if(variable != 'undefined' && variable != 'null' && variable > ''){
		return variable;
	}
	else {
		return defaultValue;
	}
}
// just to update versions.