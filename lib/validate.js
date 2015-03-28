'use strict';

module.exports = validate;

var util          = require('./util'),
    tv4           = require('tv4'),
    swaggerSchema = require('swagger-schema-official/schema');


/**
 * Validates the given Swagger API for adherence to the Swagger spec.
 *
 * @param   {SwaggerObject} api             The Swagger API to validate
 * @param   {State}         state           The state for the current parse operation
 * @param   {function}      callback
 */
function validate(api, state, callback) {
    try {
        if (state.options.validateSchema) {
            validateAgainstSchema(api, state);
        }

//        if (state.options.strictValidation) {
//        }

        util.doCallback(callback, null, api);
    }
    catch (e) {
        util.doCallback(callback, e);
    }
}


/**
 * Validates the given Swagger API against the Swagger schema.
 *
 * @param   {SwaggerObject} api         The absolute or relative file path
 * @param   {State}         state       The state for the current parse operation
 */
function validateAgainstSchema(api, state) {
    util.debug('Validating "%s" against the Swagger schema', state.swaggerPath);

    if (tv4.validate(api, swaggerSchema)) {
        util.debug('    Validated successfully');
    }
    else {
        throw util.newSyntaxError(
            '%s \nData path: "%s" \nSchema path: "%s"\n',
            tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath);
    }
}
