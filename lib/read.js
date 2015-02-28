'use strict';

module.exports = read;

var fs             = require('fs'),
    path           = require('path'),
    http           = require('http'),
    url            = require('url'),
    yaml           = require('js-yaml'),
    util           = require('./util'),
    _once          = require('lodash/function/once'),
    _isEmpty       = require('lodash/lang/isEmpty'),
    _isFunction    = require('lodash/lang/isFunction');


/**
 * Reads a JSON or YAML file from the local filesystem or a remote URL and returns the parsed POJO.
 * @param {string}    pathOrUrl   A full, absolute file path or URL
 * @param {State}     state       The state for the current parse operation
 * @param {function}  callback    function(err, parsedObject)
 */
function read(pathOrUrl, state, callback) {
    try {
        // Determine whether its a local file or a URL
        var parsedUrl = url.parse(pathOrUrl);
        if (isLocalFile(parsedUrl)) {
            state.files.push(parsedUrl.href);
            readFile(parsedUrl.href, state, callback);
        }
        else {
            state.urls.push(parsedUrl);
            readUrl(parsedUrl, state, callback);
        }
    }
    catch (e) {
        callback(e);
    }
}


/**
 * Reads a JSON or YAML file from the local filesystem and returns the parsed POJO.
 * @param {string}    filePath        The full, absolute path of the file (NOT RELATIVE!)
 * @param {State}     state           The state for the current parse operation
 * @param {function}  callback        function(err, parsedObject)
 */
function readFile(filePath, state, callback) {
    function errorHandler(err) {
        callback(util.newError(err, 'Error opening file "%s"', filePath));
    }

    function parseError(err) {
        callback(util.newSyntaxError(err, 'Error parsing file "%s"', filePath));
    }

    try {
        util.debug('Reading file "%s"', filePath);

        fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
            if (err) {
                return errorHandler(err);
            }

            try {
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
}


/**
 * Reads a JSON or YAML file from the a remote URL and returns the parsed POJO.
 * @param {Url}       parsedUrl   The full, parsed URL
 * @param {State}     state       The state for the current parse operation
 * @param {function}  callback    function(err, parsedObject)
 */
function readUrl(parsedUrl, state, callback) {
    // NOTE: When HTTP errors occur, they can trigger multiple on('error') events,
    // So we need to make sure we only invoke the callback function ONCE.
    callback = _once(callback);

    function downloadError(err) {
        callback(util.newError(err, 'Error downloading file "%s"', parsedUrl.href));
    }

    function parseError(err) {
        callback(util.newSyntaxError(err, 'Error parsing file "%s"', parsedUrl.href));
    }

    try {
        var options = {
            host: parsedUrl.host,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.path,
            auth: parsedUrl.auth,
            headers: {'Content-Type': 'application/json'}
        };

        util.debug('Downloading file "%s"', parsedUrl.href);

        var req = http.get(options, function(res) {
            var body = '';

            if (_isFunction(res.setEncoding)) {
                res.setEncoding('utf8');
            }

            res.on('data', function(data) {
                body += data;
            });

            res.on('end', function() {
                if (res.statusCode >= 400) {
                    return downloadError(util.newError('HTTP ERROR %d: %s', res.statusCode, body));
                }
                else if (res.statusCode === 204 || _isEmpty(body)) {
                    return downloadError(util.newError('HTTP 204: No Content'));
                }

                try {
                    callback(null, parseJsonOrYaml(parsedUrl.href, body, state));
                }
                catch (e) {
                    parseError(e);
                }
            });

            res.on('error', function(e) {
                downloadError(e);
            });
        });

        if (_isFunction(req.setTimeout)) {
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


/**
 * Determines whether the given path points to a local file that exists.
 * @param   {Url}       parsedUrl     A parsed Url object
 * @returns {boolean}
 */
function isLocalFile(parsedUrl) {
    if (util.isBrowser()) {
        // Local files aren't supported in browsers
        return false;
    }

    // If the path exists locally, then treat the URL as a local file
    if (fs.existsSync(parsedUrl.pathname)) {
        return true;
    }

    // If all else fails, then determine based on the protocol
    // NOTE: The following are all considered local files: "file://path/to/file", "/path/to/file", "c:\path\to\file"
    return parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:';
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

    try {
        if (state.options.parseYaml) {
            util.debug('Parsing YAML file "%s"', pathOrUrl);
            parsedObject = yaml.safeLoad(data);
        }
        else {
            util.debug('Parsing JSON file "%s"', pathOrUrl);
            parsedObject = JSON.parse(data);
        }

        if (_isEmpty(parsedObject)) {
            //noinspection ExceptionCaughtLocallyJS
            throw util.newSyntaxError('Parsed value is empty');
        }

        util.debug('    Parsed successfully');
    }
    catch (e) {
        var ext = path.extname(pathOrUrl).toLowerCase();
        if (['.json', '.yaml', '.yml'].indexOf(ext) === -1) {
            // It's not a YAML or JSON file, so ignore the parsing error and just treat it as a string
            parsedObject = data;
        }
        else {
            throw e;
        }
    }

    return parsedObject;
}

