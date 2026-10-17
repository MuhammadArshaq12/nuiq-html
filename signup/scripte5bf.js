
const urlParams = new URLSearchParams(window.location.search);
let signupBtn = document.getElementById('sign-up');
var isRequestProcessing = false;
var verificationEmail;  // Define verificationEmail here

const queryString = window.location.search;

function signupUser(type) {
	var data;
	if(type == 'Enterprise') {
		data = {
			org: document.getElementById("orgInput").value.trim(),
			key: document.getElementById("keyInput").value.trim(),
			perUser: document.getElementById("perUser").value
		};
	} else {
		var name = document.getElementById("nameInput").value.trim();
		var email = document.getElementById("emailInput").value.trim();
		verificationEmail = email; // Assign email to verificationEmail here

		var phone = document.getElementById("phoneInput").value.trim();
		var el = document.getElementById("orgInput");
		var org = el ? el.value.trim() : '';
		el = document.getElementById("urlInput")
		var url = el ? el.value.trim() : '';
		data = {
			name: name,
			email: email,
			phone: phone,
			org: org,
			url: url,
			subType: type,
			isCoach: (queryString == '?reason=coach') ? 1 : 0
		};

		switch(type) {
			case 'EHR':
				var url = '../api/signupEHR.html';
				data.maxUsers = document.getElementById("numWeeks").value;
				break;
			case 'Comp':
				var url = '../api/signupComp.html';
				data.numWeeks = document.getElementById("numWeeks").value;
				break;
			default:
				var url = '../api/signup.html';
				var password = document.getElementById("passwordInput").value;
				let confirmPassword = document.getElementById("cPasswordInput").value;

				if (name == "" || email == "" || password == "") {
					alert("Please fill all fields");
					return;
				}
/*				if (/^[0-9+\-\s()]*$/gi.test(phone) == false) {
					alert("Please enter a valid phone number");
					return;
				}
*/
				if (password.includes(" ")) {
					alert("Password cannot contain spaces");
					return;
				}
				if (password.includes("'") || password.includes('"')) {
					alert("Password cannot contain quotes");
					return;
				}
				if (password != confirmPassword) {
					alert("Passwords do not match");
					return;
				}
				if (subKey > '') {
					var source = 'SubKey ' + subKey;
				} else {
					var source =  'None';
/*					if (!document.querySelector('input[name=hearSource]:checked')) {
						document.getElementById("error-text").innerText = "Please enter source";
						return;
					}

					var source = document.querySelector('input[name=hearSource]:checked').value;
					var otherSource = '';
					if (source == 'Other') {
						otherSource = document.getElementById('otherSource').value.trim();
						if (!otherSource) {
							document.getElementById("error-text").innerText = "Please enter source";
							return;
						}
						source = otherSource;
					}
*/				}
				data.password = password;
				data.subKey = subKey;
				data.signupSource = source;
				data.plan = plan;
				break;
		}
	}

	showLoadingIndicator(signupBtn); // showing loader only after validation.

	jQuery.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		success: function (res, status, req) {
			if (res.success) {
				if (res.manual) {
					var text = '';
					if(res.pw) {
						text += 'User Password: ' + res.pw + '<br>';
					}
					if(res.secret) {
						text += 'Key: ' + res.key + '<br>Secret: ' + res.secret + '<br>Signup URL: https://nuiq.com/signup/?sub=' + res.key;
					} else if(res.key) {
						text += 'Key: ' + res.key + '<br>Signup URL: https://nuiq.com/signup/?sub=' + res.key;
					}
					document.getElementById("result-text").innerHTML = text;
					resetBtnStatus(signupBtn, 'Sign Up');
				} else {
					/* localStorage.setItem('userId', res.user_id);
					localStorage.setItem('userName', username); */
					if (subKey > '') {
						window.location.href = "../notes/index.html";
						/* if(res.redirect_to_plan){
								window.location.href = "/plan";
						} else if(urlParams.has('redirect_to')){
								window.location.href = urlParams.get('redirect_to'); */
					} else {
						if (res.isCoach == 1) {
							localStorage.setItem('userId', res.user_id);
							localStorage.setItem('userName', res.username);
							resetBtnStatus(signupBtn, 'Sign Up');
							console.log('coach');
							window.location.href = "../coach/owner/index.html";
						} else if (res.emailVerified > 0) {
							window.location.href = "../plan/index.html";
							resetBtnStatus(signupBtn, 'Sign Up');
						} else {
							if(plan == 'Free') {
								var redirectUrl = '../notes/index.html';
							} else if(plan == 'Pro') {
								var redirectUrl = '../plan/index1f0f.html?pro';
							} else {
								var redirectUrl = '../plan/index.html';
							}

							// We already sent verification email during signup
							/* jQuery.ajax({
								type: "POST",
								url: '/api/sendVerifyEmailLink.php',
								data: { email: verificationEmail },
								dataType: 'json',
								success: function (res, status, req) {
								 if (res.success) {
									console.log(res);
								 } else {
									console.log("failed");
									console.log(res);
								 }
								},
								error: function (err) {
								 console.log("failed");
								 console.error(err);
								}
							}); */

							const emailVerification = new EmailVerificationLibrary({
								verificationEndpoint: '/api/verifyEmail.php',
								resendEndpoint: '/api/sendVerifyEmailLink.php',
								resendAction:'sendVerifyEmailCode',
								userID: res.user_id,
								redirectUrl: redirectUrl // Pass the redirect URL
							});

							emailVerification.showOverlay(res.email);
						}
					}
				}
			} else {
				document.getElementById("error-text").innerHTML = res.error_message;
				resetBtnStatus(signupBtn, 'Sign Up');
				scrollToWindowTop();
			}
		},
		error: function (err) {
			console.error(err);
			resetBtnStatus(signupBtn, 'Sign Up');
		}
	});
}

function parseGmail() {
	const commonEmails = ['yahoo', 'aol', 'msn', 'wanadoo', 'comcast', 'outlook', 'orange', 'free', 'live', 'gmx', 'web', 'yandex', 'libero', 'cox', 'uol', 'bol', 'verizon', 'facebook', 'att'];
	const commonDomains = ['facebook.com', 'linkedin.com', 'instagram.com'];
	const email = document.getElementById('emailInput').value
	const index = email.indexOf('@')
	if (index !== -1) {
		const domain = email.slice(index + 1, email.length)
		if (domain.indexOf('mail') === -1 && !commonEmails.includes(domain.slice(0, domain.length - 4)) && !commonDomains.includes(domain)) {
			document.getElementById('urlInput').value = domain
		} else {
			document.getElementById('urlInput').value = ''
		}
	}
}

function toggleSourceBox() {
	var sourceVal = document.querySelector('input[name=hearSource]:checked').value;
	if (sourceVal == 'Other') {
		document.getElementById('otherSourceBox').removeAttribute("hidden");
	} else {
		document.getElementById('otherSourceBox').setAttribute("hidden", true);
	}
}
