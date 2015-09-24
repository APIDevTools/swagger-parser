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
