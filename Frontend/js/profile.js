$( document ).ready(function() {
	initResizeHandler();
    initRegisteredTournaments();
});

$(document).ajaxStop(function() {
	initTournamentBoxHandler();
});

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
			console.log(response);
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