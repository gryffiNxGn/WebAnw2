$( document ).ready(function() {
    initDate();
});

function initDate() {
	$.ajax({
					url: 'http://localhost:8000/api/eventdate/alle',
					method: 'get',
					dataType: 'json'
				}).done(function (response) {
					var content = '';

					content += '<ul>';
					for (i = 0; i < response.daten.length; i++) {
						var obj = response.daten[i];

						content += '<li>';
						content += obj.date;
						if (obj.info !== null && obj.info !== undefined) {
							content += ' ' + obj.info;
						}
						content += '</li>';
					}
					content += '</ul>';

					$('#dyntarget').replaceWith(content);
					
				}).fail(function (jqXHR, statusText, error) {
					alert(jqXHR.responseText);
				});
}  