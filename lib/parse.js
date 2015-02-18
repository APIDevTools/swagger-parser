'use strict';

module.exports = parse;

var path = require('path');
var url = require('url');
var tv4 = require('tv4');
var swaggerSchema = require('swagger-schema-official/schema');
var _ = require('lodash');
var read = require('./read');
var resolve = require('./resolve');
var dereference = require('./dereference');
var defaults = require('./defaults');
var State = require('./state');
var util = require('./util');

/*
 * Added a numeric type of the version into the array,
 * as the YAML parser reads it as a number and the 
 * verification fails. 
 */
var supportedSwaggerVersions = ['2.0', 2];


/**
 * Parses the given Swagger file, validates it, and dereferences "$ref" pointers.
 *
 * @param {string|SwaggerObject} swagger
 * The file path or URL of a YAML or JSON Swagger spec.
 * Or an already-parsed Swagger API object, which will still be dereferenced and validated.
 *
 * @param {defaults} options
 * Options to enable/disable certain features. This object will be merged with the {@link defaults} object.
 *
 * @param {function} callback
 * The callback function that will be passed the parsed SwaggerObject
 */
function parse(swagger, options, callback) {
    // Shift args if necessary
    if (_.isFunction(options)) {
        callback = options;
        options = undefined;
    }

    if (_.isEmpty(swagger)) {
        throw new Error('Expected a Swagger file or object');
    }

    if (!_.isFunction(callback)) {
        throw new Error('A callback function must be provided');
    }

    // Create a new state object for this parse operation
    var state = new State();
    state.options = _.merge({}, defaults, options);

    var circular$RefError = null;

    // Parse, dereference, and validate
    parseSwaggerFile(swagger, state, function(err, api) {
        errBack(err) ||
        resolve(api, state, function(err, api) {
            errBack(err) ||
            dereference(api, state, function(err, api) {
                errBack(err) ||
                validateAgainstSchema(api, state, function(err, api) {
                    errBack(err) ||
                    finished(api, state);
                });
            });
        });
    });

    // Done!
    function finished(api) {
        util.doCallback(callback, circular$RefError, api, getMetadata(state));
    }

    // Error!
    function errBack(err) {
        if (err) {
            // Ignore circular-reference errors and keep going
            if (err instanceof ReferenceError) {
                circular$RefError = err;
                return false;
            }

            // For any other error, abort immediately
            util.doCallback(callback,
                util.newSyntaxError(err, 'Error in Swagger definition'),
                null,
                getMetadata(state));
        }
        return !!err;
    }
}


/**
 * Parses the given JSON or YAML file/URL or Swagger object, and verifies that it's a supported Swagger API.
 *
 * @param   {string|SwaggerObject}  swagger     The absolute or relative file path, URL, or Swagger object.
 * @param   {State}                 state       The state for the current parse operation
 * @param   {function}              callback
 */
function parseSwaggerFile(swagger, state, callback) {
    if (_.isString(swagger)) {
        // Open/download the file/URL
        var pathOrUrl = resolveSwaggerPath(swagger, state);
        read.fileOrUrl(pathOrUrl, state, verifyParsedAPI);
    }
    else {
        // It's already a parsed object, but we still need to validate it
        resolveSwaggerPath('', state);
        verifyParsedAPI(null, _.cloneDeep(swagger));
    }

    function verifyParsedAPI(err, api) {
        if (err) {
            util.doCallback(callback, err);
        }
        else if (!(api.swagger && api.info && api.paths)) {
            return util.doCallback(callback, util.newSyntaxError('The object is not a valid Swagger API definition'));
        }
        else if (supportedSwaggerVersions.indexOf(api.swagger) === -1) {
            return util.doCallback(callback, util.newSyntaxError(
                'Unsupported Swagger version: %d. Swagger-Parser only supports version %s',
                api.swagger, supportedSwaggerVersions.join(', ')));
        }
        else {
            state.swagger = api;
            util.doCallback(callback, null, api);
        }
    }
}


/**
 * Resolves the given file path or URL to determine the Swagger base directory.
 *
 * @param   {string}    pathOrUrl       The absolute or relative file or URL
 * @param   {State}     state           The state for the current parse operation
 * @returns {string}                    The resolved absolute file path or URL
 */
function resolveSwaggerPath(pathOrUrl, state) {
    // Coerce String objects to string primitives
    pathOrUrl = pathOrUrl.toString();

    // Resolve the file path or url, relative to the CWD
    var cwd = util.cwd();
    util.debug('Resolving Swagger path "%s", relative to "%s"', pathOrUrl, cwd);
    pathOrUrl = url.resolve(cwd, pathOrUrl);
    util.debug('    Resolved to %s', pathOrUrl);

    // Update the state
    state.swaggerPath = pathOrUrl;
    state.baseDir = path.dirname(pathOrUrl) + '/';
    util.debug('Swagger base directory: %s', state.baseDir);

    return pathOrUrl;
}


/**
 * Validates the given Swagger API against the Swagger schema.
 *
 * @param   {SwaggerObject} api         The absolute or relative file path
 * @param   {State}         state       The state for the current parse operation
 * @param   {function}      callback
 */
function validateAgainstSchema(api, state, callback) {
    if (state.options.validateSchema) {
        util.debug('Validating "%s" against the Swagger schema', state.swaggerPath);

        if (tv4.validate(api, swaggerSchema)) {
            util.debug('    Validated successfully');
            util.doCallback(callback, null, api);
        }
        else {
            util.doCallback(callback, util.newSyntaxError(
                '%s \nData path: "%s" \nSchema path: "%s"\n',
                tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath));
        }
    }
    else {
        // Schema validation is disabled, so just return the API as-is
        util.doCallback(callback, null, api);
    }
}


/**
 * Returns the metadata for the current parse operation
 *
 * @param   {State}     state           The state for the current parse operation
 * @returns {State}
 */
function getMetadata(state) {
    return _.pick(state, 'baseDir', 'files', 'urls', '$refs');
}

