/*!
 * Swagger Parser v4.0.0-beta.2 (October 19th 2017)
 * 
 * https://bigstickcarpet.github.io/swagger-parser
 * 
 * @author  James Messinger (http://jamesmessinger.com)
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function format(fmt) {
  var re = /(%?)(%([jds]))/g
    , args = Array.prototype.slice.call(arguments, 1);
  if(args.length) {
    fmt = fmt.replace(re, function(match, escaped, ptn, flag) {
      var arg = args.shift();
      switch(flag) {
        case 's':
          arg = '' + arg;
          break;
        case 'd':
          arg = Number(arg);
          break;
        case 'j':
          arg = JSON.stringify(arg);
          break;
      }
      if(!escaped) {
        return arg; 
      }
      args.unshift(arg);
      return match;
    })
  }

  // arguments remain after formatting
  if(args.length) {
    fmt += ' ' + args.join(' ');
  }

  // update escaped %% values
  fmt = fmt.replace(/%{2,2}/g, '%');

  return '' + fmt;
}

module.exports = format;

},{}],2:[function(require,module,exports){
'use strict';

var format = require('format-util');
var slice = Array.prototype.slice;
var protectedProperties = ['name', 'message', 'stack'];
var errorPrototypeProperties = [
  'name', 'message', 'description', 'number', 'code', 'fileName', 'lineNumber', 'columnNumber',
  'sourceURL', 'line', 'column', 'stack'
];

module.exports = create(Error);
module.exports.error = create(Error);
module.exports.eval = create(EvalError);
module.exports.range = create(RangeError);
module.exports.reference = create(ReferenceError);
module.exports.syntax = create(SyntaxError);
module.exports.type = create(TypeError);
module.exports.uri = create(URIError);
module.exports.formatter = format;

/**
 * Creates a new {@link ono} function that creates the given Error class.
 *
 * @param {Class} Klass - The Error subclass to create
 * @returns {ono}
 */
function create (Klass) {
  /**
   * @param {Error}   [err]     - The original error, if any
   * @param {object}  [props]   - An object whose properties will be added to the error object
   * @param {string}  [message] - The error message. May contain {@link util#format} placeholders
   * @param {...*}    [params]  - Parameters that map to the `message` placeholders
   * @returns {Error}
   */
  return function onoFactory (err, props, message, params) {   // eslint-disable-line no-unused-vars
    var formatArgs = [];
    var formattedMessage = '';

    // Determine which arguments were actually specified
    if (typeof err === 'string') {
      formatArgs = slice.call(arguments);
      err = props = undefined;
    }
    else if (typeof props === 'string') {
      formatArgs = slice.call(arguments, 1);
      props = undefined;
    }
    else if (typeof message === 'string') {
      formatArgs = slice.call(arguments, 2);
    }

    // If there are any format arguments, then format the error message
    if (formatArgs.length > 0) {
      formattedMessage = module.exports.formatter.apply(null, formatArgs);
    }

    if (err && err.message) {
      // The inner-error's message will be added to the new message
      formattedMessage += (formattedMessage ? ' \n' : '') + err.message;
    }

    // Create the new error
    // NOTE: DON'T move this to a separate function! We don't want to pollute the stack trace
    var newError = new Klass(formattedMessage);

    // Extend the new error with the additional properties
    extendError(newError, err);   // Copy properties of the original error
    extendToJSON(newError);       // Replace the original toJSON method
    extend(newError, props);      // Copy custom properties, possibly including a custom toJSON method

    return newError;
  };
}

/**
 * Extends the targetError with the properties of the source error.
 *
 * @param {Error}   targetError - The error object to extend
 * @param {?Error}  sourceError - The source error object, if any
 */
function extendError (targetError, sourceError) {
  extendStack(targetError, sourceError);
  extend(targetError, sourceError);
}

/**
 * JavaScript engines differ in how errors are serialized to JSON - especially when it comes
 * to custom error properties and stack traces.  So we add our own toJSON method that ALWAYS
 * outputs every property of the error.
 */
