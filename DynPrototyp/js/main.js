$( document ).ready(function() {
    initNavToggle();
	initCarousel();
	initResizeHandler();
	initAutoHeight();
	initMultiTabHandler();
	initAccountBoxHandler();
	initAccountBoxOpener();
	initAccountLogin();
	initAccountRegistration();
});

$(document).ajaxStop(function() {
	initTournamentBoxHandler();
});

function initNavToggle() {
	$('.navbar-toggler').click(function(e) {
		$('body').toggleClass('navOpen');
	});
}

function initCarousel() {
	$('.carousel').carousel();
}

function initResizeHandler() {
	$(window).on("resize orientationchange", function() {
		$('body').removeClass('navOpen');
		initTournamentBoxHandler();
	});
}

function initAutoHeight() {
	$('main').css('min-height', ($(window).height() - $('header').outerHeight() - $('footer').outerHeight()));
	
	$(window).on("resize orientationchange", function() {
		$('main').css('min-height', ($(window).height() - $('header').outerHeight() - $('footer').outerHeight()));
	});
}

function initMultiTabHandler() {
	$('.nav-tabs a').click(function(e) {
		$('.tab-contentSecond .tab-pane.active').addClass('fade').removeClass('active');
		$($(this).attr('href') + 'a').addClass('active').removeClass('fade');
	});
}

function mailText(body, name, subSelector) {
	if (subSelector == 1) {
		mail = 'Todo@Todo.de'
		subject = 'Allgemeine Anfrage'
	} else if (subSelector == 2) {
		mail = 'Todo2@Todo.de'
		subject = 'Fundsachen Anfrage'
	} else {
		mail = 'Todo3@Todo.de'
		subject = 'Stand/Flohmarkt Anfrage'
	}
	
	MyAction = 'mailto:' + mail + '?Subject=' + subject + '&body=' + body + '%0D%0A%0D%0A' + name;
	window.location.href = MyAction;
}

function initAccountBoxHandler() {
	login = $('.navExt .login');
	forgotPassword = $('.navExt .forgotPassword');
	register = $('.navExt .register');
	
	forgotPasswordButton = $('.navExt .login .forgotPasswordOpener');
	registerButton = $('.navExt .login #registerLink');
	loginButton = $('.navExt #loginBtn');
	
	dropdown = $('.navExt .accountDropdownBox');
	
	registerBackButton = $('.navExt .register .backToLogin');
	forgotPasswordBackButton = $('.navExt .forgotPassword .backToLogin');
	
	forgotPasswordButton.click(function(e) {
		e.preventDefault();
		dropdown.addClass('forgotPasswordActive');
		login.addClass('removing').removeClass('active');
		setTimeout(function(){
			login.removeClass('removing');
			forgotPassword.addClass('transitioning');
			setTimeout(function(){
				forgotPassword.addClass('active');
				forgotPassword.removeClass('transitioning');
			}, 10);
		}, 250);
	});
	
	forgotPasswordBackButton.click(function(e) {
		e.preventDefault();
		e.stopPropagation()
		forgotPassword.addClass('removing').removeClass('active');
		setTimeout(function(){
			dropdown.removeClass('forgotPasswordActive');
			forgotPassword.removeClass('removing');
			login.addClass('transitioning');
			setTimeout(function(){
				login.addClass('active');
				login.removeClass('transitioning');
			}, 10);
		}, 250);
	});
	
	registerButton.click(function(e) {
		e.preventDefault();
		login.addClass('removing').removeClass('active');
		setTimeout(function(){
			dropdown.addClass('registerActive');
			login.removeClass('removing');
			register.addClass('transitioning');
			setTimeout(function(){
				register.addClass('active');
				register.removeClass('transitioning');
			}, 10);
		}, 250);
	});
	
	registerBackButton.click(function(e) {
		e.preventDefault();
		e.stopPropagation()
		register.addClass('removing').removeClass('active');
		dropdown.removeClass('registerActive');
		setTimeout(function(){
			register.removeClass('removing');
			login.addClass('transitioning');
			setTimeout(function(){
				login.addClass('active');
				login.removeClass('transitioning');
			}, 10);
		}, 250);
	});
	
	loginButton.click(function(e) {
		dropdown.removeClass('registerActive').removeClass('forgotPasswordActive');
		login.addClass('active');
		forgotPassword.removeClass('active');
		register.removeClass('active');
	});
	
	$('.dropdown-menu').click(function(e) {
		e.stopPropagation();
	});
	$('.accountDropdownBox .closeDropdown').click(function(e) {
		$('.accountDropdownBox').closest('.dropdown').dropdown('toggle');
	});
}

function initTournamentBoxHandler() {
	$('.tournamentContainer .textContainer').each(function(){
		heightOffset = $(this).find('.description').outerHeight() + 30;
		
		$(this).addClass('notransition');
		$(this).css('transform', 'translateY('+heightOffset+'px)');
		$(this)[0].offsetHeight;
		$(this).removeClass('notransition');
	});
}

function initAccountBoxOpener() {
	$('#toLogin').click(function(e) {
		e.preventDefault();
        $("html, body").animate({ scrollTop: "0" }, 250);
		//$('.accountDropdownBox').closest('.dropdown').dropdown('toggle');
	});
	
	$('#toRegister').click(function(e) {
		e.preventDefault();
        $("html, body").animate({ scrollTop: "0" }, 250);
		//$('.accountDropdownBox').closest('.dropdown').dropdown('toggle');
	});
}

