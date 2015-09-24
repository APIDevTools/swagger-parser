(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
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
      form.refs.label.text('Only allow ' + values.checked[0] + ' $refs');
      break;
    case 2:
      form.refs.label.text('Don\'t allow ' + values.unchecked[0] + ' $refs');
      break;
    case 3:
      form.refs.label.text('Allow all $refs');
  }
}

/**
 * Sets the "validate" label, based on which options are selected
 */
function setValidateLabel() {
  var values = getCheckedAndUnchecked(form.validate.schema, form.validate.spec);

  switch (values.checked.length) {
    case 0:
      form.validate.label.text('Don\'t validate');
      break;
    case 1:
      form.validate.label.text('Swagger ' + values.checked[0] + ' validation');
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

},{"./form":6}],5:[function(require,module,exports){
/**
 * Initializes the ACE text editors
 */
exports.init = function() {
  var editor = ace.edit('sample-api');
  editor.setTheme('ace/theme/terminal');
  editor.getSession().setMode('ace/mode/yaml');
};

},{}],6:[function(require,module,exports){
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
  this.sampleAPI = this.form.find('#sample-api');
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

},{}],7:[function(require,module,exports){
var form        = require('./form'),
    querystring = require('./querystring'),
    dropdowns   = require('./dropdowns'),
    editor      = require('./editor');

$(function() {
  // Initialize the page
  form.init();
  querystring.init();
  dropdowns.init();
  editor.init();

  // Parse the Swagger API when the form is submitted
  form.form.on('submit', function(event) {
    event.preventDefault();
    parseSwagger();
  });
});

function parseSwagger() {
  var options = {
    allow: {
      json: form.allow.json.is(':checked'),
      yaml: form.allow.yaml.is(':checked'),
      empty: form.allow.empty.is(':checked'),
      unknown: form.allow.unknown.is(':checked')
    },
    $refs: {
      internal: form.refs.internal.is(':checked'),
      external: form.refs.external.is(':checked'),
      circular: form.refs.circular.is(':checked')
    },
    validate: {
      schema: form.validate.schema.is(':checked'),
      spec: form.validate.spec.is(':checked')
    },
    cache: {
      http: form.cache.parse(form.cache.http.val()),
      https: form.cache.parse(form.cache.https.val())
    }
  };
  var method = form.method.button.val();
  var api = form.url.val() || SwaggerParser.YAML.parse(form.sampleAPI.val());

  alert('SwaggerParser.' + method + '(' + api + ', ' + JSON.stringify(options, null, 2) + ')');
}

},{"./dropdowns":4,"./editor":5,"./form":6,"./querystring":8}],8:[function(require,module,exports){
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
  form.allow.json.is(':checked') || (query['allow-json'] = 'no');
  form.allow.yaml.is(':checked') || (query['allow-yaml'] = 'no');
  form.allow.empty.is(':checked') || (query['allow-empty'] = 'no');
  form.allow.unknown.is(':checked') || (query['allow-unknown'] = 'no');
  form.refs.internal.is(':checked') || (query['refs-internal'] = 'no');
  form.refs.external.is(':checked') || (query['refs-external'] = 'no');
  form.refs.circular.is(':checked') || (query['refs-circular'] = 'no');
  form.validate.schema.is(':checked') || (query['validate-schema'] = 'no');
  form.validate.spec.is(':checked') || (query['validate-spec'] = 'no');

  var cacheHttp = form.cache.parse(form.cache.http.val());
  cacheHttp === 300 || (query['cache-http'] = cacheHttp);

  var cacheHttps = form.cache.parse(form.cache.https.val());
  cacheHttps === 300 || (query['cache-https'] = cacheHttps);

  var method = form.method.button.val();
  method === 'validate' || (query['method'] = method);

  var url = form.url.val();
  url === '' || (query['url'] = url);

  var bookmark = '?' + querystring.stringify(query);
  form.bookmark.attr('href', bookmark);
}

},{"./form":6,"querystring":3}]},{},[7])
//# sourceMappingURL=bundle.js.map
