'use strict';

module.exports = resolve;

var read      = require('./read'),
    util      = require('./util'),
    _last     = require('lodash/array/last'),
    _result   = require('lodash/object/result'),
    _has      = require('lodash/object/has'),
    _isEmpty  = require('lodash/lang/isEmpty'),
    _isString = require('lodash/lang/isString');


// RegExp pattern to detect external $ref pointers.
// Matches anything that starts with "http://" or contains a period (".")
// (e.g. "http://localhost/some/path", "company.com/some/path", "file.yaml", "..\..\file.yaml", "./fileWithoutExt")
var external$RefPattern = /(^https?\:\/\/)|(\.)/i;


/**
 * Resolves all $ref pointers in the given Swagger API.
 * NOTE: The API is not modified or dereferenced. The resolved $ref values are stored in {@link State.$refs}
 *
 * @param   {SwaggerObject} api             The Swagger API to resolve
 * @param   {State}         state           The state for the current parse operation
 * @param   {function}      callback
 */
function resolve(api, state, callback) {
    if (!state.options.resolve$Refs) {
        // Resolving is disabled, so just return the API as-is
        util.doCallback(callback, null, api);
        return;
    }

    util.debug('Resolving $ref pointers in %s', state.swaggerPath);
    resolveObject(api, '', state, callback);
}


/**
 * Recursively resolves all $ref pointers in the given object.
 * NOTE: The object is not modified or dereferenced. The resolved $ref values are stored in {@link State.$refs}
 *
 * @param   {object}    obj         The object to resolve
 * @param   {string}    objPath     The API path to the object. This is only used for logging purposes.
 * @param   {State}     state       The state for the current parse operation
 * @param   {function}  callback
 */
function resolveObject(obj, objPath, state, callback) {
    // Recursively crawl the object
    util.crawlObject(obj, objPath, callback,
        // Inspect each nested object.
        function(parents, propName, propPath, continueCrawling) {
            // If it's a $ref pointer, then resolve it
            resolveIf$Ref(_last(parents)[propName], propPath, state, continueCrawling);
        }
    );
}


/**
 * Determines whether the given object is a $ref pointer.
 * If it is, then it will be fully resolved, and the resolved value will be passed to the callback function.
 * If it's not a $ref pointer, then the object is passed directly to the callback function.
 *
 * @param   {*}         value       The value to check. Can be any data type, not just an object.
 * @param   {string}    valuePath   The API path to the value. This is only used for logging purposes.
 * @param   {State}     state       The state for the current parse operation
 * @param   {function}  callback
 */
function resolveIf$Ref(value, valuePath, state, callback) {
    if (_has(value, '$ref') && _isString(value.$ref)) {
        if (isExternal$Ref(value.$ref) && !state.options.resolveExternal$Refs) {
            // Resolving external pointers is disabled, so return the $ref as-is
            util.doCallback(callback, null, value);
        }
        else {
            // This is a $ref pointer, so resolve it
            var $refPath = valuePath + '/$ref';
            resolve$Ref(value.$ref, $refPath, state, callback);
        }
    }
    else {
        // It's not a $ref pointer, so return it as-is
        util.doCallback(callback, null, value);
    }
}


/**
 * Recursively a $ref pointer.
 * NOTE: The $ref pointer is not modified or dereferenced. The resolved $ref values are stored in {@link State.$refs}
 *
 * @param   {string}    $ref        The $ref pointer value to resolve
 * @param   {string}    $refPath    The path to the $ref pointer. This is only used for logging purposes.
 * @param   {State}     state       The state for the current parse operation
 * @param   {function}  callback
 */
function resolve$Ref($ref, $refPath, state, callback) {
    try {
        // Check for invalid values
        if (_isEmpty($ref)) {
            util.doCallback(callback, util.newSyntaxError('Empty $ref pointer at "%s"', $refPath));
            return;
        }

        // See if we've already resolved this $ref pointer
        var cachedReference = getCached$Ref($ref, state);
        if (cachedReference) {
            util.debug('Resolved %s => %s', $refPath, $ref);
            util.doCallback(callback, null, cachedReference, true);
            return;
        }

        // Determine if it's internal or external
        if (isExternal$Ref($ref)) {
            resolveExternal$Ref($ref, state, recursiveResolve);
        }
        else {
            resolveInternal$Ref($ref, state, recursiveResolve);
        }
    }
    catch (e) {
        util.doCallback(callback, e);
    }


    function recursiveResolve(err, resolved) {
        if (err) {
            util.doCallback(callback, err);
            return;
        }

        if (resolved === undefined) {
            util.doCallback(callback,
                util.newSyntaxError('Unable to resolve %s.  \n"%s" could not be found.', $refPath, $ref));
            return;
        }

        util.debug('Resolved %s => %s', $refPath, $ref);

        // The $ref might have resolved to another $ref, so resolve recursively until we get to an object
        resolveIf$Ref(resolved, $refPath, state,
            function(err, resolved, cached) {
                if (err) {
                    util.doCallback(callback, err);
                    return;
                }

                // We've resolved the $ref to something solid (an object, array, scalar value, etc.),
                // So cache the resolved value.
                cache$Ref($ref, resolved, state);

                // The resolved object could have nested $refs, so we need to crawl it
                resolveObject(resolved, $refPath, state,
                    function(err, resolved) {
                        if (err) {
                            util.doCallback(callback, err);
                            return;
                        }

                        util.doCallback(callback, null, resolved, cached);
                    }
                );
            }
        );
    }
}


