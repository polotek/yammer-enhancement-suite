(function($) {
	
	$(function() { 

		var convertLikes = function() {
			$("a").filter(':contains("Like")').text("Hell Yeah");
			$("a").filter(':contains("Unlike")').text("Hell Naw");
		}

		convertLikes();

		// sometimes this isn't around when on document.ready
		setInterval(convertLikes, 500);

	});

})(jQuery);