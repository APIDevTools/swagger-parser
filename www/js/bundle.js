(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
/**!
 * Ono v1.0.22
 *
 * @link https://github.com/BigstickCarpet/ono
 * @license MIT
 */
'use strict';

var util  = require('util'),
    slice = Array.prototype.slice;

module.exports = create(Error);
module.exports.error = create(Error);
module.exports.eval = create(EvalError);
module.exports.range = create(RangeError);
module.exports.reference = create(ReferenceError);
module.exports.syntax = create(SyntaxError);
module.exports.type = create(TypeError);
module.exports.uri = create(URIError);
module.exports.formatter = util.format;

/**
 * Creates a new {@link ono} function that creates the given Error class.
 *
 * @param {Class} Klass - The Error subclass to create
 * @returns {ono}
 */
function create(Klass) {
  /**
   * @param {Error}   [err]     - The original error, if any
   * @param {object}  [props]   - An object whose properties will be added to the error object
   * @param {string}  [message] - The error message. May contain {@link util#format} placeholders
   * @param {...*}    [params]  - Parameters that map to the `message` placeholders
   * @returns {Error}
   */
  return function ono(err, props, message, params) {
    var formattedMessage, stack;
    var formatter = module.exports.formatter;

    if (typeof(err) === 'string') {
      formattedMessage = formatter.apply(null, arguments);
      err = props = undefined;
    }
    else if (typeof(props) === 'string') {
      formattedMessage = formatter.apply(null, slice.call(arguments, 1));
    }
    else {
      formattedMessage = formatter.apply(null, slice.call(arguments, 2));
    }

    if (!(err instanceof Error)) {
      props = err;
      err = undefined;
    }

    if (err) {
      // The inner-error's message and stack will be added to the new error
      formattedMessage += (formattedMessage ? ' \n' : '') + err.message;
      stack = err.stack;
    }

    var error = new Klass(formattedMessage);
    extendError(error, stack, props);
    return error;
  };
}

/**
 * Extends the given Error object with the given values
 *
 * @param {Error}   error - The error object to extend
 * @param {?string} stack - The stack trace from the original error
 * @param {?object} props - Properties to add to the error object
 */
function extendError(error, stack, props) {
  if (stack) {
    error.stack += ' \n\n' + stack;
  }

  if (props && typeof(props) === 'object') {
    var keys = Object.keys(props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      error[key] = props[key];
    }
  }

  error.toJSON = errorToJSON;
}

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 *
 * @returns {object}
 */
function errorToJSON() {
  // jshint -W040

  // All Errors have "name" and "message"
  var json = {
    name: this.name,
    message: this.message
  };

  // Append any custom properties that were added
  var keys = Object.keys(this);

  // Also include any vendor-specific Error properties
  keys = keys.concat(['description', 'number', 'fileName', 'lineNumber', 'columnNumber', 'stack']);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = this[key];
    if (value !== undefined) {
      json[key] = value;
    }
  }

  return json;
}

},{"util":8}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],6:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":4,"./encode":5}],7:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],8:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":7,"_process":3,"inherits":1}],9:[function(require,module,exports){
var form = require('./form');

/**
 * Adds all the drop-down menu functionality
 */
exports.init = function() {
  // Update each dropdown's label when its value(s) change
  onChange(form.allow.menu, setAllowLabel);
  onChange(form.refs.menu, setRefsLabel);
  onChange(form.validate.menu, setValidateLabel);
  onChange(form.cache.menu, setCacheLabel);

  // Change the button text whenever a new method is selected
  setButtonLabel(form.method.button.val());
  form.method.menu.find('a').on('click', function(event) {
    setButtonLabel($(this).data('value'));
    form.method.menu.dropdown('toggle');
    event.stopPropagation();
  });
};

/**
 * Calls the given function whenever the user selects (or deselects)
 * a value in the given drop-down menu.
 *
 * @param {jQuery} menu
 * @param {function} setLabel
 */
function onChange(menu, setLabel) {
  // Don't auto-close the menu when items are clicked
  menu.find('a').on('click', function(event) {
    event.stopPropagation();
  });

  // Set the label immediately, and again whenever the menu is closed
  setLabel();
  menu.parent('.dropdown').on('hidden.bs.dropdown', setLabel);
}

/**
 * Sets the "allow" label, based on which options are selected
 */
function setAllowLabel() {
  var values = getCheckedAndUnchecked(
    form.allow.json, form.allow.yaml, form.allow.empty, form.allow.unknown);

  switch (values.checked.length) {
    case 0:
      form.allow.label.text('No file types allowed');
      break;
    case 1:
      form.allow.label.text('Only allow ' + values.checked[0] + ' files');
      break;
    case 2:
      form.allow.label.text('Allow ' + values.checked[0] + ' and ' + values.checked[1]);
      break;
    case 3:
      form.allow.label.text('Don\'t allow ' + values.unchecked[0] + ' files');
      break;
    case 4:
      form.allow.label.text('Allow all file types');
  }
}

/**
 * Sets the "refs" label, based on which options are selected
 */
function setRefsLabel() {
  var values = getCheckedAndUnchecked(form.refs.internal, form.refs.external, form.refs.circular);

  switch (values.checked.length) {
    case 0:
      form.refs.label.text('No $refs allowed');
      break;
    case 1:
      form.refs.label.text('Only follow ' + values.checked[0] + ' $refs');
      break;
    case 2:
      form.refs.label.text('Don\'t follow ' + values.unchecked[0] + ' $refs');
      break;
    case 3:
      form.refs.label.text('Follow all $refs');
  }
}

/**
 * Sets the "validate" label, based on which options are selected
 */
function setValidateLabel() {
  var values = getCheckedAndUnchecked(form.validate.schema, form.validate.spec);

  switch (values.checked.length) {
    case 0:
      form.validate.label.text('Don\'t validate anything');
      break;
    case 1:
      form.validate.label.text('Don\'t validate Swagger ' + values.checked[0]);
      break;
    case 2:
      form.validate.label.text('Validate everything');
  }
}

/**
 * Sets the "cache" label, based on which values are entered
 */
function setCacheLabel() {
  var http = form.cache.parse(form.cache.http.val());
  var https = form.cache.parse(form.cache.https.val());

  if (http === https) {
    if (http % 60) {
      form.cache.label.text('Cache for ' + http + ' seconds');
    }
    else {
      form.cache.label.text('Cache for ' + (http / 60) + ' minutes');
    }
  }
  else {
    form.cache.label.text('Customized caching');
  }
}

/**
 * Sets the "Validate!" button's text and value
 *
 * @param {string} methodName - The method name (e.g. "validate", "dereference", etc.)
 */
function setButtonLabel(methodName) {
  form.method.button.val(methodName.toLowerCase());
  form.method.button.text(methodName[0].toUpperCase() + methodName.substr(1) + ' it!');
}

/**
 * Examines the given checkboxes, and returns arrays of checked and unchecked values.
 *
 * @param {...jQuery} checkboxes
 * @returns {{checked: string[], unchecked: string[]}}
 */
function getCheckedAndUnchecked(checkboxes) {
  var checked = [], unchecked = [];
  for (var i = 0; i < arguments.length; i++) {
    var checkbox = arguments[i];
    if (checkbox.is(':checked')) {
      checked.push(checkbox.data('value'));
    }
    else {
      unchecked.push(checkbox.data('value'));
    }
  }
  return {checked: checked, unchecked: unchecked};
}

},{"./form":11}],10:[function(require,module,exports){
var form      = require('./form'),
    ACE_THEME = 'ace/theme/terminal';

/**
 * Initializes the ACE text editors
 */
exports.init = function() {
  this.sampleAPI = form.sampleAPI = ace.edit('sample-api');
  form.sampleAPI.setTheme(ACE_THEME);
  form.sampleAPI.getSession().setMode('ace/mode/yaml');

  this.results = $('#results');
  this.tabs = this.results.find('.nav-tabs');
  this.panes = this.results.find('.tab-content');
};

/**
 * Removes all results tabs and editors
 */
exports.clearResults = function() {
  this.results.removeClass('error animated').addClass('hidden');
  this.tabs.children().remove();
  this.panes.children().remove();
};

/**
 * Displays a successful result
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
exports.showResult = function(title, content) {
  this.results.removeClass('hidden');
  this.addResult(title || 'Sample API', content);
  showResults();
};

/**
 * Displays an error result
 *
 * @param {Error} err
 */
exports.showError = function(err) {
  this.results.removeClass('hidden').addClass('error');
  this.addResult('Error!', err.stack || err.message);
  showResults();
};

/**
 * Adds a results tab with an Ace Editor containing the given content
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
exports.addResult = function(title, content) {
  var index = this.tabs.children().length;
  var titleId = 'results-tab-' + index + '-title';
  var editorId = 'results-' + index;
  var active = index === 0 ? 'active' : '';

  // Add a tab and pane
  this.tabs.append(
    '<li id="results-tab-' + index + '" class="' + active + '" role="presentation">' +
    ' <a id="' + titleId + '" href="#results-pane-' + index + '" role="tab" aria-controls="results-pane-' + index + '" data-toggle="tab"></a>' +
    '</li>'
  );
  this.panes.append(
    '<div id="results-pane-' + index + '" class="tab-pane ' + active + '" role="tabpanel">' +
    '  <pre id="' + editorId + '" class="editor"></pre>' +
    '</div>'
  );

  // Set the tab title
  var shortTitle = getShortTitle(title);
  this.tabs.find('#' + titleId).text(shortTitle).attr('title', title);

  // Set the <pre> content
  var isJSON = false;
  if (typeof(content) === 'object') {
    content = JSON.stringify(content, null, 2);
    isJSON = true;
  }
  this.panes.find('#' + editorId).text(content);

  // Turn the <pre> into an Ace Editor
  var editor = ace.edit(editorId);
  editor.setTheme(ACE_THEME);
  editor.session.setOption('useWorker', false);
  isJSON && editor.getSession().setMode('ace/mode/json');
  editor.setReadOnly(true);
};

/**
 * Returns a short version of the given title text, to better fit in a tab
 *
 * @param {string} title
 * @returns {string}
 */
function getShortTitle(title) {
  // Get just the file name
  var lastSlash = title.lastIndexOf('/');
  if (lastSlash !== -1) {
    title = title.substr(lastSlash + 1);
  }

  if (title.length > 15) {
    // It's still too long, so, just return the first 10 characters
    title = title.substr(0, 10) + '...';
  }

  return title;
}

/**
 * Ensures that the results are visible, and plays an animation to get the user's attention.
 */
function showResults() {
  var results = exports.results;

  setTimeout(function() {
    results[0].scrollIntoView();
    results.addClass('animated')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        // Remove the "animated" class when the animation ends,
        // so we can replay the animation again next time
        results.removeClass('animated');
      });
  });
}

},{"./form":11}],11:[function(require,module,exports){
/**
 * Finds all form fields and exposes them as properties.
 */
exports.init = function() {
  this.form = $('#swagger-parser-form');

  this.allow = {
    label: this.form.find('#allow-label'),
    menu: this.form.find('#allow-menu'),
    json: this.form.find('input[name=allow-json]'),
    yaml: this.form.find('input[name=allow-yaml]'),
    empty: this.form.find('input[name=allow-empty]'),
    unknown: this.form.find('input[name=allow-unknown]')
  };

  this.refs = {
    label: this.form.find('#refs-label'),
    menu: this.form.find('#refs-menu'),
    internal: this.form.find('input[name=refs-internal]'),
    external: this.form.find('input[name=refs-external]'),
    circular: this.form.find('input[name=refs-circular]')
  };

  this.validate = {
    label: this.form.find('#validate-label'),
    menu: this.form.find('#validate-menu'),
    schema: this.form.find('input[name=validate-schema]'),
    spec: this.form.find('input[name=validate-spec]')
  };

  this.cache = {
    label: this.form.find('#cache-label'),
    menu: this.form.find('#cache-menu'),
    http: this.form.find('input[name=cache-http]'),
    https: this.form.find('input[name=cache-https]'),
    parse: parseCacheValue
  };

  this.tabs = {
    yourAPI: this.form.find('#your-api-tab'),
    sampleAPI: this.form.find('#sample-api-tab')
  };

  this.method = {
    button: this.form.find('button[name=method]'),
    menu: this.form.find('#method-menu')
  };

  this.url = this.form.find('input[name=url]');
  this.bookmark = this.form.find('#bookmark');
};

/**
 * Returns a Swagger Parser options object,
 * set to the current values of all the form fields.
 */
exports.getOptions = function() {
  return {
    allow: {
      json: this.allow.json.is(':checked'),
      yaml: this.allow.yaml.is(':checked'),
      empty: this.allow.empty.is(':checked'),
      unknown: this.allow.unknown.is(':checked')
    },
    $refs: {
      internal: this.refs.internal.is(':checked'),
      external: this.refs.external.is(':checked'),
      circular: this.refs.circular.is(':checked')
    },
    validate: {
      schema: this.validate.schema.is(':checked'),
      spec: this.validate.spec.is(':checked')
    },
    cache: {
      http: parseCacheValue(this.cache.http.val()),
      https: parseCacheValue(this.cache.https.val())
    }
  };
};

/**
 * Returns the Swagger API or URL, depending on the current form fields.
 */
exports.getAPI = function() {
  var url = this.url.val();
  if (url) {
    return url;
  }

  var sampleAPI = this.sampleAPI.getValue();
  if (this.allow.yaml.is(':checked')) {
    return SwaggerParser.YAML.parse(sampleAPI);
  }
  else if (this.allow.json.is(':checked')) {
    return JSON.parse(sampleAPI);
  }
  else {
    throw new SyntaxError('Unable to parse the API. Neither YAML nor JSON are allowed.');
  }
};

/**
 * Helper function for validating cache values.
 *
 * @param {string} val
 * @returns {number}
 */
var parseCacheValue = function(val) {
  val = parseInt(val);
  return (isNaN(val) || !isFinite(val) || val < 1) ? 300 : val;
};

},{}],12:[function(require,module,exports){
var form        = require('./form'),
    querystring = require('./querystring'),
    dropdowns   = require('./dropdowns'),
    editors     = require('./editors'),
    parser      = require('./parser');

$(function() {
  form.init();
  querystring.init();
  dropdowns.init();
  editors.init();
  parser.init();
});

},{"./dropdowns":9,"./editors":10,"./form":11,"./parser":13,"./querystring":14}],13:[function(require,module,exports){
var form    = require('./form'),
    editors = require('./editors'),
    ono     = require('ono'),
    parser  = null;

/**
 * Adds event handlers to trigger Swagger Parser methods
 */
exports.init = function() {
  // When the form is submitted, parse the Swagger API
  form.form.on('submit', function(event) {
    event.preventDefault();
    parseSwagger();
  });

  // When the "x" button is clicked, discard the results and clear the cache
  $('#clear').on('click', function() {
    parser = null;
    editors.clearResults();
  });
};

/**
 * This function is called when the "Validate it!" button is clicked.
 * It calls Swagger Parser, passing it all the options selected on the form.
 */
function parseSwagger() {
  try {
    // Clear any previous results
    editors.clearResults();

    // Get all the parameters
    parser = parser || new SwaggerParser();
    var options = form.getOptions();
    var method = form.method.button.val();
    var api = form.getAPI();

    // Call Swagger Parser
    parser[method](api, options)
      .then(function() {
        // Show the results
        var results = parser.$refs.values();
        Object.keys(results).forEach(function(key) {
          editors.showResult(key, results[key]);
        });
      })
      .catch(function(err) {
        editors.showError(ono(err));
      });
  }
  catch (err) {
    editors.showError(ono(err));
  }
}

},{"./editors":10,"./form":11,"ono":2}],14:[function(require,module,exports){
var querystring = require('querystring'),
    form        = require('./form');

/**
 * Initializes the UI, based on the query-string in the URL
 */
exports.init = function() {
  setFormFields();
  setBookmarkURL();
  form.bookmark.on('click focus mouseenter', setBookmarkURL);
};

/**
 * Populates all form fields based on the query-string in the URL
 */
function setFormFields() {
  var query = querystring.parse(window.location.search.substr(1));

  setCheckbox(form.allow.json, query['allow-json']);
  setCheckbox(form.allow.yaml, query['allow-yaml']);
  setCheckbox(form.allow.empty, query['allow-empty']);
  setCheckbox(form.allow.unknown, query['allow-unknown']);
  setCheckbox(form.refs.internal, query['refs-internal']);
  setCheckbox(form.refs.external, query['refs-external']);
  setCheckbox(form.refs.circular, query['refs-circular']);
  setCheckbox(form.validate.schema, query['validate-schema']);
  setCheckbox(form.validate.spec, query['validate-spec']);

  setNumber(form.cache.http, query['cache-http']);
  setNumber(form.cache.https, query['cache-https']);

  // If a custom URL is specified, then show the "Your API" tab
  if (query.url) {
    form.url.val(query.url);
    form.tabs.yourAPI.tab('show');
  }

  // If a method is specified, then change the "Validate!" button
  if (query.method) {
    query.method = query.method.toLowerCase();
    if (['parse', 'resolve', 'bundle', 'dereference', 'validate'].indexOf(query.method) !== -1) {
      form.method.button.val(query.method);
    }
  }
};

/**
 * Checks or unchecks the given checkbox, based on the given value.
 *
 * @param {jQuery} input
 * @param {*} value
 */
function setCheckbox(input, value) {
  if (!value || value === 'true' || value === 'on') {
    value = 'yes';
  }
  input.val([value]);
}

/**
 * Sets the value of a number field, based on the given value.
 *
 * @param {jQuery} input
 * @param {*} value
 */
function setNumber(input, value) {
  input.val(form.cache.parse(value));
}

/**
 * Sets the href of the bookmark link, based on the values of each form field
 */
function setBookmarkURL() {
  var query = {};
  var options = form.getOptions();
  options.allow.json || (query['allow-json'] = 'no');
  options.allow.yaml || (query['allow-yaml'] = 'no');
  options.allow.empty || (query['allow-empty'] = 'no');
  options.allow.unknown || (query['allow-unknown'] = 'no');
  options.$refs.internal || (query['refs-internal'] = 'no');
  options.$refs.external || (query['refs-external'] = 'no');
  options.$refs.circular || (query['refs-circular'] = 'no');
  options.validate.schema || (query['validate-schema'] = 'no');
  options.validate.spec || (query['validate-spec'] = 'no');
  options.cache.http === 300 || (query['cache-http'] = options.cache.http);
  options.cache.https === 300 || (query['cache-https'] = options.cache.https);

  var method = form.method.button.val();
  method === 'validate' || (query['method'] = method);

  var url = form.url.val();
  url === '' || (query['url'] = url);

  var bookmark = '?' + querystring.stringify(query);
  form.bookmark.attr('href', bookmark);
}

},{"./form":11,"querystring":6}]},{},[12])
//# sourceMappingURL=bundle.js.map
