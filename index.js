(function() {
  'use strict';

  var debug = require('debug')('swagger:parser');
  var fs = require('fs');
  var path = require('path');
  var http = require('http');
  var url = require('url');
  var format = require('util').format;
  var yaml = require('js-yaml');
  var tv4 = require('tv4');
  var swaggerSchema = require('swagger-schema-official/schema');
  var _ = require('lodash');


  /**
   * The default parsing options.
   * @name defaults
   * @type {{supportedSwaggerVersions: string[], parseYaml: boolean, dereferencePointers: boolean, dereferenceFilePointers: boolean, dereferenceUrlPointers: boolean, validateSpec: boolean}}
   */
  var defaults = {
    /**
     * The supported versions of the Swagger spec.
     * The parser will throw an error if the Swagger version in the spec file does not match one of these values EXACTLY.
     * Defaults to an array containing "2.0".
     * @type {string[]}
     */
    supportedSwaggerVersions: ['2.0'],

    /**
     * Determines whether the parser will allow Swagger specs in YAML format.
     * If set to `false`, then only JSON will be allowed.  Defaults to `true`.
     * @type {boolean}
     */
    parseYaml: true,

    /**
     * Determines whether `$ref` pointers will be dereferenced.
     * If set to `false`, then the resulting SwaggerObject will contain ReferenceObjects instead of the objects they reference.
     * (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-)
     * Defaults to `true`.
     * @type {boolean}
     */
    dereferencePointers: true,

    /**
     * Determines whether `$ref` pointers will be dereferenced if they point to external files (e.g. "http://company.com/my/schema.json").
     * If set to `false`, then the resulting SwaggerObject will contain ReferenceObjects instead of the objects they reference.
     * (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-)
     * Defaults to `true`.
     * @type {boolean}
     */
    dereferenceExternalPointers: true,

    /**
     * Determines whether the Swagger spec will be validated against the Swagger schema.
     * If set to `false`, then the resulting SwaggerObject may be missing properties, have properties of the wrong data type, etc.
     * Defaults to `true`.
     * @type {boolean}
     */
    validateSpec: true
  };


  /**
   * The state for the current parsing operation
   * @type {{swaggerSourceDir: null, options: null, swaggerObject: null, resolvedPointers: {}}}
   */
  var parseState = {
    /**
     * The directory where the Swagger file is located
     * (used for resolving relative file references)
     */
    swaggerSourceDir: null,

    /**
     * The options for the parsing operation
     * @type {defaults}
     */
    options: null,

    /**
     * The entire SwaggerObject
     * (used for resolving schema references)
     */
    swaggerObject: null,

    /**
     * A map of resolved "$ref" pointers to their values
     */
    resolvedPointers: {}
  };


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
    options = _.merge({}, defaults, options);

    // Create a new state object for this parse operation
    parseState = {
      swaggerSourceDir: path.dirname(swaggerFile),
      options: options,
      resolvedPointers: {}
    };

    try {
      parseState.swaggerObject = parseFile(swaggerFile);
    }
    catch (e) {
      parseState = null;
      return doCallback(callback, e);
    }

    // Make sure it's an object
    if (!_.isPlainObject(parseState.swaggerObject)) {
      parseState = null;
      return doCallback(callback, syntaxError('"%s" is not a valid Swagger spec', swaggerFile));
    }

    // Validate the version number
    var version = parseState.swaggerObject.swagger;
    if (options.supportedSwaggerVersions.indexOf(version) === -1) {
      parseState = null;
      return doCallback(callback, syntaxError(
        'Error in "%s". \nUnsupported Swagger version: %d. Swagger-Server only supports version %s',
        swaggerFile, version, options.supportedSwaggerVersions.join(', ')));
    }

    // Dereference the SwaggerObject by resolving "$ref" pointers
    dereference(parseState.swaggerObject, '', function(err, swaggerObject) {
      if (!err) {
        try {
          // Validate the spec against the Swagger schema
          validateAgainstSchema(swaggerObject);
        }
        catch (e) {
          err = e;
        }
      }

      // We're done parsing, so clear the state
      parseState = null;

      if (err) {
        err = syntaxError('Error in "%s". \n%s', swaggerFile, err.message);
      }

      // We're done.  Invoke the callback.
      doCallback(callback, err, swaggerObject);
    });
  }


  /**
   * Creates a SyntaxError with a formatted string message.
   * @param {string} message
   * @param {...*|*[]} params
   * @returns {SyntaxError}
   */
  function syntaxError(message, params)
  {
    return new SyntaxError(format.apply(null, [message].concat(_.rest(arguments))));
  }


  /**
   * Asynchronously invokes the given callback function with the given parameters.
   * This allows the call stack to unwind, which is necessary because there can be a LOT of
   * recursive calls when dereferencing large Swagger specs.
   * @param {function} callback
   * @param {*} [err]
   * @param {*} [param1]
   * @param {*} [param2]
   */
  function doCallback(callback, err, param1, param2) {
    setImmediate(callback, err, param1, param2);
  }


  /**
   * Crawls the property tree to return the value of the specified property.
   */
  function resultDeep(obj, key) {
    // "my.deep.property" => ["my", "deep", "property"]
    var propNames = key.split('.');

    // Traverse each property/function
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      obj = _.result(obj, propName);

      // Exit the loop early if we get a falsy value
      if (!obj) break;
    }

    return obj;
  }


  /**
   * Parses the given YAML or JSON file into a POJO.
   */
  function parseFile(filePath)
  {
    try {
      debug('Parsing the Swagger spec "%s"', filePath);

      // Read the file as a string
      var fileContents = fs.readFileSync(filePath, 'utf8');

      // Parse it as YAML or JSON
      var parsedObject;
      if (parseState.options.parseYaml) {
        parsedObject = yaml.safeLoad(fileContents);
      }
      else {
        parsedObject = JSON.parse(fileContents);
      }

      debug('Swagger spec parsed successfully');

      return parsedObject;
    }
    catch (e) {
      throw syntaxError('Unable to read file "' + filePath + '": \n' + e.message);
    }
  }


  /**
   * Dereferences the given Swagger spec, replacing "$ref" pointers
   * with their corresponding object references.
   * @param {object} obj
   * @param {string} schemaPath
   * @param {function} callback
   */
  function dereference(obj, schemaPath, callback) {
    // Do nothing if dereferencing is disabled
    if (!parseState.options.dereferencePointers) {
      return doCallback(callback, null, obj);
    }

    function dereferenceNextItem(err) {
      if (err || keys.length === 0) {
        // We're done!  Invoke the callback
        return doCallback(callback, err, obj);
      }

      var key = keys.pop();
      var value = obj[key];
      var fullPath = schemaPath + key;

      if (_.has(value, '$ref')) {
        // We found a "$ref" pointer!  So resolve it.
        var pointerPath = fullPath + '/$ref';
        var pointerValue = value.$ref;

        if (isExternalPointer(pointerValue) && !parseState.options.dereferenceExternalPointers) {
          // This is an external pointer, and we're not resolving those, so just move along
          dereferenceNextItem();
        }
        else {
          resolvePointer(pointerPath, pointerValue, function(err, reference, alreadyResolved) {
            if (err || alreadyResolved) {
              obj[key] = reference;
              dereferenceNextItem(err);
            }
            else {
              // Recursively dereference the resolved reference
              dereference(reference, pointerPath, function(err, reference) {
                obj[key] = reference;
                dereferenceNextItem(err);
              });
            }
          });
        }
      }
      else if (_.isPlainObject(value) || _.isArray(value)) {
        // Recursively dereference each item in the object/array
        dereference(value, fullPath, function(err, reference) {
          obj[key] = reference;
          dereferenceNextItem(err);
        });
      }
      else {
        // This is just a normal value (string, number, boolean, date, etc.)
        // so just skip it and dereference the next item.
        dereferenceNextItem();
      }
    }

    schemaPath += '/';

    // Loop through each item in the object/array
    var keys = _.keys(obj);
    dereferenceNextItem();
  }


  /**
   * Resolves a "$ref" pointer.
   * @param {string} pointerPath
   * @param {string} pointerValue
   * @param {function} callback
   */
  function resolvePointer(pointerPath, pointerValue, callback) {
    var resolved;

    if (_.isEmpty(pointerValue)) {
      doCallback(callback, syntaxError('Empty $ref pointer at "%s"', pointerPath));
    }

    function returnResolvedValue(err, resolved, alreadyResolved) {
      if (!err && resolved === undefined) {
        err = syntaxError('Unable to resolve %s.  The path "%s" could not be found in the Swagger file.',
          pointerPath, pointerValue);
      }

      debug('Resolved %s => %s', pointerPath, pointerValue);
      doCallback(callback, err, resolved, alreadyResolved);
    }

    function asyncCallback(err, data) {
      if (err || data === undefined) {
        err = syntaxError('Unable to resolve %s.  An error occurred while downloading JSON data from %s : \n%s',
          pointerPath, pointerValue, err ? err.message : 'File Not Found');
      }

      // Now that we've finished downloaded the data,
      // merge it into the placeholder object that was created earlier
      data = _.merge(parseState.resolvedPointers[pointerValue], data);
      return returnResolvedValue(err, data);
    }

    try {
      // If we've already resolved this pointer, then return the resolved value
      if (_.has(parseState.resolvedPointers, pointerValue)) {
        return returnResolvedValue(null, parseState.resolvedPointers[pointerValue], true);
      }

      if (isLocalPointer(pointerValue)) {
        // "#/paths/users/responses/200" => "paths.users.responses.200"
        var deepProperty = pointerValue.substr(2).replace(/\//g, '.');

        // Get the property value from the schema
        resolved = resultDeep(parseState.swaggerObject, deepProperty);
        parseState.resolvedPointers[pointerValue] = resolved;
        returnResolvedValue(null, resolved);
      }
      else if (isExternalPointer(pointerValue)) {
        // Set the resolved value to an empty object for now,
        // to prevent multiple simultaneous downloads of the same URL.
        // We'll populate the object once we finish downloading the file,
        // so all the other references will end up pointing to the populated object.
        parseState.resolvedPointers[pointerValue] = {};

        var parsedUrl = url.parse(pointerValue);
        var swaggerBaseUrl = (parseState.swaggerObject.host || '').toLowerCase();

        if (parsedUrl.host === swaggerBaseUrl
        || parsedUrl.hostname === swaggerBaseUrl
        || parsedUrl.hostname === 'localhost') {
          // The URL is pointing to a local file
          getJsonFromFile(parsedUrl.pathname, asyncCallback);
        }
        else {
          // It's a remote URL
          getJsonFromUrl(parsedUrl, asyncCallback);
        }
      }
      else {
        // Swagger allows a shorthand reference syntax (e.g. "Product" => "#/definitions/Product")
        resolved = _.result(parseState.swaggerObject.definitions, pointerValue);
        parseState.resolvedPointers[pointerValue] = resolved;
        returnResolvedValue(null, resolved);
      }
    }
    catch (e) {
      doCallback(callback, e);
    }
  }


  /**
   * Determines whether the given $ref pointer value references a path in Swagger spec.
   * @returns {boolean}
   */
  function isLocalPointer(pointerValue) {
    return pointerValue.indexOf('#/') === 0;
  }


  /**
   * Determines whether the given $ref pointer value references an external file.
   * @returns {boolean}
   */
  function isExternalPointer(pointerValue) {
    return pointerValue.indexOf('http://') === 0
        || pointerValue.indexOf('https://') === 0;
  }


  /**
   * Reds JSON data from the given file path and returns the parsed object to a callback
   * @param {string} filePath
   * @param {function} callback - function(err, data)
   */
  function getJsonFromFile(filePath, callback) {
    try {
      var data = null;

      // Get the file path, relative to the Swagger file's directory WITHOUT the extension
      var ext = path.extname(filePath);
      var basefilePath = path.join(parseState.swaggerSourceDir, path.dirname(filePath), path.basename(filePath, ext));

      // Try to find the file in JSON or YAML format
      _.each(['.yaml', '.json'], function(ext) {
        if (fs.existsSync(basefilePath + ext)) {
          // Parse the JSON or YAML file
          data = parseFile(basefilePath + ext);
        }
      });

      callback(null, data || undefined);
    }
    catch (e) {
      callback(e);
    }
  }


  /**
   * Downloads JSON data from the given URL and returns the parsed object to a callback
   * @param {object} url        - the parsed URL
   * @param {function} callback - function(err, data)
   */
  function getJsonFromUrl(url, callback) {
    try {
      var options = {
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        path: url.path,
        auth: url.auth,
        headers: { 'Content-Type': 'application/json' }
      };

      var req = http.get(options, function(res) {
        res.setEncoding('utf8');
        var body = '';

        res.on('data', function(data) {
          body += data;
        });

        res.on('end', function() {
          if (res.statusCode >= 400) {
            return callback(new Error(body));
          }

          try {
            var parsedObject = JSON.parse(body);
            callback(null, parsedObject);
          }
          catch (e) {
            callback(e);
          }
        });
      });

      req.setTimeout(5000);
      req.on('timeout', function() {
        req.abort();
      });

      req.on('error', function(e) {
        callback(e);
      });
    }
    catch (e) {
      callback(e);
    }
  }


  /**
   * Validates the given SwaggerObject against the Swagger schema.
   */
  function validateAgainstSchema(swaggerObject) {
    // Don't do anything if validation is disabled
    if (!parseState.options.validateSpec) return;

    // Validate against the schema
    if (tv4.validate(swaggerObject, swaggerSchema)) {
      return true;
    }
    else {
      throw syntaxError('%s \nData path: "%s" \nSchema path: "%s"\n',
        tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath);
    }
  }


  module.exports.parse = parse;
  module.exports.defaults = defaults;

})();
