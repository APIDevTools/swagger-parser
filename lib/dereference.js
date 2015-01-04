'use strict';

module.exports = dereference;

var _ = require('lodash');
var util = require('./util');


/**
 * Dereferences the given Swagger spec, replacing "$ref" pointers
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

    // Replace all $ref pointers with their resolved values
    util.crawlObject(api, callback,
        function(parent, propName, propPath, continueCrawling) {
            var $ref = parent[propName].$ref;

            if ($ref) {
                // We found a $ref pointer.  Do we have a corresponding resolved value?
                if (_.has(state.$refs, $ref)) {
                    // Replace the $ref pointer with its resolved value
                    parent[propName] = state.$refs[$ref];
                }
            }

            // NOTE: This will also crawl the resolved value that we just added
            // and replace any nested $ref pointers in it too.
            continueCrawling();
        }
    );
}
