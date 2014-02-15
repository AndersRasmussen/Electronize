// this module modifies the standard scope to contain utility functions
// make client side javacript accept the module.export declaration(s)
if (typeof module == "undefined") {
  module = {};
}
if (!module.exports) {
  module.exports = {};
}

// format a string, e.g. like "Hello {0}, how are {1}?".format("world", "you")
String.prototype.format = function() {
  var arg, formatted, _i, _ref;
  formatted = this;
  for (arg = _i = 0, _ref = arguments.length; 0 <= _ref ? _i <= _ref : _i >= _ref; arg = 0 <= _ref ? ++_i : --_i) {
    formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }
  return formatted;
};

// assign multiple items in array
Array.prototype.repeat = function(value, count) {
  while (count) {
    this[--count] = value;
  }
  return this;
};

// hashlist that can be iterated and supports the length-property
HashList = function() {
  var self, _items;
  self = this;
  this.length = 0;
  _items = new Object();
  this.remove = function(in_key) {
    if (_items.hasOwnProperty(in_key)) {
      self.length--;
      delete _items[in_key];
    }
    return this;
  };
  this.get = function(in_key) {
    return _items[in_key];
  };
  this.set = function(in_key, in_value) {
    if (in_value && in_key) {
      if (!_items.hasOwnProperty(in_key)) {
        self.length++;
      }
      _items[in_key] = in_value;
    }
    return this;
  };
  this.has = function(in_key) {
    return _items.hasOwnProperty(in_key);
  };
  this.clear = function() {
    _items = new Object();
    self.length = 0;
    return this;
  };
  this.each = function(callback, doneCallback) {
    var cnt, item;
    cnt = 0;
    for (item in _items) {
      callback(item, _items[item]);
      cnt++;
    }
    if (doneCallback != null) {
      doneCallback(cnt);
    }
    return self;
  };
  return this;
};

generateGuid = function() {
  var S4;
  S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return "" + (S4()) + (S4()) + "-" + (S4()) + "-" + (S4()) + "-" + (S4()) + "-" + (S4()) + (S4()) + (S4());
};

capitalizeFirstLetter = function(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

Exception = function(msg) {
  var _msg;
  _msg = msg;
  this.print = function() {
    return console.log("error threw message " + _msg);
  };
  return this;
};

logError = function(msg) {
  return console.log("" + (formattedTime()) + "[Error] " + msg);
};

logWarn = function(msg) {
  return console.log("" + (formattedTime()) + "[Warning] " + msg);
};

logInfo = function(msg) {
  return console.log("" + (formattedTime()) + "[Info] " + msg);
};

logDebug = function(msg) {
  return console.log("" + (formattedTime()) + "[Debug] " + msg);
};

formattedTime = function() {
	var pad = function(input) {
		if (input > 9) {
			return "" + input;
		} 
		else {
			return "0" + input;
		}
	};

	var date = new Date();
	return "" + (pad(date.getHours())) + ":" + (pad(date.getMinutes())) + ":" + (pad(date.getSeconds()));
};


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * Ref: http://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};