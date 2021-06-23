$( document ).ready(function() {
    initTournamentDetail();
	initTournamentPlaner();
});

function initTournamentDetail() {
	$.ajax({
		url: 'http://localhost:8000/api/tournament/gib/' + getUrlParameterValue('id'),
		method: 'get',
		dataType: 'json'
	}).done(function (response) {
		var obj = response.daten;
		var content = obj.title;
		
		$('#tournamentTitle').html(content);

		content = '<img src="' + obj.picture + '" class="img-responsive center-block" alt="' + obj.picture.replace('img/', '').replace('.jpg', '') + '">';
		content += '<div class="textContainer">';
		content += '<div class="h2 container-block">';
		content += obj.title + '<br>';
		content += obj.date;
		content += '</div>';
		content += '</div>';
		
		$('#tournamentImage').replaceWith(content);
		
		content = obj.description;
		
		$('#tournamentText').html(content);
		
	}).fail(function (jqXHR, statusText, error) {
		alert(jqXHR.responseText);
	});
}

function initTournamentPlaner() {
	var matchData = {
		teams : [
			["Team 1", "Team 2"],
			["Team 3", "Team 4"]
		],
		results : [
			[[4,3,'Match 1'], [3,4,'Match 2']],
			[[8,6,'Final'], [2,3,'Consolation final']]
		]
	}

	function onclick(data) {
		$('#matchCallback').text("onclick(data: '" + data + "')")
	}

	function onhover(data, hover) {
		$('#matchCallback').text("onhover(data: '" + data + "', hover: " + hover + ")")
	}

	$(function() {
		$('#tournamentPlaner').bracket({
			init: matchData,
			onMatchClick: onclick,
			onMatchHover: onhover
		})
	})
}