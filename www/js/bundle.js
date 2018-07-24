/*!
 * Swagger Parser v5.0.0 (July 24th 2018)
 * 
 * http://bigstickcarpet.com/swagger-parser
 * 
 * @author  James Messinger (http://bigstickcarpet.com)
 * @license MIT
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"format-util":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

module.exports = analytics;

/**
 * Initializes Google Analytics and sends a "pageview" hit
 */
function analytics () {
  if (!debug) {
    ga('create', 'UA-68102273-1', 'auto');
    ga('send', 'pageview');
  }
}

/**
 * Tracks an event in Google Analytics
 *
 * @param {string} category - the object type (e.g. "button", "menu", "link", etc.)
 * @param {string} action - the action (e.g. "click", "show", "hide", etc.)
 * @param {string} [label] - label for categorization
 * @param {number} [value] - numeric value, such as a counter
 */
analytics.trackEvent = function (category, action, label, value) {
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
analytics.trackError = function (err) {
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

module.exports = dropdowns;

/**
 * Adds all the drop-down menu functionality
 */
function dropdowns () {
  // Set the initial method name (in case it was set by the querystring module)
  setSelectedMethod(form.method.button.val());

  // Update each dropdown's label when its value(s) change
  onChange(form.allow.menu, setAllowLabel);
  onChange(form.refs.menu, setRefsLabel);
  onChange(form.validate.menu, setValidateLabel);

  // Track option changes
  trackCheckbox(form.allow.json);
  trackCheckbox(form.allow.yaml);
  trackCheckbox(form.allow.text);
  trackCheckbox(form.allow.empty);
  trackCheckbox(form.allow.unknown);
  trackCheckbox(form.refs.external);
  trackCheckbox(form.refs.circular);
  trackCheckbox(form.validate.schema);
  trackCheckbox(form.validate.spec);

  // Change the button text whenever a new method is selected
  form.method.menu.find('a').on('click', function (event) {
    form.method.menu.dropdown('toggle');
    event.stopPropagation();
    var methodName = $(this).data('value');
    setSelectedMethod(methodName);
    trackButtonLabel(methodName);
  });
}

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
    form.allow.json, form.allow.yaml, form.allow.text, form.allow.empty, form.allow.unknown);

  switch (values.checked.length) {
    case 0:
      form.allow.label.text('No file types allowed');
      break;
    case 1:
      form.allow.label.text('Only allow ' + values.checked[0] + ' files');
      break;
    case 2:
      form.allow.label.text('Only allow ' + values.checked[0] + ' and ' + values.checked[1]);
      break;
    case 3:
      form.allow.label.text('Don\'t allow ' + values.unchecked[0] + ' or ' + values.unchecked[1]);
      break;
    case 4:
      form.allow.label.text('Don\'t allow ' + values.unchecked[0] + ' files');
      break;
    case 5:
      form.allow.label.text('Allow all file types');
  }
}

/**
 * Sets the "refs" label, based on which options are selected
 */
function setRefsLabel () {
  var values = getCheckedAndUnchecked(form.refs.external, form.refs.circular);

  switch (values.checked.length) {
    case 0:
      form.refs.label.text('Only follow internal $refs');
      break;
    case 1:
      form.refs.label.text('Don\'t follow ' + values.unchecked[0] + ' $refs');
      break;
    case 2:
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
      form.validate.label.text('Don\'t validate Swagger ' + values.unchecked[0]);
      break;
    case 2:
      form.validate.label.text('Validate everything');
  }
}

/**
 * Updates the UI to match the specified method name
 *
 * @param {string} methodName - The method name (e.g. "validate", "dereference", etc.)
 */
