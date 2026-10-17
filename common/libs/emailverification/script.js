(function (global) {
    const DEFAULTS = {
        overlaySelector: '.overlay',
        submitButtonSelector: '.submit-btn',
        resendButtonSelector: '.resend',
        overlayContainerSelector: '.email-verification-container',
        codeInputSelector: '.code-input input',
        verificationEndpoint: '/api/verifyEmail.php',
        action: null,
        resendEndpoint: '/api/sendVerifyEmailLink.php',
        resendAction: null,
        userID: null,
        redirectUrl: null,
        enableAutoSubmit: true,
        resendPopupSelector: '.resend-popup',
        countdownSelector: '.countdown',
        sendAgainButtonSelector: '.send-again-btn',
        didntReceiveSelector: '.didnt-receive',
		headingSelector: '.heading-ev',
		evHeading: `Email Verification`
    };

    function EmailVerificationLibrary(options) {
        const settings = { ...DEFAULTS, ...options };
        for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
                this[key] = settings[key];
            }
        }

        this.init();
        this.resendAttempts = 0;
        this.countdownTimer = null;
        this.isFirstResendClick = true;
    }

    EmailVerificationLibrary.prototype = {
        init: function () {
            this.setupCodeInputs();
            this.bindEvents();
            this.toggleSubmitButton();
            this.isSubmitting = false;
			this.updateHeading();
        },

		updateHeading: function (){
			let headingElement = document.querySelector(this.headingSelector);
			headingElement.innerHTML = this.evHeading;
		},

        focusNextInput: function (input) {
            const next = input.nextElementSibling;
            if (next && next.tagName === "INPUT") {
                next.focus();
            }
        },

        focusPreviousInput: function (input) {
            const previous = input.previousElementSibling;
            if (previous && previous.tagName === "INPUT") {
                previous.focus();
            }
        },

        handleCodeInput: function (event) {
            const input = event.target;
            const value = input.value;

            if (event.key === "Backspace") {
                if (value.length === 0) {
                    this.focusPreviousInput(input);
                }
            } else if (!isNaN(event.key) && event.key !== " ") {
                input.value = event.key;
                this.focusNextInput(input);
            }
            const isPaste = (event.ctrlKey || event.metaKey) && event.key === 'v';

            if (!isNaN(event.key) && event.key !== "Backspace" && !isPaste) {
                event.preventDefault();
            }
            this.toggleSubmitButton();
            this.autoSubmit();    
        },

        handlePaste: function (event) {
            event.preventDefault();
            const paste = event.clipboardData.getData('text').replace(/\D/g, '');
            const inputs = document.querySelectorAll(this.codeInputSelector);
            const inputCount = inputs.length;
        
            for (let i = 0; i < inputCount && i < paste.length; i++) {
                inputs[i].value = paste[i];
            }
        
            const nextEmptyInput = Array.from(inputs).find(input => !input.value) || inputs[inputCount - 1];
            nextEmptyInput.focus();
        
            this.toggleSubmitButton();
        
            if (paste.length === inputCount && this.enableAutoSubmit) {
                this.autoSubmit();
            }
        },

        setupCodeInputs: function () {
            const inputs = document.querySelectorAll(this.codeInputSelector);
            const self = this;
            inputs.forEach(function (input) {
                input.addEventListener('keydown', function (event) {
                    self.handleCodeInput(event);
                });

                input.addEventListener('paste', function (event) {
                    self.handlePaste(event);
                });
            });
        },

        getCode: function () {
            const inputs = document.querySelectorAll(this.codeInputSelector);
            let code = '';
            inputs.forEach(input => code += input.value);
            return code;
        },

        clearMessages: function (exceptPersistent = false, isResendPopup = false) {
            const selector = isResendPopup ? this.resendPopupSelector : this.overlaySelector;
            const messages = document.querySelectorAll(`${selector} .message`);
            
            messages.forEach(msg => {
                if (!exceptPersistent || !msg.classList.contains('persistent-message')) {
                    msg.remove();
                }
            });
        },
        
        showMessage: function (message, isError = false, isSuccess = false, isPersistent = false) {
            this.clearMessages(isPersistent, true);
            const messageContainer = document.createElement('div');
            messageContainer.className = `message ${isError ? 'error-message' : ''} ${isSuccess ? 'success-message' : ''} ${isPersistent ? 'persistent-message' : ''}`;
            messageContainer.innerHTML = message;
            
            const targetContainer = document.querySelector(this.resendPopupSelector);
            
            targetContainer.appendChild(messageContainer);
        
            if (!isSuccess && !isPersistent) {
                setTimeout(() => messageContainer.remove(), 5000);
            }
        },

        showOverlayMessage: function (message, isError = false, isSuccess = false, isPersistent = false) {
            this.clearMessages(isPersistent, false);
            const messageContainer = document.createElement('div');
            messageContainer.className = `message mt-3 ${isError ? 'error-message' : ''} ${isSuccess ? 'success-message' : ''} ${isPersistent ? 'persistent-message' : ''}`;
            messageContainer.innerHTML = message;
            
            const targetContainer = document.querySelector(this.overlaySelector);
            
            targetContainer.appendChild(messageContainer);
        
            if (!isSuccess && !isPersistent) {
                setTimeout(() => messageContainer.remove(), 5000);
            }
        },
        
        submitCode: function () {
            const code = this.getCode();
            if (code.length !== 6 || this.isSubmitting) return;

            const submitButton = document.querySelector(this.submitButtonSelector);
            const self = this;

            submitButton.disabled = true;
           // submitButton.textContent = 'Submitting...';
            this.isSubmitting = true;
            this.showOverlayMessage('Checking...', false, false, true);
            let checkData = {
                code: code,
            };
            
            if(this.userID) {
                checkData.userID = this.userID;
            }
            if(this.action) {
                checkData.action = this.action;
            }
            fetch(this.verificationEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(checkData).toString()
            })
                .then(response => response.json())
                .then(data => {
                    self.clearMessages(true, false);
                    self.isSubmitting = false;
                    //submitButton.textContent = 'Submit';
                    if (data.success) {
                        document.querySelector(self.overlaySelector).innerHTML = '<h2>Code Verification Successful</h2><p>Your Email has been validated.</p>';
                         if (self.redirectUrl) {
                            window.location.href = self.redirectUrl;
                        } else if (data.redirect) {
                            window.location.href = data.redirect;
                        }
                    } else {
                        self.showOverlayMessage('Verification code does not match. Please try again.', true);
                        self.enableAutoSubmit = false;
                        submitButton.disabled = false;
                        document.querySelectorAll(self.codeInputSelector).forEach(input => input.value = '');
                        document.querySelector(self.codeInputSelector).focus();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    self.enableAutoSubmit = false;
                    self.clearMessages(true, false);
                    self.isSubmitting = false;
                   // submitButton.textContent = 'Submit';
                    self.showOverlayMessage('An error occurred while attempting to verify the code. Please try again.', true);
                    submitButton.disabled = false;
                });
        },

        autoSubmit: function () {
            const code = this.getCode();
            if (code.length === 6 && this.enableAutoSubmit) {
                this.submitCode();
            }
        },

        toggleSubmitButton: function () {
            const code = this.getCode();
            const submitButton = document.querySelector(this.submitButtonSelector);
            const allFilled = [...document.querySelectorAll(this.codeInputSelector)].every(input => input.value.length === 1);
            submitButton.disabled = !allFilled;
        },

        showOverlay: function (email) {
            document.querySelector(this.overlayContainerSelector).classList.remove('hidden');
            document.querySelector(this.overlaySelector).classList.remove('hidden');
            document.querySelector(`${this.overlaySelector} .email-display`).innerText = email;
            document.querySelector(this.codeInputSelector).focus();
            this.email = email;
        },

        hideOverlay: function () {
            document.querySelector(this.overlayContainerSelector).classList.add('hidden');
            document.querySelector(this.overlaySelector).classList.add('hidden');
        },

        bindEvents: function () {
            const submitBtn = document.querySelector(this.submitButtonSelector);
            const didntReceiveLink = document.querySelector(this.didntReceiveSelector);
            const sendAgainBtn = document.querySelector(this.sendAgainButtonSelector);
            const resendPopup = document.querySelector(this.resendPopupSelector);
            const closePopupBtn = document.querySelector('.close-popup');
            const self = this;

            submitBtn.addEventListener('click', function () {
                self.submitCode();
            });

            didntReceiveLink.addEventListener('click', function (event) {
                event.preventDefault();
                if (self.isFirstResendClick) {
                    self.showResendPopup();
                    self.resendCode();
                    self.isFirstResendClick = false;
                } else {
                    self.toggleResendPopup();
                }
            });

            closePopupBtn.addEventListener('click', () => {
                self.hideResendPopup();
            });

            sendAgainBtn.addEventListener('click', function () {
                self.resendCode();
            });
        },

        showResendPopup: function () {
            document.querySelector(this.resendPopupSelector).classList.remove('hidden');
            document.querySelector(this.overlayContainerSelector).classList.add('blur-background');
        },

        hideResendPopup: function () {
            document.querySelector(this.resendPopupSelector).classList.add('hidden');
            document.querySelector(this.overlayContainerSelector).classList.remove('blur-background');
        },

        toggleResendPopup: function () {
            const popup = document.querySelector(this.resendPopupSelector);
            popup.classList.toggle('hidden');
            document.querySelector(this.overlayContainerSelector).classList.toggle('blur-background');
        },

        startCountdown: function () {
            let countdown = 60;
            const countdownElement = document.querySelector(this.countdownSelector);
            const sendAgainBtn = document.querySelector(this.sendAgainButtonSelector);
            
            if (this.countdownTimer) {
                clearInterval(this.countdownTimer);
            }
        
            countdownElement.classList.remove('hidden');
            sendAgainBtn.classList.add('hidden');
            sendAgainBtn.disabled = true;
        
            this.countdownTimer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(this.countdownTimer);
                    countdownElement.classList.add('hidden');
                    sendAgainBtn.classList.remove('hidden');
                    sendAgainBtn.disabled = false;
                }
            }, 1000);
        },
        
		resendCode: function () {
			const self = this;
			this.resendAttempts++;
			const useSmtp = this.resendAttempts % 2 !== 0;
		
			const sendAgainBtn = document.querySelector(this.sendAgainButtonSelector);
			const countdownElement = document.querySelector(this.countdownSelector);
			let action = this.resendAction || 'sendVerifyEmailCode';
			if(this.action === 'resetPassword') {
				action = 'sendResetPasswordCode';
			}
			sendAgainBtn.disabled = true;
			sendAgainBtn.classList.add('hidden');
			countdownElement.classList.add('hidden');
		
			self.showMessage('Resending verification code...', false, true, true);
			
			jQuery.ajax({
				type: "POST",
				url: self.resendEndpoint,
				data: { 
					email: self.email,
					use_smtp: useSmtp,
					action: action
				},
				dataType: 'json',
				success: function (res, status, req) {
					self.clearMessages(true, true);
					if (res.success) {
						self.showMessage('Validation code resent to your email.', false, true);
						self.startCountdown();
					} else {
						self.showMessage(res.error_message, true);
						sendAgainBtn.disabled = false;
						sendAgainBtn.classList.remove('hidden');
					}
				},
				error: function (err) {
					self.clearMessages(true, true);
					console.error(err);
					self.showMessage('An error occurred. Please try again.', true);
					sendAgainBtn.disabled = false;
					sendAgainBtn.classList.remove('hidden');
				}
			});
		}
		
    };

    global.EmailVerificationLibrary = EmailVerificationLibrary;
})(window);

function allowDigitOnly(evt) {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
    if (!regex.test(key)) {
        evt.preventDefault();
        return false;
    }
}
