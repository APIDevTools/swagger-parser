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
