(function() {
  'use strict';

  var _ = require('lodash');
  var state = require('./state');
  var read = require('./read');
  var util = require('./util');
  var debug = require('./debug');


  module.exports = dereference;


  /**
   * Dereferences the given Swagger spec, replacing "$ref" pointers
   * with their corresponding object references.
   * @param {object} obj
   * @param {string} schemaPath
   * @param {function} callback
   */
  function dereference(obj, schemaPath, callback) {
    // Do nothing if dereferencing is disabled
    if (!state.options.dereferencePointers) {
      return util.doCallback(callback, null, obj);
    }

    function dereferenceNextItem(err) {
      if (err || keys.length === 0) {
        // We're done!  Invoke the callback
        return util.doCallback(callback, err || null, obj);
      }

      var key = keys.pop();
      var value = obj[key];
      var fullPath = schemaPath + key;

      if (_.has(value, '$ref')) {
        // We found a "$ref" pointer!  So resolve it.
        var pointerPath = fullPath + '/$ref';
        var pointerValue = value.$ref;

        if (isExternalPointer(pointerValue) && !state.options.dereferenceExternalPointers) {
          // This is an external pointer, and we're not resolving those, so just move along
          dereferenceNextItem();
        }
        else {
          resolvePointer(pointerPath, pointerValue, function(err, resolved, alreadyResolved) {
            if (err || alreadyResolved) {
              // The pointer had already been resolved, so REPLACE the original object with the resolved object.
              // This ensures that all references are replaced with the SAME object instance
              obj[key] = resolved;
              dereferenceNextItem(err);
            }
            else {
              // Recursively dereference the resolved reference
              dereference(resolved, pointerPath, function(err, resolved) {
                // This is the first time this object has been resolved, so MERGE the resolved value with
                // the original object (instead of replacing the original object).  This ensures that any
                // other references that have already resolved to this object will be pointing at the
                // correct object instance.
                mergeResolvedReference(obj[key], resolved);
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
   * Merges the resolved reference object with the original placeholder object that contains the `$ref` pointer.
   * By merging the object rather than overwriting it, other pointers to the object will now correctly point to the dereferenced value.
   * @param {object} source     the original placeholder object that contains the `$ref` pointer
   * @param {object} resolved   the resolved value of the `$ref` pointer
   */
  function mergeResolvedReference(source, resolved) {
    // Delete the $ref property FIRST, since the resolved value may also be a reference object
    delete source.$ref;
    _.merge(source, resolved);
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
      util.doCallback(callback, util.syntaxError('Empty $ref pointer at "%s"', pointerPath));
    }

    function returnResolvedValue(err, resolved, alreadyResolved) {
      if (!err && resolved === undefined) {
        err = util.syntaxError('Unable to resolve %s.  The path "%s" could not be found in the Swagger file.',
          pointerPath, pointerValue);
      }

      debug('Resolved %s => %s', pointerPath, pointerValue);
      util.doCallback(callback, err, resolved, alreadyResolved);
    }

    function asyncCallback(err, data) {
      if (err || data === undefined) {
        err = util.syntaxError('Unable to resolve %s.  An error occurred while downloading JSON data from %s : \n%s',
          pointerPath, pointerValue, err ? err.message : 'File Not Found');
      }

      // Now that we've finished downloaded the data,
      // merge it into the placeholder object that was created earlier
      data = _.merge(state.resolvedPointers[pointerValue], data);
      return returnResolvedValue(err, data);
    }

    try {
      // If we've already resolved this pointer, then return the resolved value
      if (_.has(state.resolvedPointers, pointerValue)) {
        return returnResolvedValue(null, state.resolvedPointers[pointerValue], true);
      }

      if (isLocalPointer(pointerValue)) {
        // "#/paths/users/responses/200" => "paths.users.responses.200"
        var deepProperty = pointerValue.substr(2).replace(/\//g, '.');

        // Get the property value from the schema
        resolved = resultDeep(state.swaggerObject, deepProperty);
        state.resolvedPointers[pointerValue] = resolved;
        returnResolvedValue(null, resolved);
      }
      else if (isExternalPointer(pointerValue)) {
        // Set the resolved value to an empty object for now,
        // to prevent multiple simultaneous downloads of the same URL.
        // We'll populate the object once we finish downloading the file,
        // so all the other references will end up pointing to the populated object.
        state.resolvedPointers[pointerValue] = {};
        read.fileOrUrl(pointerValue, asyncCallback);
      }
      else {
        // Swagger allows a shorthand reference syntax (e.g. "Product" => "#/definitions/Product")
        resolved = _.result(state.swaggerObject.definitions, pointerValue);
        state.resolvedPointers[pointerValue] = resolved;
        returnResolvedValue(null, resolved);
      }
    }
    catch (e) {
      util.doCallback(callback, e);
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
    return pointerValue.indexOf('http://') === 0 || pointerValue.indexOf('https://') === 0;
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


})();
