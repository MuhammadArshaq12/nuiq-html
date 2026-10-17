let verificationEmail;
function sendResetPasswordLink(){
    const email = document.getElementById("emailInput").value.trim();
    document.getElementById("error-text").innerHTML = "";
    if(email == ''){
        alert("Please fill all fields");
        return;
    }
    document.getElementById('emailInput').disabled = true;
    document.getElementById('sendLinkBtn').disabled = true;
    verificationEmail=email;
    handleEmailVerification('sendResetPasswordCode');

}

function handleEmailVerification(action='sendVerifyEmailCode'){
    let sendLinkBtn = document.getElementById('sendLinkBtn');
    let errorText = document.getElementById('error-text'); 
    const data = {
        email: verificationEmail,
        action: action
    };
    console.log(data);
    const isReset = action === 'sendResetPasswordCode';
    let verificationObject = {
        resendEndpoint: '/api/sendVerifyEmailLink.php',
        userID: sessionStorage.userId,
    };

    if(isReset){
        verificationObject.action= 'verifyResetPasswordCode';
        verificationObject.resendAction = 'sendResetPasswordCode';
        verificationObject.verificationEndpoint= '/api/resetPassword.php';
        verificationObject.redirectUrl = '/login/reset/createNewPassword.php';
        sendLinkBtn.innerText = 'Please wait...';
        verificationObject.evHeading = 'Password Recovery';
    }
    else{
        verificationObject.verificationEndpoint = '/api/verifyEmail.php';
        verificationObject.resendAction = 'sendVerifyEmailCode';
        verificationObject.redirectUrl  = '/login/reset/';
        verificationObject.evHeading = 'Email Verification';
        initEmailVerification(verificationObject);
    }
    jQuery.ajax({
        type: "POST",
        url: '/api/sendVerifyEmailLink.php',
        data: data,

        dataType: 'json',
        success: function (res, status, req) {
            if(res.success){
                console.log(res);
                sendLinkBtn.innerText = 'Resend';
                if(isReset){
                    initEmailVerification(verificationObject);
                }
            }
            else {
                console.log("failed");
                    console.log(res);
                    errorText.innerHTML = res.error_message;
                    sendLinkBtn.innerText = 'failed';
                    sendLinkBtn.style.backgroundColor = 'red';

                    setTimeout(function(){

                        if(res.error_message.includes("Your email is not verified")){
                            sendLinkBtn.style.backgroundColor = '';
                        }
                        else{
                            sendLinkBtn.disabled = false;
                            sendLinkBtn.innerText = 'Retry';
                            sendLinkBtn.style.backgroundColor = 'green'
                        }


                    }, 3000);
            }
        },
        error: function (err) {
            console.log("failed");
            console.error(err);
            errorText.innerHTML = err;
            sendLinkBtn.innerText = 'Retry';

        }
    });

}
function initEmailVerification(verificationObject){
    const emailVerification = new EmailVerificationLibrary(verificationObject);
    emailVerification.showOverlay(verificationEmail);
}
function createNewPassword(){
    const password = document.getElementById("passwordInput").value.trim();
    const confirmPassword = document.getElementById("confirmPasswordInput").value.trim();
    if(password == "" || confirmPassword == ""){
        alert("Please fill all fields");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }
    document.querySelector('button[type="submit"]').innerHTML = "Please wait...";
    jQuery.ajax({
        type: "POST",
        url: '/api/resetPassword.php',
        data: {
            action: 'createNewPassword',
            password: password,
            confirmPassword: confirmPassword
        },
        dataType: 'json',
        success: function (res, status, req) {
            if(res.success){
                localStorage.setItem('userId', res.user_id);
                localStorage.setItem('userName', res.username.trim());
                Swal.fire({
					title: "Password Reset Successfully",
					text: "Your password has been reset successfully. Please login with your new password.",
					icon: "info",
					confirmButtonText: "OK"
				}).then((result) => {
					window.location.href = "/login/";
				});
            }
            else {
                document.getElementById("error-text").innerHTML = res.error_message;
                
            }
        },
        error: function (err) {
            console.error(err);
        }
    });
}
