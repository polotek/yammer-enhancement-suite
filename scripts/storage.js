/**
 * 
 * The MIT License (MIT)
 * Copyright (c) 2012 Marco Rogers
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * A little wrapper around localStorage that supports compound keys and
 * non-string values
 */
var Storage = function(prefix) {
  this._prefix = prefix ? prefix + '::' : '';
};
Storage.prototype = {
  getKey: function(key) {
    if(Array.isArray(key)) {
      // compound key
      key = key.join('::');
    } else if(typeof key === 'string' && key.indexOf(this._prefix) === 0) {
      // already prefixed
      return key;
    }
    return this._prefix + key;
  }
  , has: function(key) {
    if(arguments.length > 1) {
      // compound key arguments
      key = Array.prototype.slice.call(arguments);
    }
    
    key = this.getKey(key);

    return localStorage.hasOwnProperty(key);
  }
  , get: function(key) {
    if(arguments.length > 1) {
      // compound key arguments
      key = Array.prototype.slice.call(arguments);
    }
    
    key = this.getKey(key);

    var val = localStorage[key];

    if(val === undefined) { return undefined; }

    try {
      val = JSON.parse(val);
    } catch(e) {
      val = null;
    }

    return val;
  }
  , set: function(key, val) {
    if(!val && (val === undefined || isNaN(val))) { return false; }

    key = this.getKey(key);
    val = JSON.stringify(val);

    localStorage[key] = val;
    return true;
  }
  , del: function(key) {
    if(arguments.length > 1) {
      // compound key arguments
      key = Array.prototype.slice.call(arguments);
    }
    
    key = this.getKey(key);

    var val = this.get(key);
    delete localStorage[key];
    return val;
  }
};

if(typeof require === 'function' && typeof module !== undefined) {
  module.exports = Storage;
}
