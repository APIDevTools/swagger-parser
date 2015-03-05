'use strict';

var fs             = require('fs'),
    Path           = require('path'),
    url            = require('url'),
    format         = require('util').format,
    _drop          = require('lodash/array/drop'),
    _noop          = require('lodash/utility/noop'),
    _keys          = require('lodash/object/keys'),
    _isFunction    = require('lodash/lang/isFunction'),
    _isArray       = require('lodash/lang/isArray'),
    _isPlainObject = require('lodash/lang/isPlainObject');


var util = module.exports = {
    /**
     * Writes messages to stdout.
     * Log messages are suppressed by default, but can be enabled by setting the DEBUG variable.
     * @type {function}
     */
    debug: require('debug')('swagger:parser'),


    /**
     * Asynchronously invokes the given callback function with the given parameters.
     *
     * NOTE: This unwinds the call stack, which avoids stack overflows that can occur when crawling very complex Swagger APIs
     *
     * @param {function} callback
     * @param {*}     [err]
     * @param {...*}  [params]
     */
    doCallback: function(callback, err, params) {
        var args = _drop(arguments);
        process.nextTick(function() {
            callback.apply(null, args);
        });
    },


    /**
     * Recursively crawls an object, and calls the given function for each nested object.
     * This function can be used synchronously or asynchronously.
     *
     * @param   {object|*[]}    obj
     * The object (or array) to be crawled
     *
     * @param   {string}        [path]
     * The starting path of the object (e.g. "/definitions/pet")
     *
     * @param   {function}      [callback]
     * Called when the entire object tree is done being crawled, or when an error occurs.
     * The signature is `function(err, obj)`.
     *
     * @param   {function}      forEach
     * Called for each nested object in the tree. The signature is `function(parents, propName, propPath, continue)`,
     * where `parents` is an array of parent objects, `propName` is the name of the nested object property,
     * `propPath` is a full path of nested object (e.g. "/paths//get/responses/200/schema"),
     * and `continue` is a function to call to resume crawling the object.
     */
    crawlObject: function(obj, path, callback, forEach) {
        // Shift args if needed
        if (_isFunction(path)) {
            forEach = callback;
            callback = path;
            path = '';
        }
        if (!_isFunction(forEach)) {
            forEach = callback;
            callback = _noop;
        }

        // Do nothing if it's not an object or array
        if (!_isPlainObject(obj) && !_isArray(obj)) {
            callback(null, obj);
            return;
        }

        // Keep a stack of parent objects
        var parents = forEach.__parents = forEach.__parents || [];
        parents.push(obj);

        // Loop through each item in the object/array
        var properties = _keys(obj);
        crawlNextProperty();

        function crawlNextProperty(err) {
            if (err) {
                // An error occurred, so stop crawling and bubble it up
                forEach.__parents.pop();
                callback(err);
                return;
            }
            else if (properties.length === 0) {
                // We've crawled all of this object's properties, so we're done.
                forEach.__parents.pop();
                callback(null, obj);
                return;
            }

            var propName = properties.pop();
            var propValue = obj[propName];
            var propPath = path + '/' + propName;

            if (_isPlainObject(propValue)) {
                // Found an object property, so call the callback
                forEach(parents, propName, propPath, function(err) {
                    if (err) {
                        // An error occurred, so bubble it up
                        crawlNextProperty(err);
                    }
                    else {
                        // Crawl the nested object (re-fetch it from the parent obj, in case it has changed)
                        util.crawlObject(obj[propName], propPath, crawlNextProperty, forEach);
                    }
                });
            }
            else if (_isArray(propValue)) {
                // This is an array property, so crawl its items
                util.crawlObject(propValue, propPath, crawlNextProperty, forEach);
            }
            else {
                // This isn't an object property, so skip it
                crawlNextProperty();
            }
        }
    },


    /**
     * Creates an Error with a formatted string message.
     *
     * @param     {Error}     [err]       The original error, if any
     * @param     {string}    [message]   A user-friendly message about the source of the error
     * @param     {...*}      [params]    One or more {@link util#format} params
     * @returns   {Error}
     */
    newError: function(err, message, params) {
        if (err && err instanceof Error) {
            return new Error(errorDump.apply(null, arguments));
        }
        else {
            return new Error(format.apply(null, arguments));
        }
    },


    /**
     * Creates a SyntaxError with a formatted string message.
     *
     * @param     {Error}     [err]       The original error, if any
     * @param     {string}    [message]   A user-friendly message about the source of the error
     * @param     {...*}      [params]    One or more {@link util#format} params
     * @returns   {SyntaxError}
     */
    newSyntaxError: function(err, message, params) {
        if (err && err instanceof Error) {
            return new SyntaxError(errorDump.apply(null, arguments));
        }
        else {
            return new SyntaxError(format.apply(null, arguments));
        }
    },


    /**
     * Determines if we're running in a browser.
     * @returns {boolean}
     */
    isBrowser: function() {
        return fs.readFile === undefined;
    },


    /**
     * Determines whether the given path is a local filesystem path (as opposed to a remote path or URL).
     * NOTE: This does NOT verify that the path exists or is valid.
     *
     * @param   {string|Url}    path    A path or URL (e.g. "/path/to/file", "c:\path\to\file", "http://company.com/path/to/file")
     * @returns {boolean}
     */
    isLocalPath: function(path) {
        /* istanbul ignore if: code-coverage doesn't run in the browser */
        if (util.isBrowser()) {
            // Local paths are not allowed in browsers
            return false;
        }

        // NOTE: The following are all considered local files: "file://path/to/file", "/path/to/file", "c:\path\to\file"
        path = url.parse(path);
        return path.protocol !== 'http:' && path.protocol !== 'https:';
    },


    /**
     * Normalizes a path or URL across all environments (Linux, Mac, Windows, browsers).
     *
     * @param   {string}    path       A path or URL (e.g. "/path/to/file", "c:\path\to\file", "http://company.com/path/to/file")
     * @param   {boolean}   [isLocal]  Set to true to treat `path` as a local path
     * @returns {Url}
     */
    normalizePath: function(path, isLocal) {
        isLocal = isLocal === undefined ? util.isLocalPath(path) : isLocal;

        if (isLocal) {
            path = encodeURI(path);
            path = url.format({pathname: path});
            return url.parse(path);
        }
        else {
            return url.parse(path);
        }
    },


    /**
     * De-normalizes a path or URL to a string that is properly formatted.
     *
     * @param   {string}    path       A path or URL (e.g. "/path/to/file", "c:\path\to\file", "http://company.com/path/to/file")
     * @param   {boolean}   [isLocal]  Set to true to treat `path` as a local path
     * @returns {string}
     */
    denormalizePath: function(path, isLocal) {
        isLocal = isLocal === undefined ? util.isLocalPath(path) : isLocal;

        if (isLocal) {
            path = decodeURIComponent(path);
            return Path.normalize(path);
        }
        else {
            return path;
        }
    },


    /**
     * Resolves the given paths to an absolute path.
     * NOTE: This does NOT verify that the path exists or is valid.
     *
     * @param   {string}    basePath
     * The base path, which must be absolute (e.g. "/base/path", "c:\base\path", "http://company.com/base/path")
     *
     * @param   {string}    path
     * The path to be resolved, which may be relative or absolute. (e.g. "path/to/file", "path\to\file")
     *
     * @returns {string}
     * The resolved, absolute path. (e.g. "/full/path/to/file", "c:\full\path\to\file", "http://company.com/full/path/to/file")
     */
    resolvePath: function(basePath, path) {
        util.debug('Resolving path "%s", relative to "%s"', path, basePath);

        // Normalize the paths
        var baseIsLocal = util.isLocalPath(basePath);
        var pathIsLocal = util.isLocalPath(path);
        basePath = util.normalizePath(basePath, baseIsLocal);
        path = util.normalizePath(path, pathIsLocal && baseIsLocal);

        // url.resolve() works across all environments (Linux, Mac, Windows, browsers),
        // even if basePath and path are different types (e.g. one is a URL, the other is a local path)
        var resolvedUrl = url.resolve(basePath, path);
        resolvedUrl = util.denormalizePath(resolvedUrl);

        util.debug('    Resolved to %s', resolvedUrl);
        return resolvedUrl;
    },


    /**
     * Returns the current working directory across environments (Linux, Mac, Windows, browsers).
     * The returned path always include a trailing slash to ensure that it behaves properly with {@link url#resolve}.
     *
     * @returns {string}
     */
    cwd: function() {
        /* istanbul ignore next: code-coverage doesn't run in the browser */
        var cwd = util.isBrowser() ? window.location.href : process.cwd() + '/';
        cwd = util.normalizePath(cwd);

        // Remove the file name (if any) from the pathname
        var lastSlash = cwd.pathname.lastIndexOf('/') + 1;
        cwd.pathname = cwd.pathname.substr(0, lastSlash);

        // Remove everything after the pathname
        cwd.path = null;
        cwd.search = null;
        cwd.query = null;
        cwd.hash = null;

        // Format and denormalize only the remaining parts of the URL
        cwd = url.format(cwd);
        cwd = util.denormalizePath(cwd);

        return cwd;
    }
};


/**
 * Returns detailed error information that can be written to a log, stderror, etc.
 *
 * @param   {Error}     err         The Error object
 * @param   {string}    [message]   Optional message about where and why the error occurred.
 * @param   {...*}      [params]    One or more params to be passed to {@link util#format}
 */
function errorDump(err, message, params) {
    // Format the message string
    message = format.apply(null, _drop(arguments)) + ': \n';

    // Gather detailed error information
    message += (err.name || 'Error') + ': ';

    var stack = err.stack;

    /* istanbul ignore else: Only IE doesn't have an Error.stack property */
    if (stack) {
        /* istanbul ignore if: Only Safari doesn't include Error.message in Error.stack */
        if (stack.indexOf(err.message) === -1) {
            message += err.message + ' \n';
        }

        return message + stack;
    }
    else {
        return message + err.message;
    }
}
