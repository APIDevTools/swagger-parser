'use strict';

var _ = require('lodash');
var resolve = require('./resolve');
var util = require('./util');
var debug = require('./debug');


module.exports = dereference;


/**
 * Dereferences the given Swagger spec, replacing "$ref" pointers
 * with their corresponding object references.
 *
 * @param   {SwaggerObject} api             The Swagger API to dereference
 * @param   {State}         state           The state for the current parse operation
 * @param   {function}      callback
 */
function dereference(api, state, callback) {
    if (!state.options.resolve$Refs) {
        // Dereferencing is disabled, so just return the API as-is
        util.doCallback(callback, null, api);
        return;
    }

    // Resolve all $ref pointers
    resolve(api, state, function(err, api) {
        if (err) {
            util.doCallback(callback, err);
            return;
        }

        // Replace all $ref pointers with the resolved values
        util.crawlObject(api, callback,
            function(parent, propName, propPath, continueCrawling) {
                var $ref = parent[propName].$ref;

                if ($ref && _.has(state.$refs, $ref)) {
                    // We found a $ref pointer!  So replace it.
                    parent[propName] = state.$refs[$ref];
                }

                // NOTE: This will also crawl the reference object that we just added,
                // and replace any nested $ref pointers in it.
                continueCrawling();
            }
        );
    });
}
