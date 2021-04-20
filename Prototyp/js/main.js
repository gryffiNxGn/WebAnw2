$(function() {
	initNavToggle();
	initCarousel();
	initResizeHandler();
	initAutoHeight();
	initMultiTabHandler();
	initAccountBoxHandler();
	initTournamentBoxHandler();
	initAccountBoxOpener();
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
	});
	
	$('#toRegister').click(function(e) {
		e.preventDefault();
        $("html, body").animate({ scrollTop: "0" }, 250);
	});
}
