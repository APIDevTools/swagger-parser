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
          resolvePointer(pointerPath, pointerValue, obj, key,
            function(err, resolved, alreadyResolved) {
              if (err || alreadyResolved) {
                // The pointer had already been resolved, so no need to recurse over it
                dereferenceNextItem(err);
              }
              else {
                // Recursively dereference the resolved reference
                dereference(resolved, pointerPath, function(err) {
                  dereferenceNextItem(err);
                });
              }
            }
          );
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
   * @param   {string}    pointerPath     the path to the $ref property. This is only used for logging purposes.
   * @param   {string}    pointerValue    the pointer value to resolve
   * @param   {object}    targetObj       the object that will be updated to include the resolved reference
   * @param   {string}    targetProp      the property name on targetObj to be updated with the resolved reference
   * @param   {function}  callback
   */
  function resolvePointer(pointerPath, pointerValue, targetObj, targetProp, callback) {
    var resolved;

    if (_.isEmpty(pointerValue)) {
      util.doCallback(callback, util.syntaxError('Empty $ref pointer at "%s"', pointerPath));
    }

    function returnResolvedValue(err, resolved, alreadyResolved) {
      if (!err && resolved === undefined) {
        err = util.syntaxError('Unable to resolve %s.  The path "%s" could not be found in the Swagger file.',
          pointerPath, pointerValue);
      }

      if (!err) {
        // Update the target object with the resolved value
        targetObj[targetProp] = resolved;
      }

      debug('Resolved %s => %s', pointerPath, pointerValue);
      util.doCallback(callback, err, resolved, alreadyResolved);
    }


    try {
      // If we've already resolved this pointer, then return the resolved value
      if (_.has(state.resolvedPointers, pointerValue)) {
        return returnResolvedValue(null, state.resolvedPointers[pointerValue], true);
      }

      if (isInternalPointer(pointerValue)) {
        // "#/paths/users/responses/200" => "paths.users.responses.200"
        var deepProperty = pointerValue.substr(2).replace(/\//g, '.');

        // Get the property value from the schema
        resolved = resultDeep(state.swaggerObject, deepProperty);
        state.resolvedPointers[pointerValue] = resolved;
        returnResolvedValue(null, resolved);
      }
      else if (isExternalPointer(pointerValue)) {
        // Set the resolved value to an empty object for now, so other reference pointers
        // can point to this object.  Once we finish downloading the URL, we can update
        // the empty object with the real data.
        state.resolvedPointers[pointerValue] = {};

        read.fileOrUrl(pointerValue,
          function(err, data) {
            if (err || data === undefined) {
              err = util.syntaxError('Unable to resolve %s.  An error occurred while downloading JSON data from %s : \n%s',
                pointerPath, pointerValue, err ? err.message : 'File Not Found');
            }

            // Now that we've finished downloaded the data, update the empty object we created earlier
            data = _.extend(state.resolvedPointers[pointerValue], data);

            return returnResolvedValue(err, data);
          }
        );
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
  function isInternalPointer(pointerValue) {
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
