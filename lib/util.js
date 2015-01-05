'use strict';

var fs = require('fs');
var url = require('url');
var format = require('util').format;
var _ = require('lodash');


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
     * NOTE: This unwinds the call stack, which avoids stack overflows
     *       that occur when crawling very complex Swagger APIs
     *
     * @param {function} callback
     * @param {*}     [err]
     * @param {...*}  [params]
     */
    doCallback: function(callback, err, params) {
        var args = _.rest(arguments);
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
        if (_.isFunction(path)) {
            forEach = callback;
            callback = path;
            path = '';
        }
        if (!_.isFunction(forEach)) {
            forEach = callback;
            callback = _.noop;
        }

        // Keep a stack of parent objects
        var parents = forEach.__parents = forEach.__parents || [];
        parents.push(obj);

        // Loop through each item in the object/array
        var properties = _.keys(obj);
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

            if (_.isPlainObject(propValue)) {
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
            else if (_.isArray(propValue)) {
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
     * Normalizes the current working directory across environments (Linux, Mac, Windows, browsers).
     * The returned path will use forward slashes ("/"), even on Windows,
     * and will always include a trailing slash, even at the root of a website (e.g. "http://google.com/")
     * @returns {string}
     */
    cwd: function() {
        var path = util.isBrowser() ? window.location.href : process.cwd() + '/';

        // Parse the path as a URL, which normalizes it across all platforms
        var parsedUrl = url.parse(path);

        // Remove the file name (if any) from the pathname
        var lastSlash = parsedUrl.pathname.lastIndexOf('/') + 1;
        parsedUrl.pathname = parsedUrl.pathname.substr(0, lastSlash);

        // Remove everything after the pathname
        parsedUrl.path = null;
        parsedUrl.search = null;
        parsedUrl.query = null;
        parsedUrl.hash = null;

        // Now re-parse the URL with only the remaining parts
        return url.format(parsedUrl);
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
    message = format.apply(null, _.rest(arguments)) + ': \n';

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