/**
 * Determines whether the given $ref pointer value references an external file.
 *
 * @param   {string}    $ref         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @returns {boolean}
 */
function isExternal$Ref($ref) {
    return $ref && external$RefPattern.test($ref);
}


/**
 * Resolves a pointer to a property in the Swagger spec.
 * NOTE: This is a shallow resolve. This function is called recursively by {@link resolve$Ref} to do deep resolves.
 *
 * @param   {string}    $ref         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @param   {State}     state        The state for the current parse operation
 * @param   {function}  callback
 */
function resolveInternal$Ref($ref, state, callback) {
    // "pet" => "#/definitions/pet"
    var normalized = normalize$Ref($ref, state);

    // "#/paths//users/responses/200" => ["/paths", "//users", "/responses", "/200"]
    var pathArray = normalized.match(/\/(\/?[^\/]+)/g);

    // Traverse the Swagger API
    var resolved = state.swagger;
    for (var i = 0; i < pathArray.length; i++) {
        var propName = pathArray[i].substr(1);
        resolved = _result(resolved, propName);

        // Exit the loop early if we get a falsy value
        if (!resolved) {
            break;
        }
    }

    callback(null, resolved);
}


/**
 * Resolves a pointer to an external file or URL.
 * NOTE: This is a shallow resolve. This function is called recursively by {@link resolve$Ref} to do deep resolves.
 *
 * @param   {string}    $ref         The full, absolute path or URL
 * @param   {State}     state        The state for the current parse operation
 * @param   {function}  callback
 */
function resolveExternal$Ref($ref, state, callback) {
    // "./swagger.yaml" => "/full/path/to/swagger.yaml"
    var normalized = normalize$Ref($ref, state);

    read(normalized, state,
        function(err, data) {
            return callback(err, data);
        }
    );
}


/**
 * Normalizes a pointer value.
 * For example, "pet.yaml" and "./pet.yaml" both get normalized to "/swagger/base/dir/pet.yaml".
 *
 * @param   {string}    $ref         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @param   {State}     state        The state for the current parse operation
 * @returns {string}
 */
function normalize$Ref($ref, state) {
    if (isExternal$Ref($ref)) {
        // Normalize the pointer value by resolving the path/URL relative to the Swagger file.
        return util.resolvePath(state.baseDir, $ref);
    }
    else {
        if ($ref.indexOf('#/') === 0) {
            // The pointer is already normalized (e.g. "#/parameters/username")
            return $ref;
        }
        else {
            // This is a shorthand pointer to a model definition
            // "pet" => "#/definitions/pet"
            return '#/definitions/' + $ref;
        }
    }
}


/**
 * Returns the cached reference for the given pointer, if possible.
 *
 * @param   {string}    $ref         The $ref pointer (e.g. "pet", "#/parameters/pet")
 * @param   {State}     state        The state for the current parse operation
 */
function getCached$Ref($ref, state) {
    // Check for the non-normalized pointer
    if ($ref in state.$refs) {
        return state.$refs[$ref];
    }

    // Check for the normalized pointer
    var normalized = normalize$Ref($ref, state);
    if (normalized in state.$refs) {
        // Cache the value under the non-normalized pointer too
        return state.$refs[$ref] = state.$refs[normalized];
    }

    // It's not in the cache
    return null;
}


/**
 * Caches a resolved reference under the given pointer AND the normalized pointer.
 *
 * @param   {string}    $ref         The $ref pointer (e.g. "pet", "#/definitions/pet")
 * @param   {object}    resolved     The resolved reference
 * @param   {State}     state        The state for the current parse operation
 */
function cache$Ref($ref, resolved, state) {
    var normalized = normalize$Ref($ref, state);

    /* istanbul ignore if: This check is here to help detect subtle bugs and edge-cases */
    if ($ref in state.$refs || normalized in state.$refs) {
        throw util.newError('Swagger-Parser encountered an error while resolving a $ref pointer: "%s". ' +
        'This is most likely a bug in Swagger-Parser, not in your code. Please report this issue on GitHub.', $ref);
    }

    state.$refs[$ref] = resolved;
    state.$refs[normalized] = resolved;
}