function extendToJSON (error) {
  error.toJSON = errorToJSON;

  // Also add an inspect() method, for compatibility with Node.js' `util.inspect()` method
  error.inspect = errorToString;
}

/**
 * Extends the target object with the properties of the source object.
 *
 * @param {object}  target - The object to extend
 * @param {?source} source - The object whose properties are copied
 */
function extend (target, source) {
  if (source && typeof source === 'object') {
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      // Don't copy "protected" properties, since they have special meaning/behavior
      // and are set by the onoFactory function
      if (protectedProperties.indexOf(key) >= 0) {
        continue;
      }

      try {
        target[key] = source[key];
      }
      catch (e) {
        // This property is read-only, so it can't be copied
      }
    }
  }
}

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 *
 * @returns {object}
 */
function errorToJSON () {
  var json = {};

  // Get all the properties of this error
  var keys = Object.keys(this);

  // Also include properties from the Error prototype
  keys = keys.concat(errorPrototypeProperties);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = this[key];
    var type = typeof value;
    if (type !== 'undefined' && type !== 'function') {
      json[key] = value;
    }
  }

  return json;
}

/**
 * Serializes Error objects as human-readable JSON strings for debugging/logging purposes.
 *
 * @returns {string}
 */
function errorToString () {
  return JSON.stringify(this, null, 2).replace(/\\n/g, '\n');
}

/**
 * Extend the error stack to include its cause
 *
 * @param {Error} targetError
 * @param {Error} sourceError
 */
function extendStack (targetError, sourceError) {
  if (hasLazyStack(targetError)) {
    if (sourceError) {
      lazyJoinStacks(targetError, sourceError);
    }
    else {
      lazyPopStack(targetError);
    }
  }
  else {
    if (sourceError) {
      targetError.stack = joinStacks(targetError.stack, sourceError.stack);
    }
    else {
      targetError.stack = popStack(targetError.stack);
    }
  }
}

/**
 * Appends the original {@link Error#stack} property to the new Error's stack.
 *
 * @param {string} newStack
 * @param {string} originalStack
 * @returns {string}
 */
function joinStacks (newStack, originalStack) {
  newStack = popStack(newStack);

  if (newStack && originalStack) {
    return newStack + '\n\n' + originalStack;
  }
  else {
    return newStack || originalStack;
  }
}

/**
 * Removes Ono from the stack, so that the stack starts at the original error location
 *
 * @param {string} stack
 * @returns {string}
 */
function popStack (stack) {
  if (stack) {
    var lines = stack.split('\n');

    if (lines.length < 2) {
      // The stack only has one line, so there's nothing we can remove
      return stack;
    }

    // Find the `onoFactory` call in the stack, and remove it
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.indexOf('onoFactory') >= 0) {
        lines.splice(i, 1);
        return lines.join('\n');
      }
    }

    // If we get here, then the stack doesn't contain a call to `onoFactory`.
    // This may be due to minification or some optimization of the JS engine.
    // So just return the stack as-is.
    return stack;
  }
}

/**
 * Does a one-time determination of whether this JavaScript engine
 * supports lazy `Error.stack` properties.
 */
var supportsLazyStack = (function () {
  return !!(
    // ES5 property descriptors must be supported
    Object.getOwnPropertyDescriptor && Object.defineProperty &&

    // Chrome on Android doesn't support lazy stacks :(
    (typeof navigator === 'undefined' || !/Android/.test(navigator.userAgent))
  );
}());

/**
 * Does this error have a lazy stack property?
 *
 * @param {Error} err
 * @returns {boolean}
 */
function hasLazyStack (err) {
  if (!supportsLazyStack) {
    return false;
  }

  var descriptor = Object.getOwnPropertyDescriptor(err, 'stack');
  if (!descriptor) {
    return false;
  }
  return typeof descriptor.get === 'function';
}

