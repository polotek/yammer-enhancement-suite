// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://www.staging.yammer.com') > -1 ||
		tab.url.indexOf('https://www.thunderdome.yammer.com') > -1 ||
		tab.url.indexOf('https://www.thunderdome.yammer.com') > -1) {
	  chrome.pageAction.show(tabId);
	}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);