function setSelectedMethod (methodName) {
  form.method.button.val(methodName.toLowerCase());

  methodName = methodName[0].toUpperCase() + methodName.substr(1);
  form.method.button.text(methodName + ' it!');
  form.tabs.url.text(methodName + ' a URL');
  form.tabs.text.text(methodName + ' Text');
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

module.exports = editors;

/**
 * Initializes the ACE text editors
 */
function editors () {
  editors.textBox = form.textBox = ace.edit('text-box');
  form.textBox.setTheme(ACE_THEME);
  var session = form.textBox.getSession();
  session.setMode('ace/mode/yaml');
  session.setTabSize(2);

  editors.results = $('#results');
  editors.tabs = editors.results.find('.nav-tabs');
  editors.panes = editors.results.find('.tab-content');
}

/**
 * Removes all results tabs and editors
 */
editors.clearResults = function () {
  editors.results.removeClass('error animated').addClass('hidden');
  editors.tabs.children().remove();
  editors.panes.children().remove();
};

/**
 * Displays a successful result
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
editors.showResult = function (title, content) {
  editors.results.removeClass('hidden');
  editors.addResult(title || 'Sample API', content);
  showResults();
};

/**
 * Displays an error result
 *
 * @param {Error} err
 */
editors.showError = function (err) {
  editors.results.removeClass('hidden').addClass('error');
  editors.addResult('Error!', err);
  showResults();
};

/**
 * Adds a results tab with an Ace Editor containing the given content
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
editors.addResult = function (title, content) {
  var index = editors.tabs.children().length;
  var titleId = 'results-tab-' + index + '-title';
  var editorId = 'results-' + index;
  var active = index === 0 ? 'active' : '';

  // Add a tab and pane
  editors.tabs.append(
    '<li id="results-tab-' + index + '" class="' + active + '" role="presentation">' +
    ' <a id="' + titleId + '" href="#results-pane-' + index + '" role="tab" aria-controls="results-pane-' + index + '" data-toggle="tab"></a>' +
    '</li>'
  );
  editors.panes.append(
    '<div id="results-pane-' + index + '" class="tab-pane ' + active + '" role="tabpanel">' +
    '  <pre id="' + editorId + '" class="editor"></pre>' +
    '</div>'
  );

  // Set the tab title
  var shortTitle = getShortTitle(title);
  editors.tabs.find('#' + titleId).text(shortTitle).attr('title', title);

  // Set the <pre> content
  content = toText(content);
  editors.panes.find('#' + editorId).text(content.text);

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
  var results = editors.results;

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

},{"./form":9,"ono":1}],9:[function(require,module,exports){
'use strict';

module.exports = form;

/**
 * Finds all form fields and exposes them as properties.
 */
function form () {
  form.form = $('#swagger-parser-form');

  form.allow = {
    label: form.form.find('#allow-label'),
    menu: form.form.find('#allow-menu'),
    json: form.form.find('input[name=allow-json]'),
    yaml: form.form.find('input[name=allow-yaml]'),
    text: form.form.find('input[name=allow-text]'),
    empty: form.form.find('input[name=allow-empty]'),
    unknown: form.form.find('input[name=allow-unknown]')
  };

  form.refs = {
    label: form.form.find('#refs-label'),
    menu: form.form.find('#refs-menu'),
    external: form.form.find('input[name=refs-external]'),
    circular: form.form.find('input[name=refs-circular]')
  };

  form.validate = {
    label: form.form.find('#validate-label'),
    menu: form.form.find('#validate-menu'),
    schema: form.form.find('input[name=validate-schema]'),
    spec: form.form.find('input[name=validate-spec]')
  };

  form.tabs = {
    url: form.form.find('#url-tab'),
    text: form.form.find('#text-tab')
  };

  form.method = {
    button: form.form.find('button[name=method]'),
    menu: form.form.find('#method-menu')
  };

  form.samples = {
    url: {
      container: form.form.find('#url-sample'),
      link: form.form.find('#url-sample-link'),
    },
    text: {
      container: form.form.find('#text-sample'),
      link: form.form.find('#text-sample-link'),
    }
  };

  form.url = form.form.find('input[name=url]');
  form.textBox = null; // This is set in editors.js
  form.bookmark = form.form.find('#bookmark');
}

/**
 * Returns a Swagger Parser options object,
 * set to the current values of all the form fields.
 */
form.getOptions = function () {
  return {
    parse: {
      json: form.allow.json.is(':checked') ? {
        allowEmpty: form.allow.empty.is(':checked'),
      } : false,
      yaml: form.allow.yaml.is(':checked') ? {
        allowEmpty: form.allow.empty.is(':checked'),
      } : false,
      text: form.allow.text.is(':checked') ? {
        allowEmpty: form.allow.empty.is(':checked'),
      } : false,
      binary: form.allow.unknown.is(':checked') ? {
        allowEmpty: form.allow.empty.is(':checked'),
      } : false,
    },
    resolve: {
      external: form.refs.external.is(':checked'),
    },
    dereference: {
      circular: form.refs.circular.is(':checked'),
    },
    validate: {
      schema: form.validate.schema.is(':checked'),
      spec: form.validate.spec.is(':checked'),
    },
  };
};

/**
 * Returns the Swagger API or URL, depending on the current form fields.
 */
form.getAPI = function () {
  // Determine which tab is selected
  if (form.tabs.url.parent().attr('class').indexOf('active') >= 0) {
    var url = form.url.val();
    if (url) {
      return url;
    }
    else {
      throw new URIError('Please specify the URL of your Swagger/OpenAPI definition');
    }
  }
  else {
    var text = form.textBox.getValue();
    if (form.allow.yaml.is(':checked')) {
      return SwaggerParser.YAML.parse(text);
    }
    else if (form.allow.json.is(':checked')) {
      return JSON.parse(text);
    }
    else {
      throw new SyntaxError('Unable to parse the API. Neither YAML nor JSON are allowed.');
    }
  }
};

},{}],10:[function(require,module,exports){
'use strict';

var form = require('./form'),
    querystring = require('./querystring'),
    dropdowns = require('./dropdowns'),
    editors = require('./editors'),
    samples = require('./samples'),
    parser = require('./parser'),
    analytics = require('./analytics');

$(function () {
  form();
  querystring();
  dropdowns();
  editors();
  samples();
  parser();
  analytics();
});

},{"./analytics":6,"./dropdowns":7,"./editors":8,"./form":9,"./parser":11,"./querystring":12,"./samples":13}],11:[function(require,module,exports){
'use strict';

var form = require('./form'),
    editors = require('./editors'),
    analytics = require('./analytics'),
    ono = require('ono'),
    swaggerParser = null,
    counters = { parse: 0, resolve: 0, bundle: 0, dereference: 0, validate: 0 };

module.exports = parser;

/**
 * Adds event handlers to trigger Swagger Parser methods
 */
function parser () {
  // When the form is submitted, parse the Swagger API
  form.form.on('submit', function (event) {
    event.preventDefault();
    parseSwagger();
  });

  // When the "x" button is clicked, discard the results
  $('#clear').on('click', function () {
    swaggerParser = null;
    editors.clearResults();
    analytics.trackEvent('results', 'clear');
  });
}

/**
 * This function is called when the "Validate it!" button is clicked.
 * It calls Swagger Parser, passing it all the options selected on the form.
 */
function parseSwagger () {
  try {
    // Clear any previous results
    editors.clearResults();

    // Get all the parameters
    swaggerParser = swaggerParser || new SwaggerParser();
    var options = form.getOptions();
    var method = form.method.button.val();
    var api = form.getAPI();

    // Call Swagger Parser
    swaggerParser[method](api, options)
      .then(function () {
        // Show the results
        var results = swaggerParser.$refs.values();
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

},{"./analytics":6,"./editors":8,"./form":9,"ono":1}],12:[function(require,module,exports){
'use strict';

var qs = require('querystring'),
    form = require('./form');

module.exports = querystring;

/**
 * Initializes the UI, based on the query-string in the URL
 */
function querystring () {
  setFormFields();
  setBookmarkURL();
  form.bookmark.on('click focus mouseenter', setBookmarkURL);
}

/**
 * Populates all form fields based on the query-string in the URL
 */
function setFormFields () {
  var query = qs.parse(window.location.search.substr(1));

  setCheckbox(form.allow.json, query['allow-json']);
  setCheckbox(form.allow.yaml, query['allow-yaml']);
  setCheckbox(form.allow.text, query['allow-text']);
  setCheckbox(form.allow.empty, query['allow-empty']);
  setCheckbox(form.allow.unknown, query['allow-unknown']);
  setCheckbox(form.refs.external, query['refs-external']);
  setCheckbox(form.refs.circular, query['refs-circular']);
  setCheckbox(form.validate.schema, query['validate-schema']);
  setCheckbox(form.validate.spec, query['validate-spec']);

  // If a custom URL is specified, then show the "Your API" tab
  if (query.url) {
    form.url.val(query.url);
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
 * Sets the href of the bookmark link, based on the values of each form field
 */
function setBookmarkURL () {
  var query = {};
  var options = form.getOptions();
  options.parse.json || (query['allow-json'] = 'no');
  options.parse.yaml || (query['allow-yaml'] = 'no');
  options.parse.text || (query['allow-text'] = 'no');
  options.parse.json.allowEmpty || (query['allow-empty'] = 'no');
  options.parse.binary || (query['allow-unknown'] = 'no');
  options.resolve.external || (query['refs-external'] = 'no');
  options.dereference.circular || (query['refs-circular'] = 'no');
  options.validate.schema || (query['validate-schema'] = 'no');
  options.validate.spec || (query['validate-spec'] = 'no');

  var method = form.method.button.val();
  method === 'validate' || (query.method = method);

  var url = form.url.val();
  url === '' || (query.url = url);

  var bookmark = '?' + qs.stringify(query);
  form.bookmark.attr('href', bookmark);
}

},{"./form":9,"querystring":5}],13:[function(require,module,exports){
'use strict';

var form = require('./form');

module.exports = samples;

/**
 * Allows the user to use a sample URL or sample API text
 */
function samples () {
  form.samples.url.link.on('click', function (event) {
    event.preventDefault();
    form.url.val(samples.url);
  });

  form.samples.text.link.on('click', function (event) {
    event.preventDefault();
    form.textBox.setValue(samples.text, -1);
    form.samples.text.container.hide();
    form.textBox.focus();
  });

  form.textBox.on('input', function () {
    if (form.textBox.session.getValue().length === 0) {
      form.samples.text.container.show();
    }
    else {
      form.samples.text.container.hide();
    }
  });
}

samples.url = 'http://bigstickcarpet.com/swagger-parser/www/swagger.yaml';

samples.text =
  'swagger: "2.0"\n' +
  'info:\n' +
  '  version: 1.0.0\n' +
  '  title: Swagger Petstore\n' +
  '  description: >\n' +
  '    A sample API that uses a petstore as an example\n' +
  '    to demonstrate features in the swagger-2.0 specification\n' +
  'consumes:\n' +
  '  - application/json\n' +
  'produces:\n' +
  '  - application/json\n' +
  'paths:\n' +
  '  /pets:\n' +
  '    get:\n' +
  '      description: Returns all pets from the petstore\n' +
  '      responses:\n' +
  '        "200":\n' +
  '          description: pet response\n' +
  '          schema:\n' +
  '            type: array\n' +
  '            items:\n' +
  '              $ref: "#/definitions/pet"\n' +
  '        default:\n' +
  '          description: unexpected error\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/errorModel"\n' +
  '    post:\n' +
  '      description: Creates a new pet in the store\n' +
  '      parameters:\n' +
  '        - name: pet\n' +
  '          in: body\n' +
  '          description: Pet to add to the store\n' +
  '          required: true\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/pet"\n' +
  '      responses:\n' +
  '        "200":\n' +
  '          description: pet response\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/pet"\n' +
  '        default:\n' +
  '          description: unexpected error\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/errorModel"\n' +
  '  "/pets/{name}":\n' +
  '    get:\n' +
  '      description: Returns a single pet by name\n' +
  '      parameters:\n' +
  '        - name: name\n' +
  '          in: path\n' +
  '          description: Name of the pet to fetch\n' +
  '          required: true\n' +
  '          type: string\n' +
  '      responses:\n' +
  '        "200":\n' +
  '          description: pet response\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/pet"\n' +
  '        default:\n' +
  '          description: unexpected error\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/errorModel"\n' +
  'definitions:\n' +
  '  pet:\n' +
  '    $ref: pet.yaml\n' +
  '  pet-owner:\n' +
  '    $ref: pet-owner.yaml\n' +
  '  errorModel:\n' +
  '    $ref: error.json\n';

},{"./form":9}]},{},[10])
//# sourceMappingURL=bundle.js.map
