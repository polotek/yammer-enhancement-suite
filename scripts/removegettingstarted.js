(function($) {
	
	var getWrapper = function() {
		return $('#getting-started-wrapper');
	}

	$(function() { 
		getWrapper().remove();

		// sometimes this isn't around when on document.ready
		setTimeout(function() {
			getWrapper().remove()
		}, 500);

	});

})(jQuery);