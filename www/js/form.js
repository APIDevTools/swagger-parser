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
