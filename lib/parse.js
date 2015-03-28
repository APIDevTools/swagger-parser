'use strict';

module.exports = parse;

var Path                     = require('path'),
    read                     = require('./read'),
    resolve                  = require('./resolve'),
    dereference              = require('./dereference'),
    validate                 = require('./validate'),
    defaults                 = require('./defaults'),
    State                    = require('./state'),
    util                     = require('./util'),
    _merge                   = require('lodash/object/merge'),
    _pick                    = require('lodash/object/pick'),
    _cloneDeep               = require('lodash/lang/cloneDeep'),
    _isEmpty                 = require('lodash/lang/isEmpty'),
    _isString                = require('lodash/lang/isString'),
    _isNumber                = require('lodash/lang/isNumber'),
    _isFunction              = require('lodash/lang/isFunction'),
    supportedSwaggerVersions = ['2.0'];


/**
 * Parses the given Swagger file, validates it, and dereferences "$ref" pointers.
 *
 * @param {string|SwaggerObject} swagger
 * The file path or URL of a YAML or JSON Swagger file.
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
    if (_isFunction(options)) {
        callback = options;
        options = undefined;
    }

    if (_isEmpty(swagger)) {
        throw new Error('Expected a Swagger file or object');
    }

    if (!_isFunction(callback)) {
        throw new Error('A callback function must be provided');
    }

    // Create a new state object for this parse operation
    var state = new State();
    state.options = _merge({}, defaults, options);

    var circular$RefError = null;

    // Parse, dereference, and validate
    parseSwaggerFile(swagger, state, function(err, api) {
        errBack(err) ||
        resolve(api, state, function(err, api) {
            errBack(err) ||
            dereference(api, state, function(err, api) {
                errBack(err) ||
                validate(api, state, function(err, api) {
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
    if (_isString(swagger)) {
        // Open/download the file/URL
        var path = resolveSwaggerPath(swagger, state);
        read(path, state, verifyParsedAPI);
    }
    else {
        // It's already a parsed object, but we still need to validate it
        resolveSwaggerPath('', state);
        verifyParsedAPI(null, _cloneDeep(swagger));
    }

    function verifyParsedAPI(err, api) {
        if (err) {
            util.doCallback(callback, err);
        }
        else if (!(api.swagger && api.info && api.paths)) {
            util.doCallback(callback, util.newSyntaxError('The object is not a valid Swagger API definition'));
        }
        else if (_isNumber(api.swagger)) {
            // This is a very common mistake, so give a helpful error message
            util.doCallback(callback, util.newSyntaxError('Swagger version number must be a string (e.g. "2.0") not a number.'));
        }
        else if (_isNumber(api.info.version)) {
            // This is a very common mistake, so give a helpful error message
            util.doCallback(callback, util.newSyntaxError('API version number must be a string (e.g. "1.0.0") not a number.'));
        }
        else if (supportedSwaggerVersions.indexOf(api.swagger) === -1) {
            util.doCallback(callback, util.newSyntaxError(
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
 * @param   {string}    path        The absolute or relative file or URL
 * @param   {State}     state       The state for the current parse operation
 * @returns {string}                The resolved absolute file path or URL
 */
function resolveSwaggerPath(path, state) {
    // Resolve the file path or url, relative to the CWD
    var cwd = util.cwd();
    var resolvedPath = util.resolvePath(cwd, path + '');
    state.swaggerPath = resolvedPath;

    // Get the directory of the Swagger file.
    // Always append a trailing slash, to ensure that it behaves properly with {@link url#resolve}.
    state.baseDir = Path.dirname(resolvedPath) + (util.isBrowser() ? '/' : Path.sep);
    util.debug('Swagger base directory: %s', state.baseDir);

    return resolvedPath;
}


/**
 * Returns the metadata for the current parse operation
 *
 * @param   {State}     state           The state for the current parse operation
 * @returns {State}
 */
function getMetadata(state) {
    return _pick(state, 'baseDir', 'files', 'urls', '$refs');
}