/**
 * Calls {@link joinStacks} lazily, when the {@link Error#stack} property is accessed.
 *
 * @param {Error} targetError
 * @param {Error} sourceError
 */
function lazyJoinStacks (targetError, sourceError) {
  var targetStack = Object.getOwnPropertyDescriptor(targetError, 'stack');

  Object.defineProperty(targetError, 'stack', {
    get: function () {
      return joinStacks(targetStack.get.apply(targetError), sourceError.stack);
    },
    enumerable: false,
    configurable: true
  });
}

/**
 * Calls {@link popStack} lazily, when the {@link Error#stack} property is accessed.
 *
 * @param {Error} error
 */
function lazyPopStack (error) {
  var targetStack = Object.getOwnPropertyDescriptor(error, 'stack');

  Object.defineProperty(error, 'stack', {
    get: function () {
      return popStack(targetStack.get.apply(error));
    },
    enumerable: false,
    configurable: true
  });
}

},{"format-util":1}],3:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){
'use strict';

var debug = location.hostname === 'localhost';

/**
 * Initializes Google Analytics and sends a "pageview" hit
 */
exports.init = function () {
  if (!debug) {
    ga('create', 'UA-68102273-1', 'auto');
    ga('send', 'pageview');
  }
};

/**
 * Tracks an event in Google Analytics
 *
 * @param {string} category - the object type (e.g. "button", "menu", "link", etc.)
 * @param {string} action - the action (e.g. "click", "show", "hide", etc.)
 * @param {string} [label] - label for categorization
 * @param {number} [value] - numeric value, such as a counter
 */
exports.trackEvent = function (category, action, label, value) {
  if (debug) {
    console.log('Reporting an event to Google Analytics: ', category, action, label, value);
  }
  else {
    ga('send', 'event', category, action, label, value);
  }
};

/**
 * Tracks an error in Google Analytics
 *
 * @param {Error} err
 */
exports.trackError = function (err) {
  if (debug) {
    console.error('Reporting an error to Google Analytics: ', err);
  }
  else {
    ga('send', 'exception', { exDescription: err.message });
  }
};

},{}],7:[function(require,module,exports){
'use strict';

var form = require('./form'),
    analytics = require('./analytics');

/**
 * Adds all the drop-down menu functionality
 */
exports.init = function () {
  // Update each dropdown's label when its value(s) change
  onChange(form.allow.menu, setAllowLabel);
  onChange(form.refs.menu, setRefsLabel);
  onChange(form.validate.menu, setValidateLabel);
  onChange(form.cache.menu, setCacheLabel);

  // Track option changes
  trackCheckbox(form.allow.json);
  trackCheckbox(form.allow.yaml);
  trackCheckbox(form.allow.empty);
  trackCheckbox(form.allow.unknown);
  trackCheckbox(form.refs.internal);
  trackCheckbox(form.refs.external);
  trackCheckbox(form.refs.circular);
  trackCheckbox(form.validate.schema);
  trackCheckbox(form.validate.spec);
  trackTextbox(form.cache.http);
  trackTextbox(form.cache.https);

  // Change the button text whenever a new method is selected
  setButtonLabel(form.method.button.val());
  form.method.menu.find('a').on('click', function (event) {
    form.method.menu.dropdown('toggle');
    event.stopPropagation();
    var methodName = $(this).data('value');
    setButtonLabel(methodName);
    trackButtonLabel(methodName);
  });
};

/**
 * Calls the given function whenever the user selects (or deselects)
 * a value in the given drop-down menu.
 *
 * @param {jQuery} menu
 * @param {function} setLabel
 */
function onChange (menu, setLabel) {
  var dropdown = menu.parent('.dropdown');

  // Don't auto-close the menu when items are clicked
  menu.find('a').on('click', function (event) {
    event.stopPropagation();
  });

  // Set the label immediately, and again whenever the menu is closed
  setLabel();
  dropdown.on('hidden.bs.dropdown', setLabel);

  // Track when a dropdown menu is shown
  dropdown.on('shown.bs.dropdown', function () {
    analytics.trackEvent('options', 'shown', menu.attr('id'));
  });
}

/**
 * Sets the "allow" label, based on which options are selected
 */
function setAllowLabel () {
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
function setRefsLabel () {
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
function setValidateLabel () {
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
function setCacheLabel () {
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
function setButtonLabel (methodName) {
  form.method.button.val(methodName.toLowerCase());
  form.method.button.text(methodName[0].toUpperCase() + methodName.substr(1) + ' it!');
}

/**
 * Tracks changes to a checkbox option
 *
 * @param {jQuery} checkbox
 */
function trackCheckbox (checkbox) {
  checkbox.on('change', function () {
    var value = checkbox.is(':checked') ? 1 : 0;
    analytics.trackEvent('options', 'changed', checkbox.attr('name'), value);
  });
}

/**
 * Tracks changes to a numeric textbox option
 *
 * @param {jQuery} textbox
 */
function trackTextbox (textbox) {
  textbox.on('blur', function () {
    var value = form.cache.parse(textbox.val());
    analytics.trackEvent('options', 'changed', textbox.attr('name'), value);
  });
}

/**
 * Tracks changes to the "Validate!" button
 *
 * @param {string} methodName - The method name (e.g. "validate", "dereference", etc.)
 */
function trackButtonLabel (methodName) {
  var value = ['', 'parse', 'resolve', 'bundle', 'dereference', 'validate'].indexOf(methodName);
  analytics.trackEvent('options', 'changed', 'method', value);
}

/**
 * Examines the given checkboxes, and returns arrays of checked and unchecked values.
 *
 * @param {...jQuery} checkboxes
 * @returns {{checked: string[], unchecked: string[]}}
 */
function getCheckedAndUnchecked (checkboxes) {
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
  return { checked: checked, unchecked: unchecked };
}

},{"./analytics":6,"./form":9}],8:[function(require,module,exports){
'use strict';

var form = require('./form'),
    ono = require('ono'),
    ACE_THEME = 'ace/theme/terminal';

/**
 * Initializes the ACE text editors
 */
exports.init = function () {
  this.sampleAPI = form.sampleAPI = ace.edit('sample-api');
  form.sampleAPI.setTheme(ACE_THEME);
  var session = form.sampleAPI.getSession();
  session.setMode('ace/mode/yaml');
  session.setTabSize(2);

  this.results = $('#results');
  this.tabs = this.results.find('.nav-tabs');
  this.panes = this.results.find('.tab-content');
};

/**
 * Removes all results tabs and editors
 */
exports.clearResults = function () {
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
exports.showResult = function (title, content) {
  this.results.removeClass('hidden');
  this.addResult(title || 'Sample API', content);
  showResults();
};

/**
 * Displays an error result
 *
 * @param {Error} err
 */
exports.showError = function (err) {
  this.results.removeClass('hidden').addClass('error');
  this.addResult('Error!', err);
  showResults();
};

/**
 * Adds a results tab with an Ace Editor containing the given content
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
exports.addResult = function (title, content) {
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
  content = toText(content);
  this.panes.find('#' + editorId).text(content.text);

  // Turn the <pre> into an Ace Editor
  var editor = ace.edit(editorId);
  editor.setTheme(ACE_THEME);
  editor.session.setOption('useWorker', false);
  content.isJSON && editor.getSession().setMode('ace/mode/json');
  editor.setReadOnly(true);
};

/**
 * Returns a short version of the given title text, to better fit in a tab
 *
 * @param {string} title
 * @returns {string}
 */
function getShortTitle (title) {
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
function showResults () {
  var results = exports.results;

  setTimeout(function () {
    results[0].scrollIntoView();
    results.addClass('animated')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        // Remove the "animated" class when the animation ends,
        // so we can replay the animation again next time
        results.removeClass('animated');
      });
  });
}

/**
 * Converts the given object to text.
 * If possible, it is converted to JSON; otherwise, plain text.
 *
 * @param {object} obj
 * @returns {object}
 */
function toText (obj) {
  if (obj instanceof Error) {
    return {
      isJSON: false,
      text: obj.message + '\n\n' + obj.stack
    };
  }
  else {
    try {
      return {
        isJSON: true,
        text: JSON.stringify(obj, null, 2)
      };
    }
    catch (e) {
      return {
        isJSON: false,
        text: 'This API is valid, but it cannot be shown because it contains circular references\n\n' + e.stack
      };
    }
  }
}

},{"./form":9,"ono":2}],9:[function(require,module,exports){
'use strict';

/**
 * Finds all form fields and exposes them as properties.
 */
exports.init = function () {
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
exports.getOptions = function () {
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
exports.getAPI = function () {
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
function parseCacheValue (val) {
  val = parseInt(val);
  return (isNaN(val) || !isFinite(val) || val < 1) ? 300 : val;
}

},{}],10:[function(require,module,exports){
'use strict';

var form = require('./form'),
    querystring = require('./querystring'),
    dropdowns = require('./dropdowns'),
    editors = require('./editors'),
    parser = require('./parser'),
    analytics = require('./analytics');

$(function () {
  form.init();
  querystring.init();
  dropdowns.init();
  editors.init();
  parser.init();
  analytics.init();
});

},{"./analytics":6,"./dropdowns":7,"./editors":8,"./form":9,"./parser":11,"./querystring":12}],11:[function(require,module,exports){
'use strict';

var form = require('./form'),
    editors = require('./editors'),
    analytics = require('./analytics'),
    ono = require('ono'),
    parser = null,
    counters = { parse: 0, resolve: 0, bundle: 0, dereference: 0, validate: 0 };

/**
 * Adds event handlers to trigger Swagger Parser methods
 */
exports.init = function () {
  // When the form is submitted, parse the Swagger API
  form.form.on('submit', function (event) {
    event.preventDefault();
    parseSwagger();
  });

  // When the "x" button is clicked, discard the results and clear the cache
  $('#clear').on('click', function () {
    parser = null;
    editors.clearResults();
    analytics.trackEvent('cache', 'clear');
  });
};

/**
 * This function is called when the "Validate it!" button is clicked.
 * It calls Swagger Parser, passing it all the options selected on the form.
 */
function parseSwagger () {
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
      .then(function () {
        // Show the results
        var results = parser.$refs.values();
        Object.keys(results).forEach(function (key) {
          editors.showResult(key, results[key]);
        });
      })
      .catch(function (err) {
        editors.showError(ono(err));
        analytics.trackError(err);
      });

    // Track the operation
    counters[method]++;
    analytics.trackEvent('button', 'click', method, counters[method]);
  }
  catch (err) {
    editors.showError(ono(err));
    analytics.trackError(err);
  }
}

},{"./analytics":6,"./editors":8,"./form":9,"ono":2}],12:[function(require,module,exports){
'use strict';

var querystring = require('querystring'),
    form = require('./form');

/**
 * Initializes the UI, based on the query-string in the URL
 */
exports.init = function () {
  setFormFields();
  setBookmarkURL();
  form.bookmark.on('click focus mouseenter', setBookmarkURL);
};

/**
 * Populates all form fields based on the query-string in the URL
 */
function setFormFields () {
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
}

/**
 * Checks or unchecks the given checkbox, based on the given value.
 *
 * @param {jQuery} input
 * @param {*} value
 */
function setCheckbox (input, value) {
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
function setNumber (input, value) {
  input.val(form.cache.parse(value));
}

/**
 * Sets the href of the bookmark link, based on the values of each form field
 */
function setBookmarkURL () {
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
  method === 'validate' || (query.method = method);

  var url = form.url.val();
  url === '' || (query.url = url);

  var bookmark = '?' + querystring.stringify(query);
  form.bookmark.attr('href', bookmark);
}

},{"./form":9,"querystring":5}]},{},[10])
//# sourceMappingURL=bundle.js.map
