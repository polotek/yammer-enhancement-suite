window.yammerEnhance = {};

$(function() {
	chrome.extension.sendRequest({action: "settings"}, function(response) {
		yammerEnhance.settings = response
	});
})
