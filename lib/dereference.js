'use strict';

var _ = require('lodash');
var url = require('url');
var read = require('./read');
var util = require('./util');
var debug = require('./debug');

// RegExp pattern for external pointers
// (e.g. "http://company.com", "https://company.com", "./file.yaml", "../../file.yaml")
var externalPointerPattern = /^https?\:\/\/|^\.|\.yml$|\.yaml$|\.json$/i;

module.exports = dereference;


/**
 * Dereferences the given Swagger spec, replacing "$ref" pointers
 * with their corresponding object references.
 * @param {object}    obj
 * @param {string}    schemaPath
 * @param {State}     state
 * @param {function}  callback
 */
function dereference(obj, schemaPath, state, callback) {
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
        resolvePointer(pointerPath, pointerValue, obj, key, state,
          function(err, resolved, alreadyResolved) {
            if (err || alreadyResolved) {
              // The pointer had already been resolved, so no need to recurse over it
              dereferenceNextItem(err);
            }
            else {
              // Recursively dereference the resolved reference
              dereference(resolved, pointerPath, state, function(err) {
                dereferenceNextItem(err);
              });
            }
          }
        );
      }
    }
    else if (_.isPlainObject(value) || _.isArray(value)) {
      // Recursively dereference each item in the object/array
      dereference(value, fullPath, state, function(err, reference) {
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
 * @param   {State}     state           the state for the current parse operation
 * @param   {function}  callback
 */
function resolvePointer(pointerPath, pointerValue, targetObj, targetProp, state, callback) {
  if (_.isEmpty(pointerValue)) {
    return util.doCallback(callback, util.syntaxError('Empty $ref pointer at "%s"', pointerPath));
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
    var cachedReference = getCachedReference(pointerValue, state);

    if (cachedReference) {
      returnResolvedValue(null, cachedReference, true);
    }
    else if (isExternalPointer(pointerValue)) {
      resolveExternalPointer(pointerValue, state, returnResolvedValue);
    }
    else {
      resolveInternalPointer(pointerValue, state, returnResolvedValue);
    }
  }
  catch (e) {
    util.doCallback(callback, e);
  }
}


/**
 * Returns the cached reference for the given pointer, if possible.
 * @param   {string}    pointer         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @param   {State}     state           the state for the current parse operation
 */
function getCachedReference(pointer, state) {
  // Check for the non-normalized pointer
  if (pointer in state.resolvedPointers) {
    return state.resolvedPointers[pointer];
  }

  // Check for the normalized pointer
  var normalized = normalizePointer(pointer, state);
  if (normalized in state.resolvedPointers) {
    // Cache the value under the non-normalized pointer too
    return state.resolvedPointers[pointer] = state.resolvedPointers[normalized];
  }

  // It's not in the cache
  return null;
}


/**
 * Caches a resolved reference under the given pointer AND the normalized pointer.
 * @param   {string}    pointer         The $ref pointer (e.g. "pet", "#/definitions/pet")
 * @param   {string}    normalized      The normalized $ref pointer (e.g. "#/definitions/pet")
 * @param   {object}    resolved        The resolved reference
 * @param   {State}     state           the state for the current parse operation
 */
function cacheReference(pointer, normalized, resolved, state) {
  state.resolvedPointers[pointer] = resolved;
  state.resolvedPointers[normalized] = resolved;
}


/**
 * Normalizes a pointer value.
 * For example, "pet.yaml" and "./pet.yaml" both get normalized to "/swagger/base/dir/pet.yaml".
 * @param   {string}    pointer         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @param   {State}     state           the state for the current parse operation
 * @returns {string}
 */
function normalizePointer(pointer, state) {
  if (isExternalPointer(pointer)) {
    // Normalize the pointer value by resolving the path/URL relative to the Swagger file.
    return url.resolve(state.baseDir, pointer);
  }
  else {
    if (pointer.indexOf('#/') === 0) {
      // The pointer is already normalized (e.g. "#/parameters/username")
      return pointer;
    }
    else {
      // This is a shorthand pointer to a model definition
      // "pet" => "#/definitions/pet"
      return '#/definitions/' + pointer;
    }
  }
}


/**
 * Determines whether the given $ref pointer value references an external file.
 * @param   {string}    pointer         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @returns {boolean}
 */
function isExternalPointer(pointer) {
  return pointer && externalPointerPattern.test(pointer);
}


/**
 * Resolves a pointer to a property in the Swagger spec.
 * @param   {string}    pointer         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @param   {State}     state           the state for the current parse operation
 * @param   {function}  callback
 */
function resolveInternalPointer(pointer, state, callback) {
  var propertyPath;

  // "pet" => "#/definitions/pet"
  var normalized = normalizePointer(pointer, state);

  // "#/paths/users/responses/200" => "paths.users.responses.200"
  propertyPath = normalized.substr(2).replace(/\//g, '.');

  // Get the property value from the schema
  var resolved = resultDeep(state.swagger, propertyPath);
  cacheReference(pointer, normalized, resolved, state);
  callback(null, resolved);
}


/**
 * Resolves a pointer to an external file or URL.
 * @param   {string}    pointer         the full, absolute path or URL
 * @param   {State}     state           the state for the current parse operation
 * @param   {function}  callback
 */
function resolveExternalPointer(pointer, state, callback) {
  // "./swagger.yaml" => "/full/path/to/swagger.yaml"
  var normalized = normalizePointer(pointer, state);

  // Set the resolved value to an empty object for now, so other reference pointers
  // can point to this object.  Once we finish reading the file, we will update
  // the empty object with the real data.
  var resolved = {};
  cacheReference(pointer, normalized, resolved, state);

  read.fileOrUrl(normalized, state,
    function(err, data) {
      if (!err) {
        // Now that we've finished downloaded the data, update the empty object we created earlier
        resolved = _.extend(resolved, data);
      }

      return callback(err, resolved);
    }
  );
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
    if (!obj) {
      break;
    }
  }

  return obj;
}

