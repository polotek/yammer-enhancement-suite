window.yammerEnhance = {};

(function($) {
	
	$(function() { 
		chrome.extension.sendRequest({action: "settings"}, function(response) {
			yammerEnhance.settings = response
			$(window).trigger('enhance.settingsLoaded', response);
		});
	});

	$(window).on('enhance.settingsLoaded', function(evt, settings) {
		console.log("settings are loaded", settings);
	});

})(jQuery);