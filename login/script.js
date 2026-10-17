const currentRoomUid = new URL(window.location.href).searchParams.get("room");
const urlParams = new URLSearchParams(window.location.search);
let loginBtn = document.getElementById('login-btn');
let verificationEmail;
const queryString = window.location.search;

document.addEventListener('DOMContentLoaded', function() {  


  function loginUser(email, password, roomUid = currentRoomUid) {
	document.getElementById("error-text").innerHTML = "";
	if (!email) {
	  email = document.getElementById("emailInput").value.trim();
	}
	if (!password) {
	  password = document.getElementById("passwordInput").value.trim();
	}
	if (email == "" || password == "") {
	  alert("Please fill all fields");
	  return;
	}	
	showLoadingIndicator(loginBtn);
	jQuery.ajax({
	  type: "POST",
	  url: '/api/login.php',
	  data: {
		email: email,
		password: password,
		isCoach: (queryString == '?reason=coach') ? 1 : 0
	  },
	  dataType: 'json',
	  success: function (res, status, req) {
		sessionStorage.clear();
		if (res.success) {
		  localStorage.setItem('userId', res.user_id);       
		  localStorage.setItem('userName', res.username.trim());
		  if (res.defaultNoteIDs) {
			localStorage.selectedTabs = res.defaultNoteIDs;
		  }
		  resetEHRTracking();
		  // Handling redirections based on response
		  	if(res.is_coach == "1"){
				if(res.redirect_to){
					window.location.href = res.redirect_to;
				}
				else{
					window.location.href = "/coach/room/";
				}
			}
			else {
				if (res.errorCode == 'NOPLAN') {
					window.location.href = "/plan";
				} else if (urlParams.has("redirect_to")) {
					window.location.href = urlParams.get("redirect_to").replace('~','?');
				} else if (urlParams.has("room")) {
					window.location.href = "/coach/room/?room=" + urlParams.get("room");
				}
				else {
					window.location.href = "/notes/"; // go directly to notes
					resetBtnStatus(loginBtn, 'Login');
				}
			}
			/* else if(res.plan_expired){
					window.location.href = "/plan";
			} */
			/* else if(res.redirect_to){
					window.location.href = res.redirect_to;
			}
			else if(res.is_admin == "1" && !roomUid){
					window.location.href = "/admin";
			}
			else if((res.is_owner == "1" || res.is_moderator == "1") && !roomUid){
					window.location.href = "/therapist/";
			}
			else if(roomUid){
					window.location.href = "/room/?room=" + roomUid;
			} */ 
		} else {
		  if (res.email_not_found) {
			document.getElementById("emailInput").classList.add("is-invalid");
		  }
		  if (res.password_incorrect) {
			document.getElementById("passwordInput").classList.add("is-invalid");
		  }
		  document.getElementById("error-text").innerHTML = res.error_message;
		  verificationEmail = email;

		  resetBtnStatus(loginBtn, 'Login');

		}
	  },
	  error: function (err) {
		resetBtnStatus(loginBtn, 'Login');
		console.error(err);
	  }
	});
  }

  // Attach the login event to the login button
  loginBtn.addEventListener('click', function() {
	const email = document.getElementById('emailInput').value.trim();
	const password = document.getElementById('passwordInput').value.trim();
	loginUser(email, password);
  });
});
function handleEmailVerification(){
				const redirectUrl = '/plan/';
			  // Use emailVerification to show the overlay if needed
			  jQuery.ajax({
				type: "POST",
				url: '/api/sendVerifyEmailLink.php',
				data: {
					email: verificationEmail,
					action: 'sendVerifyEmailCode'
				},
				dataType: 'json',
				success: function (res, status, req) {
					if(res.success){
						console.log(res);
					}
					else {
						console.log("failed");
							console.log(res);
					}
				},
				error: function (err) {
					console.log("failed");
					console.error(err);
				}
			});
			const emailVerification = new EmailVerificationLibrary({
				verificationEndpoint: '/api/verifyEmail.php',
				resendEndpoint: '/api/sendVerifyEmailLink.php',
				resendAction:'sendVerifyEmailCode',
				userID: sessionStorage.userId,
				redirectUrl: redirectUrl
			  });
			
			emailVerification.showOverlay(verificationEmail);
			

}