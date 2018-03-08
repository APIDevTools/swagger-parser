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
    text: this.form.find('input[name=allow-text]'),
    empty: this.form.find('input[name=allow-empty]'),
    unknown: this.form.find('input[name=allow-unknown]')
  };

  this.refs = {
    label: this.form.find('#refs-label'),
    menu: this.form.find('#refs-menu'),
    external: this.form.find('input[name=refs-external]'),
    circular: this.form.find('input[name=refs-circular]')
  };

  this.validate = {
    label: this.form.find('#validate-label'),
    menu: this.form.find('#validate-menu'),
    schema: this.form.find('input[name=validate-schema]'),
    spec: this.form.find('input[name=validate-spec]')
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
    parse: {
      json: this.allow.json.is(':checked') ? {
        allowEmpty: this.allow.empty.is(':checked'),
      } : false,
      yaml: this.allow.yaml.is(':checked') ? {
        allowEmpty: this.allow.empty.is(':checked'),
      } : false,
      text: this.allow.text.is(':checked') ? {
        allowEmpty: this.allow.empty.is(':checked'),
      } : false,
      binary: this.allow.unknown.is(':checked') ? {
        allowEmpty: this.allow.empty.is(':checked'),
      } : false,
    },
    resolve: {
      external: this.refs.external.is(':checked'),
    },
    dereference: {
      circular: this.refs.circular.is(':checked'),
    },
    validate: {
      schema: this.validate.schema.is(':checked'),
      spec: this.validate.spec.is(':checked'),
    },
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
