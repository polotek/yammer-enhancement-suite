var bg = {
  settings: {
    debug: true
  }
  , init: function() {
    // Listen for any changes to the URL of any tab.
    chrome.tabs.onUpdated.addListener(bg.onTabUpdate);
  }
  , set: function(settings) {
    var key, val;
    if(typeof settings === 'string') {
      key = settings;
      val = arguments[1];
      this.settings[key] = val;
    } else {
      utils.mixin(this.settings, settings);
    }
    return this.settings;
  }
  , get: function(key) {
    return this.settings[key];
  }
  , getSettings: function() {
    return utils.mixin({}, this.settings);
  }
  // Called when the url of a tab changes.
  , checkForValidUrl: function (tabId, tab) {
    if (tab.url.indexOf('https://www.staging.yammer.com') > -1 ||
      tab.url.indexOf('https://www.thunderdome.yammer.com') > -1 ||
      tab.url.indexOf('https://www.yammer.com') > -1 ||
      tab.url.indexOf('https://www.yammer.dev') > -1) {
        return true;
    }
    return false;
  }
  , onTabUpdate: function(tabId, changeInfo, tab) {
    if(this.checkForValidUrl(tabId, tab)) {

    }
  }
};

utils.bindAll(bg);
bg.init();
