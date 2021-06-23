$( document ).ready(function() {
    initTeam();
});

function initTeam() {
	$.ajax({
		url: 'http://localhost:8000/api/staff/alle',
		method: 'get',
		dataType: 'json'
	}).done(function (response) {
		var content = '';

		for (i = 0; i < response.daten.length; i++) {
			var obj = response.daten[i];
			
			content += '<div class="personContainer">';
			
			if (obj.picture !== null && obj.picture !== undefined) {
				content += '<div class="imgContainer">';
				content += '<img src="' + obj.picture + '" class="img-responsive center-block" alt="' + obj.picture.replace('img/', '').replace('.jpg', '') + '">';
				content += '</div>';
			} else {
				content += '<div class="emptyImageContainer"><div class="emptyImage"></div><div class="emptyImageText">Kein Bild</div></div>';
			}
			
			content += '<div class="textContainer">';
			content += '<h3>' + obj.name + '</h3>';
			
			if (obj.animexxprofile !== null && obj.animexxprofile !== undefined || obj.description !== null && obj.description !== undefined) {
				content += '<p>';
			}
			
			if (obj.animexxprofile !== null && obj.animexxprofile !== undefined) {
				if (obj.animexxprofilelink !== null && obj.animexxprofilelink !== undefined) {
					content +=  'Animexx: <a href="' + obj.animexxprofilelink + '" target="_blank"><span>' + obj.animexxprofile + '</span></a>';
				} else {
					content +=  obj.animexxprofile;
				}
				if (obj.description !== null && obj.description !== undefined) {
					content +=  '<br>';
				}
			}
			
			if (obj.description !== null && obj.description !== undefined) {
				content +=  obj.description;
			}
			
			if (obj.animexxprofile !== null && obj.animexxprofile !== undefined || obj.description !== null && obj.description !== undefined) {
				content += '</p>';
			}
			
			content += '</div>';
			
			if (obj.email !== null && obj.email !== undefined || obj.email !== null && obj.email !== undefined) {
				content += '<div class="mailContainer">';
				content += '<a href="mailto:' + obj.email + '" class="mail">';
				content += '<i class="far fa-envelope"></i><span>' + obj.email + '</span>';
				content += '</a>';
				content += '</div>';
			}

			content += '</div>';
		}

		$('#dyntarget').replaceWith(content);
		
	}).fail(function (jqXHR, statusText, error) {
		alert(jqXHR.responseText);
	});
}
