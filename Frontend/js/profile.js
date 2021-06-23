$( document ).ready(function() {
	initResizeHandler();
    initRegisteredTournaments();
	initProfileData();
	initChangeProfileData();
	initUpdatePassword();
	initAccountLogout();
});

$(document).ajaxStop(function() {
	initTournamentBoxHandler();
});

function stringToHash(string) {
	var hash = 0;
	if (string.length == 0) return hash;
	for (i = 0; i < string.length; i++) {
		char = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

function initResizeHandler() {
	$(window).on("resize orientationchange", function() {
		$('body').removeClass('navOpen');
		initTournamentBoxHandler();
	});
}

function initRegisteredTournaments() {
	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		url : 'http://localhost:8000/api/tournament/showRegistered/',
		data : JSON.stringify(),
		dataType : 'json',
		headers: {
			'authorization': "Bearer " + localStorage.getItem("animexxUserToken") + ""
		},
		success : function(response) {
			var content = '';

			for (i = 0; i < response.daten.length; i++) {
				var obj = response.daten[i];

				content += '<div class="col-lg-4 col-md-6">';
				content += '<div class="tournamentContainer">';
				content += '<a href="tournamentdetail.html?id=' + obj.id + '">';
				content += '<span class="bannerImageContainer container-block">';
				
				content += '<img src="' + obj.picture + '" class="img-responsive center-block" alt="' + obj.picture.replace('img/', '').replace('.jpg', '') + '">';
				
				content += '<div class="textContainer">';
				content += '<div class="h2 container-block">';
				content += obj.title + '<br>';
				content += obj.date;
				content += '</div>';
				content += '<span class="description">';
				content += obj.shortdescription;
				content += '</span>';
				content += '</div>';
				
				content += '</div>';
				content += '</span>';
				content += '</a>';
				content += '</div>';
				content += '</div>';
			}
			
			if (!content) {
				content = '<div class="col-md-12"><p>Derzeitig sind Sie für keine Turniere angemeldet</p></div>'
			}

			$('#dyntarget').replaceWith(content);
		},
		error : function(e) {
			alert("unbekannter Server-Fehler");
		}
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

function initProfileData() {
	if (localStorage.getItem("animexxUserToken")) {
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'http://localhost:8000/api/user/getUser',
			data : JSON.stringify(),
			dataType : 'json',
			headers: {
				'authorization': "Bearer " + localStorage.getItem("animexxUserToken") + ""
			},
			success : function(user) {
				if (user.daten) {
					$('#profileNick').val(user.daten.Nickname);
					$('#profileName').val(user.daten.Name);
					$('#profileEmail').val(user.daten.Email);
				} else {
					alert("unbekannter Server-Fehler");
				}
			},
			error : function(e) {
				alert("unbekannter Server-Fehler");
			}
		});
	}
}

async function initChangeProfileData() {
	$('#profileNick').focusout(function() {
        validateNick();
    });
	
	$('#profileName').focusout(function() {
        validateName();
    });
	
	$('#profileEmail').focusout(function() {
        validateEmail();
    });
	
	$('#profilePassword').focusout(function() {
        validatePassword();
    });
	
	$nick = $('#profileNick');
	$nickInvalid = $('#profileNickInvalid');
	$name = $('#profileName');
	$nameInvalid = $('#profileNameInvalid');
	$email = $('#profileEmail');
	$emailInvalid = $('#profileEmailInvalid');
	$emailTaken = $('#profileEmailTaken');
	$password = $('#profilePassword');
	$passwordInvalid = $('#profilePasswordInvalid');
	
	$nickError = false;
	$nameError = false;
	$emailError = false;
	$passwordError = false;
      
	function validateNick() {
		$nickValue = $nick.val();
		if($nickValue.length >= 3 && $nickValue.length <= 12) {
			$nick.removeClass('invalid').addClass('valid');
			$nickInvalid.removeClass('triggered');
			$nickError = false;
		} else {
			$nick.removeClass('valid').addClass('invalid');
			$nickInvalid.addClass('triggered');
			$nickError = true;
		}
    }
	
	function validateName() {
		$nameValue = $name.val();
		if($nameValue.length >= 3 && $nameValue.length <= 26) {
			$name.removeClass('invalid').addClass('valid');
			$nameInvalid.removeClass('triggered');
			$nameError = false;
		} else {
			$name.removeClass('valid').addClass('invalid');
			$nameInvalid.addClass('triggered');
			$nameError = true;
		}
	}
	
	function validateEmail() {
		$emailValue = $email.val();
		$regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
		
		if($regex.test($emailValue)) {
			$email.removeClass('invalid').addClass('valid');
			$emailInvalid.removeClass('triggered');
			$emailTaken.removeClass('triggered');
			$emailError = false;
			// $formData = {
				// email : $emailValue,
			// }
			
			// $.ajax({
				// type : 'POST',
				// contentType : 'application/json',
				// url : 'http://localhost:8000/api/user/unique',
				// data : JSON.stringify($formData),
				// dataType : 'json',
				// success : function(user) {
					// if (user.daten.unique == 0) {
						// $email.removeClass('invalid').addClass('valid');
						// $emailInvalid.removeClass('triggered');
						// $emailTaken.removeClass('triggered');
						// $emailError = false;
					// } else {
						// $email.removeClass('valid').addClass('invalid');
						// $emailTaken.addClass('triggered');
						// $emailError = true;
					// }
				// },
				// error : function(e) {
					// alert("unbekannter Server-Fehler");
				// }
			// });
		} else {
			$email.removeClass('valid').addClass('invalid');
			$emailInvalid.addClass('triggered');
			$emailError = true;
		}
	}
	
	function validatePassword() {
		$emailValue = $email.val();
		$passwordValue = $password.val();
		
		if($passwordValue.length >= 6 && $passwordValue.length <= 26) {
			$password.removeClass('invalid').addClass('valid');
			$passwordInvalid.removeClass('triggered');
			$passwordError = false;
			// $formData = {
				// email : $emailValue,
				// password : $passwordValue,
			// }

			// $.ajax({
				// type : 'POST',
				// contentType : 'application/json',
				// url : 'http://localhost:8000/api/user/check',
				// data : JSON.stringify($formData),
				// dataType : 'json',
				// success : function(response) {
					// if (response.accessToken) {
						// $password.removeClass('invalid').addClass('valid');
						// $passwordInvalid.removeClass('triggered');
						// $passwordError = false;
					// } else {
						// $password.removeClass('valid').addClass('invalid');
						// $passwordInvalid.addClass('triggered');
						// $passwordError = true;
					// }
				// },
				// error : function(e) {
					// $password.removeClass('valid').addClass('invalid');
					// $passwordInvalid.addClass('triggered');
					// $passwordError = true;
				// }
			// });
		} else {
			$password.removeClass('valid').addClass('invalid');
			$passwordInvalid.addClass('triggered');
			$passwordError = true;
		}
	}
		
	$('#btnSubmitChangeProfile').click(function(e){
		e.preventDefault(e);
		validateNick();
		validateName();
		validateEmail();
		validatePassword();
		changeProfileData();
	});
	
	async function changeProfileData() {
		$PasswordVal = $("#profilePassword").val();
		$hashedpw = await stringToHash($PasswordVal).toString();
		
		$formData = {
			name : $('#profileName').val(),
			nickname : $('#profileNick').val(),
			email : $('#profileEmail').val(),
			password : $hashedpw,
		}

		$.ajax({
			type : 'PUT',
			contentType : 'application/json',
			url : 'http://localhost:8000/api/user/updateProfile',
			data : JSON.stringify($formData),
			dataType : 'json',
			headers: {
				'authorization': "Bearer " + localStorage.getItem("animexxUserToken") + ""
			},
			success : function(response) {
				if (response.accessToken) {
					localStorage.removeItem("animexxUserToken");
					localStorage.setItem("animexxUserToken", response.accessToken);
					location.reload();
				} else {
					alert("Profil Bearbeitung fehlgeschlagen");
				}
			},
			error : function(e) {
				alert("Profil Bearbeitung fehlgeschlagen: falsches Passwort");
			}
		});
	}
}

async function initUpdatePassword() {
	$("#btnSubmitChangePassword").click(function(e){
		e.preventDefault();
		$PasswordVal = $("#oldPassword").val();
		$newPasswordVal = $("#newPassword").val();
		$confirmNewPasswordVal = $("#confirmNewPassword").val();
		$hashedpw = stringToHash($PasswordVal).toString();
		$newHashedpw = stringToHash($newPasswordVal).toString();
		$confirmNewHashedpw = stringToHash($confirmNewPasswordVal).toString();
		
		$formData = {
			newPassword : $newHashedpw,
			confirmNewPassword : $confirmNewHashedpw,
			oldPassword : $hashedpw,
		}
		
		$.ajax({
			type : 'PUT',
			contentType : 'application/json',
			url : 'http://localhost:8000/api/user/updatePassword',
			data : JSON.stringify($formData),
			dataType : 'json',
			headers: {
				'authorization': "Bearer " + localStorage.getItem("animexxUserToken") + ""
			},
			success : function(user) {
				if (user.daten) {
					location.reload();
				} else {
					alert("Passwort ändern fehlgeschlagen!");
				}
			},
			error : function(e) {
				alert("unbekannter Server-Fehler");
			}
		});
	});
}

function initAccountLogout() {
	$('#logoutButton').click(function(e) {
		e.preventDefault();
		localStorage.removeItem("animexxUserToken");
		window.location.href = "index.html";
    });
}