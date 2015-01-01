'use strict';

var fs = require('fs');
var url = require('url');
var format = require('util').format;
var _ = require('lodash');


var util = module.exports = {
  /**
   * Asynchronously invokes the given callback function with the given parameters.
   * This allows the call stack to unwind, which is necessary because there can be a LOT of
   * recursive calls when dereferencing large Swagger specs.
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
   * Creates an Error with a formatted string message.
   * @param     {Error}     [err]       The original error, if any
   * @param     {string}    [message]   A user-friendly message about the source of the error
   * @param     {...*}      [params]    One or more {@link util#format} params
   * @returns   {Error}
   */
  error: function(err, message, params) {
    if (err && err instanceof Error) {
      return new Error(errorDump.apply(null, arguments));
    }
    else {
      return new Error(format.apply(null, arguments));
    }
  },


  /**
   * Creates a SyntaxError with a formatted string message.
   * @param     {Error}     [err]       The original error, if any
   * @param     {string}    [message]   A user-friendly message about the source of the error
   * @param     {...*}      [params]    One or more {@link util#format} params
   * @returns   {SyntaxError}
   */
  syntaxError: function(err, message, params) {
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
