'use strict';

var path = require('path');
var tv4 = require('tv4');
var swaggerSchema = require('swagger-schema-official/schema');
var _ = require('lodash');
var read = require('./read');
var dereference = require('./dereference');
var defaults = require('./defaults');
var State = require('./state');
var util = require('./util');


var supportedSwaggerVersions = ['2.0'];

module.exports = parse;


/**
 * Parses the given Swagger file, validates it, and dereferences "$ref" pointers.
 *
 * @param {string} swaggerFile
 * the path of a YAML or JSON file.
 *
 * @param {defaults} options
 * options to enable/disable certain features. This object will be merged with the {@link defaults} object.
 *
 * @param {function} callback
 * the callback function that will be passed the parsed SwaggerObject
 */
function parse(swaggerFile, options, callback) {
  // Shift args if necessary
  if (_.isFunction(options)) {
    callback = options;
    options = undefined;
  }

  if (!_.isFunction(callback)) {
    throw new Error('A callback function must be provided');
  }

  options = _.merge({}, defaults, options);

  // Create a new state object for this parse operation
  var state = new State();
  state.baseDir = path.dirname(swaggerFile);
  state.options = options;

  read.fileOrUrl(swaggerFile, state, function(err, swaggerObject) {
    if (err) {
      return util.doCallback(callback, err);
    }

    state.swagger = swaggerObject;

    // Validate the version number
    var version = swaggerObject.swagger;
    if (supportedSwaggerVersions.indexOf(version) === -1) {
      return util.doCallback(callback, util.syntaxError(
        'Error in "%s". \nUnsupported Swagger version: %d. Swagger-Server only supports version %s',
        swaggerFile, version, supportedSwaggerVersions.join(', ')));
    }

    // Dereference the SwaggerObject by resolving "$ref" pointers
    dereference(swaggerObject, '', state, function(err, swaggerObject) {
      if (!err) {
        try {
          // Validate the spec against the Swagger schema
          validateAgainstSchema(swaggerObject, state);
        }
        catch (e) {
          err = e;
        }
      }

      if (err) {
        err = util.syntaxError('Error in "%s". \n%s', swaggerFile, err.message);
        return util.doCallback(callback, err);
      }

      // We're done.  Invoke the callback.
      util.doCallback(callback, null, swaggerObject, state);
    });
  });
}


/**
 * Validates the given SwaggerObject against the Swagger schema.
 */
function validateAgainstSchema(swaggerObject, state) {
  // Don't do anything if validation is disabled
  if (!state.options.validateSpec) {
    return;
  }

  // Validate against the schema
  if (tv4.validate(swaggerObject, swaggerSchema)) {
    return true;
  }
  else {
    throw util.syntaxError('%s \nData path: "%s" \nSchema path: "%s"\n',
      tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath);
  }
}

