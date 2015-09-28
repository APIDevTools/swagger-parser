'use strict';

var Options       = require('./options'),
    util          = require('./util'),
    ono           = require('ono'),
    swaggerSchema = require('swagger-schema-official/schema'),
    ZSchema       = require('z-schema');

module.exports = validateSchema;

initializeZSchema();

/**
 * Validates the given Swagger API against the Swagger 2.0 schema.
 *
 * @param {SwaggerObject} api
 */
function validateSchema(api) {
  util.debug('Validating against the Swagger 2.0 schema');

  // Validate the API against the Swagger schema
  var isValid = ZSchema.validate(api, swaggerSchema);

  if (isValid) {
    util.debug('    Validated successfully');
  }
  else {
    var err = ZSchema.getLastError();
    var message = 'Swagger schema validation failed. ' + formatZSchemaError(err.details);
    throw ono.syntax(err, message);
  }
}

/**
 * Performs one-time initialization logic to prepare for Swagger Schema validation.
 */
function initializeZSchema() {
  // Patch the Swagger schema to support "file" in addition to the JSON Schema primitives
  // See https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#response-object
  swaggerSchema.definitions.schema.properties.type = {
    'anyOf': [
      {'$ref': 'http://json-schema.org/draft-04/schema#/properties/type'},
      {
        'enum': ['file']
      }
    ]
  };

  ZSchema = new ZSchema({
    breakOnFirstError: true,
    noExtraKeywords: true,
    ignoreUnknownFormats: false
  });
}

/**
 * Z-Schema validation errors are a nested tree structure.
 * This function crawls that tree and builds an error message string.
 *
 * @param {object[]}  errors     - The Z-Schema error details
 * @param {string}    [indent]   - The whitespace used to indent the error message
 * @returns {string}
 */
function formatZSchemaError(errors, indent) {
  indent = indent || '  ';
  var message = '';
  errors.forEach(function(error, index) {
    message += util.format('\n%s%s at %s', indent, error.message, error.path);
    if (error.inner) {
      message += formatZSchemaError(error.inner, indent + '  ');
    }
  });
  return message;
}
