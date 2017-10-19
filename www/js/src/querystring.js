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
