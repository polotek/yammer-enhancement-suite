(function($) {
	
	var getWrapper = function() {
		return $('#getting-started-wrapper');
	}

	$(window).on('enhance.settingsLoaded', function(event, settings) {

		if(!settings.removeGettingStarted)
			return;

		getWrapper().remove();

		// sometimes this isn't around when on document.ready
		setTimeout(function() {
			console.log(getWrapper());
			getWrapper().remove()
		}, 500);

	});

})(jQuery);