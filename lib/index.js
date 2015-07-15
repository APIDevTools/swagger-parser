'use strict';

var Options     = require('./options'),
    $RefParser  = require('json-schema-ref-parser'),
    validate    = require('./validate'),
    util        = require('./util'),
    _isFunction = require('lodash/lang/isFunction'),
    _isNumber   = require('lodash/lang/isNumber');

module.exports = SwaggerParser;

/**
 * @constructor
 * @extends $RefParser
 */
function SwaggerParser() {
  $RefParser.apply(this, arguments);
}

util.inherits(SwaggerParser, $RefParser);

/**
 * Alias {@link $RefParser#schema} as {@link SwaggerParser#api}
 */
Object.defineProperty(SwaggerParser.prototype, 'api', {
  enumerable: true,
  get: function() {
    return this.schema;
  }
});

SwaggerParser.parse = function(api, options, callback) {
  return new SwaggerParser().parse(api, options, callback);
};

SwaggerParser.prototype.parse = function(api, options, callback) {
  var me = this;

  return $RefParser.prototype.parse.call(this, api, options)
    .then(function(api) {
      var supportedSwaggerVersions = ['2.0'];

      // Verify that the parsed object is a Swagger API
      if (api.swagger === undefined || api.info === undefined || api.paths === undefined) {
        throw util.newError(SyntaxError, 'The object is not a valid Swagger API definition');
      }
      else if (_isNumber(api.swagger)) {
        // This is a very common mistake, so give a helpful error message
        throw util.newError(SyntaxError, 'Swagger version number must be a string (e.g. "2.0") not a number.');
      }
      else if (_isNumber(api.info.version)) {
        // This is a very common mistake, so give a helpful error message
        throw util.newError(SyntaxError, 'API version number must be a string (e.g. "1.0.0") not a number.');
      }
      else if (supportedSwaggerVersions.indexOf(api.swagger) === -1) {
        throw util.newError(SyntaxError,
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

SwaggerParser.resolve = function(api, options, callback) {
  return new SwaggerParser().resolve(api, options, callback);
};

SwaggerParser.dereference = function(api, options, callback) {
  return new SwaggerParser().dereference(api, options, callback);
};

SwaggerParser.validate = function(api, options, callback) {
  return new SwaggerParser().validate(api, options, callback);
};

SwaggerParser.prototype.validate = function(api, options, callback) {
  if (_isFunction(options)) {
    callback = options;
    options = undefined;
  }

  options = new Options(options);
  var me = this;

  return this.dereference(api, options)
    .then(function() {
      validate(me, options);
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
