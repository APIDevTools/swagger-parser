'use strict';

var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var yaml = require('js-yaml');
var _ = require('lodash');
var util = require('./util');
var debug = require('./debug');

var read;

module.exports = read = {
  /**
   * Reads a JSON or YAML file from the local filesystem or a remote URL and returns the parsed POJO.
   * @param {string}    pathOrUrl   Local file path or URL, relative to the Swagger file.
   * @param {State}     state       The state for the current parse operation
   * @param {function}  callback    function(err, parsedObject)
   */
  fileOrUrl: function(pathOrUrl, state, callback) {
    try {
      // Parse the path and determine whether it's a file or a URL by its protocol
      var parsedUrl = url.parse(pathOrUrl);

      if (isLocalFile(parsedUrl, state)) {
        read.file(urlToRelativePath(parsedUrl), state, callback);
      }
      else {
        read.url(parsedUrl.href, state, callback);
      }
    }
    catch (e) {
      callback(e);
    }
  },


  /**
   * Reads a JSON or YAML file from the local filesystem and returns the parsed POJO.
   * @param {string}    filePath        Local file path, relative to the Swagger file.
   * @param {State}     state           The state for the current parse operation
   * @param {function}  callback        function(err, parsedObject)
   */
  file: function(filePath, state, callback) {
    function errorHandler(err) {
      callback(util.error('Error opening file "%s": \n%s: %s \n\n%s', filePath, err.name, err.message, err.stack));
    }

    function parseError(err) {
      callback(util.syntaxError('Error parsing file "%s": \n%s: %s \n\n%s', filePath, err.name, err.message, err.stack));
    }

    try {
      // Get the file path, relative to the Swagger file's directory
      filePath = path.resolve(state.swaggerSourceDir, filePath);

      debug('Reading file "%s"', filePath);

      fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
        if (err) {
          return errorHandler(err);
        }

        try {
          state.files.push(filePath);
          callback(null, parseJsonOrYaml(filePath, data, state));
        }
        catch (e) {
          parseError(e);
        }
      });
    }
    catch (e) {
      errorHandler(e);
    }
  },


  /**
   * Reads a JSON or YAML file from the a remote URL and returns the parsed POJO.
   * @param {string|Url}    urlPath     The file URL, relative to the Swagger file.
   * @param {State}         state       The state for the current parse operation
   * @param {function}      callback    function(err, parsedObject)
   */
  url: function(urlPath, state, callback) {
    var href = urlPath;

    // NOTE: When HTTP errors occur, they can trigger multiple on('error') events,
    // So we need to make sure we only invoke the callback function ONCE.
    callback = _.once(callback);

    function downloadError(err) {
      callback(util.error('Error downloading file "%s": \n%s: %s \n\n%s', href, err.name, err.message, err.stack));
    }

    function parseError(err) {
      callback(util.syntaxError('Error parsing file "%s": \n%s: %s \n\n%s', href, err.name, err.message, err.stack));
    }

    try {
      // Parse the URL, if it's not already parsed
      urlPath = url.parse(urlPath);

      if (isRelativeUrl(urlPath)) {
        // Resolve the url, relative to the Swagger file
        urlPath = url.parse(url.resolve(state.swaggerSourceDir + '/', urlToRelativePath(urlPath)));
      }

      href = urlPath.href;

      var options = {
        host: urlPath.host,
        hostname: urlPath.hostname,
        port: urlPath.port,
        path: urlPath.path,
        auth: urlPath.auth,
        headers: {'Content-Type': 'application/json'}
      };

      debug('Downloading file "%s"', href);

      var req = http.get(options, function(res) {
        var body = '';

        if (_.isFunction(res.setEncoding)) {
          res.setEncoding('utf8');
        }

        res.on('data', function(data) {
          body += data;
        });

        res.on('end', function() {
          if (res.statusCode >= 400) {
            return downloadError(new Error('HTTP ERROR ' + res.statusCode + ': ' + body));
          }

          try {
            state.urls.push(urlPath);
            callback(null, parseJsonOrYaml(href, body, state));
          }
          catch (e) {
            parseError(e);
          }
        });

        res.on('error', function(e) {
          downloadError(e);
        });
      });

      if (_.isFunction(req.setTimeout)) {
        req.setTimeout(5000);
      }

      req.on('timeout', function() {
        req.abort();
      });

      req.on('error', function(e) {
        downloadError(e);
      });
    }
    catch (e) {
      downloadError(e);
    }
  }
};


/**
 * Determines if we're running in a browser, in which case, the "fs" module is unavailable.
 * @returns {boolean}
 */
function isBrowser() {
  return !_.isFunction(fs.readFile);
}


/**
 * Determines whether the given path points to a local file that exists.
 * @param   {Url}       parsedUrl     A parsed Url object
 * @param {State}       state         The state for the current parse operation
 * @returns {boolean}
 */
function isLocalFile(parsedUrl, state) {
  if (isBrowser()) {
    // Local files aren't supported in browsers
    return false;
  }

  if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
    // If the path exists locally, then treat the URL as a local file
    var relativePath = urlToRelativePath(parsedUrl);
    var filePath = path.resolve(state.swaggerSourceDir, relativePath);
    return fs.existsSync(filePath);
  }

  // If it's anything other than "http" or "https", then assume it's a local file.
  // This includes "file://", "/absolute/paths", "relative/paths", and "c:\windows\paths"
  return true;
}


/**
 * Return the equivalent relative file path for a given url.
 * @param   {Url}       parsedUrl     A parsed Url object
 * @returns {string}
 */
function urlToRelativePath(parsedUrl) {
  if (isRelativeUrl(parsedUrl)) {
    // "http://../../file.yaml" => "../../file.yaml"
    return parsedUrl.href.substr(parsedUrl.protocol.length + 2);
  }

  // "http://localhost/folder/subfolder/file.yaml" => "folder/subfolder/file.yaml"
  return parsedUrl.pathname;
}


/**
 * Treats a URL as relative if its hostname is "." or ".."
 * NOTE: This is an undocumented feature that's only intended for cross-platform testing. Don't rely on it!
 * @param   {Url}       parsedUrl     A parsed Url object
 * @returns {boolean}
 */
function isRelativeUrl(parsedUrl) {
  return parsedUrl.host === '.' || parsedUrl.host === '..';
}


/**
 * Parses a JSON or YAML string into a POJO.
 * @param   {string}  pathOrUrl
 * @param   {string}  data
 * @param   {State}   state
 * @returns {object}
 */
function parseJsonOrYaml(pathOrUrl, data, state) {
  var parsedObject;
  if (state.options.parseYaml) {
    debug('  Parsing YAML file "%s"', pathOrUrl);
    parsedObject = yaml.safeLoad(data);
  }
  else {
    debug('  Parsing JSON file "%s"', pathOrUrl);
    parsedObject = JSON.parse(data);
  }

  if (_.isEmpty(parsedObject)) {
    throw util.syntaxError('Parsed value is empty');
  }
  if (!_.isPlainObject(parsedObject)) {
    throw util.syntaxError('Parsed value is not a valid JavaScript object');
  }

  debug('  Parsed successfully');
  return parsedObject;
}

