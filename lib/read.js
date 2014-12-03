(function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var http = require('http');
  var url = require('url');
  var yaml = require('js-yaml');
  var _ = require('lodash');
  var state = require('./state');
  var util = require('./util');
  var debug = require('./debug');


  var read = module.exports = {
    /**
     * Reads a JSON or YAML file from the local filesystem or a remote URL and returns the parsed POJO.
     * @param {string}    pathOrUrl   Local file path or URL, relative to the Swagger file.
     * @param {function}  callback    function(err, parsedObject)
     */
    fileOrUrl: function(pathOrUrl, callback) {
      try {
        // If we're running in the browser, then the "fs" module is unavailable,
        // so treat everything as a URL
        if (isBrowser()) {
          return read.url(pathOrUrl, callback);
        }

        // Parse the path and determine whether it's a file or a URL by its protocol
        var parsedUrl = url.parse(pathOrUrl);
        switch (parsedUrl.protocol) {
          case 'file:':
          case null:
            read.file(parsedUrl.pathname, callback);
            break;

          case 'http:':
          case 'https:':
            read.url(parsedUrl.href, callback);
            break;

          default:
            callback(util.syntaxError('Unsupported file path or URL protocol "%s"', pathOrUrl));
        }
      }
      catch (e) {
        callback(e);
      }
    },


    /**
     * Reads a JSON or YAML file from the local filesystem and returns the parsed POJO.
     * @param {string}    filePath        Local file path, relative to the Swagger file.
     * @param {function}  callback        function(err, parsedObject)
     */
    file: function(filePath, callback) {
      function errorHandler(err) {
        callback(util.syntaxError('Unable to read file "%s": \n%s', filePath, err.stack || err.message));
      }

      try {
        // Get the file path, relative to the Swagger file's directory WITHOUT the extension
        var ext = path.extname(filePath);
        var baseFilePath = path.resolve(state.swaggerSourceDir, path.dirname(filePath));
        baseFilePath = path.join(baseFilePath, path.basename(filePath, ext));

        // Try to find the file in JSON or YAML format
        var found = false;
        _.each([ext, '.yaml', '.json'], function(ext) {
          if (fs.existsSync(baseFilePath + ext)) {
            found = true;
            debug('Reading file "%s"', filePath);

            fs.readFile(baseFilePath + ext, {encoding: 'utf8'}, function(err, data) {
              if (err) {
                return errorHandler(err);
              }

              try {
                callback(null, parseJsonOrYaml(data));
              }
              catch (e) {
                errorHandler(e);
              }
            });

            return false; // exit the _.each loop
          }
        });

        if (!found) {
          errorHandler(new Error('File not found (relative to the Swagger file)'));
        }
      }
      catch (e) {
        errorHandler(e);
      }
    },


    /**
     * Reads a JSON or YAML file from the a remote URL and returns the parsed POJO.
     * @param {string|Url}    urlPath     The file URL, relative to the Swagger file.
     * @param {function}      callback    function(err, parsedObject)
     */
    url: function(urlPath, callback) {
      var href = urlPath;

      function errorHandler(err) {
        callback(util.syntaxError('Unable to download file "%s": \n%s', href, err.stack || err.message));
      }

      try {
        // Resolve the url, relative to the Swagger file
        urlPath = url.parse(url.resolve(state.swaggerSourceDir, urlPath));
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
              return errorHandler(new Error(body));
            }

            try {
              callback(null, parseJsonOrYaml(body));
            }
            catch (e) {
              errorHandler(e);
            }
          });
        });

        if (_.isFunction(req.setTimeout)) {
          req.setTimeout(5000);
        }

        req.on('timeout', function() {
          req.abort();
        });

        req.on('error', function(e) {
          errorHandler(e);
        });
      }
      catch (e) {
        errorHandler(e);
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
   * Parses a JSON or YAML string into a POJO.
   * @param   {string} data
   * @returns {object}
   */
  function parseJsonOrYaml(data) {
    var parsedObject;
    if (state.options.parseYaml) {
      debug('    Parsing YAML');
      parsedObject = yaml.safeLoad(data);
    }
    else {
      debug('    Parsing JSON');
      parsedObject = JSON.parse(data);
    }

    debug('    Parsed successfully');
    return parsedObject;
  }

})();
