var contactToken = '';

function generateToken() {
	jQuery.ajax({
		type: "POST",
		url: '/api/generateToken.php',
		data: {},
		dataType: 'json',
		success: function (res, status, req) {
			contactToken = res.token;
			// this token will expire after 24 hours. so set a timer to regenerate token after 23 hours
			setTimeout(generateToken, 82800000);
		},
		error: function (err) {
			console.error(err);
		}
	});
}
generateToken(); // Calling method to generate new token

function submitContactUsForm() {
	const name = document.getElementById('contactNameInput').value.trim();
	const email = document.getElementById('contactEmailInput').value.trim();
	const phone = document.getElementById('contactPhoneInput').value.trim();
	const company = document.getElementById('contactCompanyInput').value.trim();
	const ehr = document.getElementById('contactEhrInput').value.trim();
	const message = document.getElementById('contactMessageInput').value.trim();

	if (name == '' || email == '') {
		alert('Please fill all the required fields');
		return;
	}

	/* var verifyCaptcha = (grecaptcha.getResponse()) ? true : false;
	if(!verifyCaptcha){
		alert('Please verify reCAPTCHA.');
		return;
	} */

	document.getElementById('contactUsBtn').disabled = true;
	jQuery.ajax({
		type: "POST",
		url: '/api/sendContactEmail.php',
		data: {
			name: name,
			email: email,
			phone: phone,
			company: company,
			ehr: ehr,
			message: message,
			// verifyCaptcha : verifyCaptcha,
			token: contactToken
		},
		dataType: 'json',
		success: function (res, status, req) {
			if (res.success) {
				window.location = "/thanks/";
			}
			else {
				Swal.fire({
					title: "Error",
					text: res.error_message,
					icon: "error",
					confirmButtonText: "OK"
				});				
			}
		},
		error: function (err) {
			console.error(err);
		},
		complete: function () {
			document.getElementById('contactUsBtn').disabled = false;
		}
	});
}