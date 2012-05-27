var utils = {
  _getEvalStr: function(fn) {
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
  , exec: function(fn, cb) {
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
  , permissions: function() {
    var perms = []
      , cur = ['chrome'];
    var recurse = function(obj) {
      for(var k in obj) {
        if(['test', 'i18n'].indexOf(k) > -1) { continue; }
        cur.push(k);
        perms.push(cur.join('.'));
        if(obj[k]) {
          if(typeof obj[k] === 'object') {
            try {
              recurse(obj[k]);
            } catch(e) {}
          }
        } else {
          perms[perms.length-1] += '=NULL';
        }
        cur.pop();
      }
      if(obj.__proto__ && obj.__proto__.toString !== Object.prototype.toString) {
        recurse(obj.__proto__);
      }
    };
    recurse(chrome);
    return perms.join('\n');
  }
};
utils.bindAll(utils);

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
