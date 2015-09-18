/**!
 * Swagger Parser v3.0.0-alpha.9
 *
 * @link https://github.com/BigstickCarpet/swagger-parser
 * @license MIT
 */
'use strict';

var validateSchema = require('./validate-schema'),
    validateSpec   = require('./validate-spec'),
    util           = require('./util'),
    Options        = require('./options'),
    ono            = require('ono'),
    dereference    = require('json-schema-ref-parser/lib/dereference'),
    Promise        = require('json-schema-ref-parser/lib/promise'),
    $RefParser     = require('json-schema-ref-parser');

module.exports = SwaggerParser;

/**
 * This class parses a Swagger 2.0 API, resolves its JSON references and their resolved values,
 * and provides methods for traversing, dereferencing, and validating the API.
 *
 * @constructor
 * @extends $RefParser
 */
function SwaggerParser() {
  $RefParser.apply(this, arguments);
}

util.inherits(SwaggerParser, $RefParser);
SwaggerParser.YAML = $RefParser.YAML;
SwaggerParser.parse = $RefParser.parse;
SwaggerParser.resolve = $RefParser.resolve;
SwaggerParser.bundle = $RefParser.bundle;
SwaggerParser.dereference = $RefParser.dereference;

/**
 * Alias {@link $RefParser#schema} as {@link SwaggerParser#api}
 */
Object.defineProperty(SwaggerParser.prototype, 'api', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.schema;
  }
});

/**
 * Parses the given Swagger API.
 * This method does not resolve any JSON references.
 * It just reads a single file in JSON or YAML format, and parse it as a JavaScript object.
 *
 * @param {string|object} api - The file path or URL of the Swagger API. Or a Swagger object.
 * @param {ParserOptions} [options] - Options that determine how the API is parsed
 * @param {function} [callback] - An error-first callback. The second parameter is the parsed API object.
 * @returns {Promise} - The returned promise resolves with the parsed API object.
 */
SwaggerParser.prototype.parse = function(api, options, callback) {
  if (typeof(options) === 'function') {
    callback = options;
    options = undefined;
  }

  options = new Options(options);
  var me = this;

  return $RefParser.prototype.parse.call(this, api, options)
    .then(function(api) {
      var supportedSwaggerVersions = ['2.0'];

      // Verify that the parsed object is a Swagger API
      if (api.swagger === undefined || api.info === undefined || api.paths === undefined) {
        throw ono.syntax('The object is not a valid Swagger API definition');
      }
      else if (typeof(api.swagger) === 'number') {
        // This is a very common mistake, so give a helpful error message
        throw ono.syntax('Swagger version number must be a string (e.g. "2.0") not a number.');
      }
      else if (typeof(api.info.version) === 'number') {
        // This is a very common mistake, so give a helpful error message
        throw ono.syntax('API version number must be a string (e.g. "1.0.0") not a number.');
      }
      else if (supportedSwaggerVersions.indexOf(api.swagger) === -1) {
        throw ono.syntax(
          'Unsupported Swagger version: %d. Swagger-Parser only supports version %s',
          api.swagger, supportedSwaggerVersions.join(', '));
      }

      // Looks good!
      util.doCallback(callback, null, api);
      return api;
    })
    .catch(function(err) {
      util.doCallback(callback, err, me.schema);
      return Promise.reject(err);
    });
};

/**
 * Parses, dereferences, and validates the given Swagger API.
 * Depending on the options, validation can include JSON Schema validation and/or Swagger Spec validation.
 *
 * @param {string|object} api - The file path or URL of the Swagger API. Or a Swagger object.
 * @param {ParserOptions} [options] - Options that determine how the API is parsed, dereferenced, and validated
 * @param {function} [callback] - An error-first callback. The second parameter is the parsed API object.
 * @returns {Promise} - The returned promise resolves with the parsed API object.
 */
SwaggerParser.validate = function(api, options, callback) {
  var Class = this;
  return new Class().validate(api, options, callback);
};

/**
 * Parses, dereferences, and validates the given Swagger API.
 * Depending on the options, validation can include JSON Schema validation and/or Swagger Spec validation.
 *
 * @param {string|object} api - The file path or URL of the Swagger API. Or a Swagger object.
 * @param {ParserOptions} [options] - Options that determine how the API is parsed, dereferenced, and validated
 * @param {function} [callback] - An error-first callback. The second parameter is the parsed API object.
 * @returns {Promise} - The returned promise resolves with the parsed API object.
 */
SwaggerParser.prototype.validate = function(api, options, callback) {
  if (typeof(options) === 'function') {
    callback = options;
    options = undefined;
  }

  options = new Options(options);
  var me = this;

  return this.bundle(api, options)
    .then(function() {
      // Validate the bundled schema, since it won't contain any circular references
      if (options.validate.schema) {
        validateSchema(me.api);
      }

      // Fully-dereference the schema
      dereference(me, options);

      // Validate the dereferenced schema against the Swagger spec
      if (options.validate.spec) {
        validateSpec(me.api);
      }

      util.doCallback(callback, null, me.schema);
      return me.schema;
    })
    .catch(function(err) {
      util.doCallback(callback, err, me.schema);
      return Promise.reject(err);
    });
};

/**
 * The Swagger object
 * https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object
 *
 * @typedef {{swagger: string, info: {}, paths: {}}} SwaggerObject
 */
