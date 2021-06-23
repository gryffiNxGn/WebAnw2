$(document).ready(function() {
    initMailSystem();
});

function initMailSystem() {	
	$formData = {}
	function callMail() {
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'http://localhost:8000/api/contact',
			data : JSON.stringify($formData),
			dataType : 'json',
			success : function(user) {
				if (user) {
					location.reload();
				} else {
					alert("unbekannter Server-Fehler");
				}
			},
			error : function(e) {
				alert("unbekannter Server-Fehler");
			}
		});
	}

	$('#btnSubmitGeneralMail').click(function(e) {
		e.preventDefault(e);
		$formData = {
			name : $('#generalName').val(),
			email : $('#generalEmail').val(),
			subject : 'General',
			message : $('#generalMessage').val(),
		}
		callMail();
    });

	$('#btnSubmitLostItemsMail').click(function(e) {
		e.preventDefault(e);
		$formData = {
			name : $('#lostName').val(),
			email : $('#lostEmail').val(),
			subject : 'LostItems',
			message : $('#lostMessage').val(),
		}
		callMail();
    });
}