'use strict';

var path = require('path');
var url = require('url');
var tv4 = require('tv4');
var swaggerSchema = require('swagger-schema-official/schema');
var _ = require('lodash');
var read = require('./read');
var dereference = require('./dereference');
var defaults = require('./defaults');
var State = require('./state');
var util = require('./util');
var debug = require('./debug');

var supportedSwaggerVersions = ['2.0'];

module.exports = parse;


/**
 * Parses the given Swagger file, validates it, and dereferences "$ref" pointers.
 *
 * @param {string} swaggerPath
 * the file path or URL of a YAML or JSON Swagger spec.
 *
 * @param {defaults} options
 * options to enable/disable certain features. This object will be merged with the {@link defaults} object.
 *
 * @param {function} callback
 * the callback function that will be passed the parsed SwaggerObject
 */
function parse(swaggerPath, options, callback) {
  // Shift args if necessary
  if (_.isFunction(options)) {
    callback = options;
    options = undefined;
  }

  if (!_.isFunction(callback)) {
    throw new Error('A callback function must be provided');
  }

  options = _.merge({}, defaults, options);

  // Resolve the file path or url, relative to the CWD
  var cwd = util.cwd();
  debug('Resolving Swagger file path "%s", relative to "%s"', cwd, swaggerPath);
  swaggerPath = url.resolve(cwd, swaggerPath);
  debug('    Resolved to %s', swaggerPath);

  // Create a new state object for this parse operation
  var state = new State();
  state.options = options;
  state.baseDir = path.dirname(swaggerPath) + '/';
  debug('Swagger base directory: %s', state.baseDir);

  read.fileOrUrl(swaggerPath, state, function(err, swaggerObject) {
    if (err) {
      return util.doCallback(callback, err);
    }

    state.swagger = swaggerObject;

    // Validate the version number
    var version = swaggerObject.swagger;
    if (supportedSwaggerVersions.indexOf(version) === -1) {
      return util.doCallback(callback, util.syntaxError(
        'Error in "%s". \nUnsupported Swagger version: %d. Swagger-Server only supports version %s',
        swaggerPath, version, supportedSwaggerVersions.join(', ')));
    }

    // Dereference the SwaggerObject by resolving "$ref" pointers
    debug('Resolving $ref pointers in %s', swaggerPath);
    dereference(swaggerObject, '', state, function(err, swaggerObject) {
      if (!err) {
        try {
          // Validate the spec against the Swagger schema (if enabled)
          if (state.options.validateSpec) {
            validateAgainstSchema(swaggerObject, swaggerPath);
          }
        }
        catch (e) {
          err = e;
        }
      }

      if (err) {
        err = util.syntaxError(err, 'Error in "%s"', swaggerPath);
        return util.doCallback(callback, err);
      }

      // We're done.  Invoke the callback.
      var metadata = _.omit(state, 'swagger', 'options');
      util.doCallback(callback, null, swaggerObject, metadata);
    });
  });
}


/**
 * Validates the given SwaggerObject against the Swagger schema.
 */
function validateAgainstSchema(swaggerObject, swaggerPath) {
  debug('Validating "%s" against the Swagger schema', swaggerPath);
  if (tv4.validate(swaggerObject, swaggerSchema)) {
    debug('    Validated successfully');
    return true;
  }
  else {
    throw util.syntaxError('%s \nData path: "%s" \nSchema path: "%s"\n',
      tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath);
  }
}