function initAccountLogin() {
	$("#loginButton").click(function(e){
		e.preventDefault();
		console.log('BENUTZER CHECKING');
		$email = $("#loginEmail").val();
		$password = $("#loginPassword").val();
		
		$formData = {
			email : $email,
			password : $password,
		}

		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'http://localhost:8000/api/user/check',
			data : JSON.stringify($formData),
			dataType : 'json',
			success : function(user) {
				console.log("great success");
			},
			error : function(e) {
				console.log("error: ", e);
			}
		});
	});
}

function initAccountRegistration() {
    $('#registerNick').focusout(function() {
        validateNick();
    });
	
	$('#registerName').focusout(function() {
        validateName();
    });
	
	$('#registerEmail').focusout(function() {
        validateEmail();
    });
	
	$('#registerPassword').focusout(function() {
        validatePassword();
    });
	
	$('#registerPasswordRepeat').focusout(function() {
        validatePasswordRepeat();
    });
	
	$nick = $('#registerNick');
	$name = $('#registerName');
	$email = $('#registerEmail');
	$password = $('#registerPassword');
	$passwordRepeat = $('#registerPasswordRepeat');
	
	$regNickInvalid = $('#regNickInvalid');
	$regNameInvalid = $('#regNameInvalid');
	$regEmailTaken = $('#regEmailTaken');
	$regEmailInvalid = $('#regEmailInvalid');
	$regPasswordInvalid = $('#regPasswordInvalid');
	$regPasswordRepeatInvalid = $('#regPasswordRepeatInvalid');
	
	$nickError = false;
	$nameError = false;
	$emailError = false;
	$passwordError = false;
	$passwordRepeatError = false;
      
    function validateNick() {
		$nickValue = $nick.val();
		if($nickValue.length >= 3 && $nickValue.length <= 12) {
			$nick.removeClass('invalid').addClass('valid');
			$regNickInvalid.removeClass('triggered');
			$nickError = false;
		} else {
			$nick.removeClass('valid').addClass('invalid');
			$regNickInvalid.addClass('triggered');
			$nickError = true;
		}
    }
	
	function validateName() {
		$nameValue = $name.val();
		if($nameValue.length >= 3 && $nameValue.length <= 26) {
			$name.removeClass('invalid').addClass('valid');
			$regNameInvalid.removeClass('triggered');
			$nameError = false;
		} else {
			$name.removeClass('valid').addClass('invalid');
			$regNameInvalid.addClass('triggered');
			$nameError = true;
		}
	}
	
	function validateEmail() {
		$emailValue = $email.val();
		$regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
		
		//TODO check if specific mail already exists
		if($regex.test($emailValue)) {
			$formData = {
				email : $emailValue,
			}
			
			$.ajax({
				type : 'POST',
				contentType : 'application/json',
				url : 'http://localhost:8000/api/user/unique',
				data : JSON.stringify($formData),
				dataType : 'json',
				success : function(user) {
					if (user.daten.unique == 0) {
						$email.removeClass('invalid').addClass('valid');
						$regEmailInvalid.removeClass('triggered');
						$regEmailTaken.removeClass('triggered');
						$emailError = false;
					} else {
						$email.removeClass('valid').addClass('invalid');
						$regEmailTaken.addClass('triggered');
						$emailError = true;
					}
				},
				error : function(e) {
					alert("unbekannter Server-Fehler");
				}
			});
		} else {
			$email.removeClass('valid').addClass('invalid');
			$regEmailInvalid.addClass('triggered');
			$emailError = true;
		}
	}
	
	function validatePassword() {
		$passwordValue = $password.val();
		if($passwordValue.length >= 6 && $passwordValue.length <= 26) {
			$password.removeClass('invalid').addClass('valid');
			$regPasswordInvalid.removeClass('triggered');
			$passwordError = false;
		} else {
			$password.removeClass('valid').addClass('invalid');
			$regPasswordInvalid.addClass('triggered');
			$passwordError = true;
		}
	}
	
	function validatePasswordRepeat() {
		$passwordRepeatValue = $passwordRepeat.val();
		if($passwordValue.length >= 6 && $passwordValue.length <= 26 && $passwordRepeatValue == $('#registerPassword').val()) {
			$passwordRepeat.removeClass('invalid').addClass('valid');
			$regPasswordRepeatInvalid.removeClass('triggered');
			$passwordRepeatError = false;
		} else {
			$passwordRepeat.removeClass('valid').addClass('invalid');
			$regPasswordRepeatInvalid.addClass('triggered');
			$passwordRepeatError = true;
		}
	}
	
    $('#regButton').click(function(e) {
		e.preventDefault();
        validateNick();
        validateName();
        validateEmail();
        validatePassword();
		validatePasswordRepeat();
        if ($nickError == false && $nameError == false && $emailError == false && $passwordError == false && $passwordRepeatError == false) {
			createAccount();
        }
    });
	
	function createAccount() {
		$formData = {
			name : $('#registerName').val(),
			nickname : $('#registerNick').val(),
			email : $('#registerEmail').val(),
			password : $('#registerPassword').val(),
		}
		
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'http://localhost:8000/api/user',
			data : JSON.stringify($formData),
			dataType : 'json',
			success : function(user) {
				if (user.daten) {
					$email.removeClass('invalid').addClass('valid');
					$regEmailTaken.removeClass('triggered');
				} else {
					$email.removeClass('valid').addClass('invalid');
					$regEmailTaken.addClass('triggered');
				}
			},
			error : function(e) {
				alert("unbekannter Server-Fehler");
			}
		});
		
	}
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(cname) {
  var cookiestatus = getCookie(cname);
  if (cookiestatus != "") {
   alert("Cookie check: " + cookiestatus);
   return true;
  } else {
   alert("No cookie found");
   return false;
  }
}

function delCookie(cname){
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
