'use strict';

module.exports = dereference;

var util      = require('./util'),
    _last     = require('lodash/array/last'),
    _contains = require('lodash/collection/contains');


/**
 * Dereferences the given Swagger API, replacing "$ref" pointers
 * with their corresponding object references.
 *
 * @param   {SwaggerObject} api             The Swagger API to dereference
 * @param   {State}         state           The state for the current parse operation
 * @param   {function}      callback
 */
function dereference(api, state, callback) {
    if (!state.options.dereference$Refs || !state.options.resolve$Refs) {
        // Dereferencing/Resolving is disabled, so just return the API as-is
        util.doCallback(callback, null, api);
        return;
    }

    var circularRefs = 0;

    // Replace all $ref pointers with their resolved values
    util.crawlObject(api, finished,
        function(parents, propName, propPath, continueCrawling) {
            var parent = _last(parents);
            var $ref = parent[propName].$ref;

            if ($ref) {
                // We found a $ref pointer.  Do we have a corresponding resolved value?
                var resolved = state.$refs[$ref];

                if (resolved) {
                    // We have a resolved value.  But is it a circular reference?
                    isCircularReference(resolved, parents, function(isCircular) {
                        if (isCircular) {
                            // It's a circular reference, so don't dereference it.
                            circularRefs++;
                            util.debug('Circular reference detected at %s', propPath);
                        }
                        else {
                            // Replace the $ref pointer with its resolved value
                            parent[propName] = resolved;
                        }

                        // NOTE: This will also crawl the resolved value that we just added
                        // and replace any nested $ref pointers in it too.
                        util.doCallback(continueCrawling);
                    });
                }
                else {
                    util.doCallback(continueCrawling);
                }
            }
            else {
                util.doCallback(continueCrawling);
            }
        }
    );

    // Done!
    function finished(err) {
        if (!err && circularRefs) {
            err = new ReferenceError(circularRefs + ' circular reference(s) detected');
        }

        util.doCallback(callback, err, api);
    }
}


/**
 * Determines whether a resolved $ref value is a circular reference.
 *
 * @param   {object}    resolved    The resolved value of a $ref pointer
 * @param   {object[]}  parents     An array of resolved parent objects
 * @param   {function}  callback    Called with a boolean parameter
 */
function isCircularReference(resolved, parents, callback) {
    var isCircular = false;

    // Determine if the resolved value contains any of its parents
    util.crawlObject(resolved, done,
        function(props, propName, propPath, continueCrawling) {
            var prop = _last(props)[propName];
            isCircular = _contains(parents, prop);

            // Continue crawling the resolved object, unless we found a circular reference
            continueCrawling(isCircular);
        }
    );

    function done() {
        callback(isCircular);
    }
}
