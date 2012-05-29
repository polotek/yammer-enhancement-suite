var yes = {
  _settings: {
    debug: true
  }
  , init: function() {
    // Listen for any changes to the URL of any tab.
    chrome.tabs.onUpdated.addListener(this.onTabUpdate);
    chrome.extension.onRequest.addListener(this.onRequest);
  }
  , set: function(settings) {
    var key, val, changes = settings;
    if(typeof settings === 'string') {
      key = settings;
      val = arguments[1];
      this._settings[key] = val;
      changes = {};
      changes[key] = val;
    } else {
      utils.mixin(this._settings, settings);
    }
    this.saveSettings();
    this.emitSettingsUpdate(changes);
  }
  , get: function(key) {
    return this._settings[key];
  }
  , getSettings: function() {
    return utils.mixin({}, this._settings);
  }
  , saveSettings: function() {
    this.storage.set('settings', this._settings);
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
  , emitSettingsUpdate: function(changes) {
    var req = {
      type: 'settings_update'
      , data: {
        settings: this.getSettings()
        , changes: changes
      }
    };
    utils.page.sendRequest(req);
  }
  , onTabUpdate: function(tabId, changeInfo, tab) {
    if(this.checkForValidUrl(tabId, tab)) {
      chrome.pageAction.show(tabId);
    }
  }
  , onRequest: function(req, sender, cb) {
    if(!req.type || sender.tab.id === -1) {
      return;
    }

    var res = { type: req.type };
    if(req.type === 'get_settings') {
      res.data = this.getSettings();
    } else {
      res.error = "bad request: " + req.type;
    }

    return cb(res);
  }
  , storage: new Storage('yes')
};

utils.bindAll(yes);
yes.init();
