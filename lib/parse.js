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

    // Create a new state object for this parse operation
    var state = new State();
    state.options = _.merge({}, defaults, options);

    // Parse, dereference, and validate
    parseSwaggerFile(swaggerPath, state, function(err, api) {
        errBack(err) ||
        dereference(api, state, function(err, api) {
            errBack(err) ||
            validateAgainstSchema(api, state, function(err, api) {
                errBack(err) ||
                finished(api, state);
            });
        });
    });

    // Done!
    function finished(api, state) {
        var metadata = _.pick(state, 'baseDir', 'files', 'urls', '$refs');
        util.doCallback(callback, null, api, metadata);
    }

    // Error!
    function errBack(err) {
        if (err) {
            util.doCallback(callback, util.syntaxError(err, 'Error in "%s"', swaggerPath));
        }
        return !!err;
    }
}


/**
 * Parses the given JSON or YAML file or URL.
 * @param   {string}    filePath        The absolute or relative file path
 * @param   {State}     state           The state for the current parse operation
 * @param   {function}  callback
 */
function parseSwaggerFile(filePath, state, callback) {
    // Resolve the file path or url, relative to the CWD
    var cwd = util.cwd();
    debug('Resolving Swagger file path "%s", relative to "%s"', filePath, cwd);
    filePath = url.resolve(cwd, filePath);
    debug('    Resolved to %s', filePath);

    // Update the state
    state.swaggerPath = filePath;
    state.baseDir = path.dirname(filePath) + '/';
    debug('Swagger base directory: %s', state.baseDir);

    // Parse the file
    read.fileOrUrl(filePath, state, function(err, api) {
        if (err) {
            util.doCallback(callback, err);
        }
        else if (supportedSwaggerVersions.indexOf(api.swagger) === -1) {
            return util.doCallback(callback, util.syntaxError(
                'Unsupported Swagger version: %d. Swagger-Parser only supports version %s',
                api.swagger, supportedSwaggerVersions.join(', ')));
        }
        else {
            state.swagger = api;
            util.doCallback(callback, null, api);
        }
    });
}


/**
 * Validates the given Swagger API against the Swagger schema.
 * @param   {SwaggerObject} api         The absolute or relative file path
 * @param   {State}         state       The state for the current parse operation
 * @param   {function}      callback
 */
function validateAgainstSchema(api, state, callback) {
    if (state.options.validateSchema) {
        debug('Validating "%s" against the Swagger schema', state.swaggerPath);

        if (tv4.validate(api, swaggerSchema)) {
            debug('    Validated successfully');
            util.doCallback(callback, null, api);
        }
        else {
            util.doCallback(callback, util.syntaxError(
                '%s \nData path: "%s" \nSchema path: "%s"\n',
                tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath));
        }
    }
    else {
        // Schema validation is disabled, so just return the API as-is
        util.doCallback(callback, null, api);
    }
}

