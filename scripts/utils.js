var utils = {
  init: function() {
    if(typeof yes === 'undefined') {
      // in content script
      chrome.extension.onRequest.addListener(utils.page._onRequest);
    }
  }
  , _getEvalStr: function(fn) {
    return '(function(yam) {' +
      'var fn = ' + fn.toString() + ';' +
      'var data = fn(yam);' +
      'if(typeof data !== "string") {' +
        'try {' +
          'data = JSON.stringify(data);' +
        '} catch(e) { data = null; }' +
      '}' +
      'return data;' +
    '})(window.yam);';
  }
  , _getCallback: function(cb) {
    return function(data) {
      if(typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch(e) {}
      }
      return cb(data);
    };
  }
  , noop: function() {}
  , execInPage: function(fn, cb) {
    var evalStr = this._getEvalStr(fn)
      , callback = this._getCallback(cb);
    return chrome.devtools.inspectedWindow.eval(evalStr, callback);
  }
  , mixin: function(target) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.forEach(function(source) {
      if(typeof source !== 'object') { return; }
      Object.keys(source).forEach(function(key) {
        target[key] = source[key];
      });
    });

    return target;
  }
  , bindAll: function(obj) {
    Object.keys(obj).forEach(function(key) {
      var fn = obj[key];
      if(typeof fn === 'function') {
        obj[key] = fn.bind(obj);
      }
    });
  }
  , sendMessage: function(name, msg) {
    chrome.extension.sendMessage(null, {
      name: name
      , msg: msg
    });
  }
  , load: function(src) {
    var script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
  }
  , getYES: function() {
    return chrome.extension.getBackgroundPage().yes;
  }
  , _handler: function(req, cb) {
    if(typeof cb !== 'function') { cb = utils.noop; }

    return function(res) {
      if(!res) {
        console.error('no response: ' + req.type);
        return cb();
      } else if(res.error) {
        console.error('error response: ' + res.error);
        return cb();
      }

      return cb(res.data);
    };
  }
  , ext: {
    sendRequest: function(req, cb) {
      chrome.extension.sendRequest(req, utils._handler(req, cb));
    }
  }
  , page: {
    sendRequest: function(req, cb) {
      cb = utils._handler(req, cb);

      chrome.tabs.getSelected(null, function(tab) {
        if(!tab) { return; }

        chrome.tabs.sendRequest(tab.id, req, cb);
      });
    }
    , _onRequest: function(req, sender, cb) {
      if(!req.type || sender.tab.id !== -1) {
        return;
      }

      var res = { type: req.type };
      if(req.type === 'settings_update') {
        $(document).trigger('yes::' + req.type, req.data);
      } else {
        res.error = "bad request: " + req.type;
      }

      return cb(res);
    }
  }
};
utils.bindAll(utils.ext);
utils.bindAll(utils.page);
utils.bindAll(utils);
utils.init();

if(typeof console === 'undefined') {
  console = {
    log: function(msg) {
      chrome.experimental.devtools.console.addMessage('log', msg);
    }
    , error: function(msg) {
      chrome.experimental.devtools.console.addMessage('error', msg);
    }
    , debug: function(msg) {
      chrome.experimental.devtools.console.addMessage('debug', msg);
    }
  };

  utils.bindAll(console);
}
