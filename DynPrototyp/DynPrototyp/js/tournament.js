$( document ).ready(function() {
    initTournamentOverview();
});

function initTournamentOverview() {
	$.ajax({
		url: 'http://localhost:8000/api/tournament/alle',
		method: 'get',
		dataType: 'json'
	}).done(function (response) {
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
		
	}).fail(function (jqXHR, statusText, error) {
		alert(jqXHR.responseText);
	});
}