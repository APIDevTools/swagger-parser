'use strict';

var Options           = require('./options'),
    util              = require('./util'),
    ono               = require('ono'),
    ZSchema           = require('z-schema'),
    swaggerSchema     = require('swagger-schema-official/schema'),
    bundle            = require('json-schema-ref-parser/lib/bundle'),
    dereference       = require('json-schema-ref-parser/lib/dereference'),
    schemaInitialized = false;

module.exports = validateSchema;

/**
 * Validates the given Swagger API against the Swagger 2.0 schema.
 *
 * @param {SwaggerParser} parser
 * - A parser containing an API that has been parsed and resolved, but NOT dereferenced.
 * It will be dereferenced during the schema-validation process.
 *
 * @param {ParserOptions} options
 */
function validateSchema(parser, options) {
  try {
    // Z-Schema does not support circular references
    // (see https://github.com/zaggino/z-schema/issues/137)
    var newOptions = new Options({$refs: {circular: false}});
    dereference(parser, newOptions);

    // No error was thrown, so we know the API doesn't have any circular references.
    // Therefore, it's safe to validate
    validateJsonSchema(parser.api);
  }
  catch (err) {
    if (err instanceof ReferenceError) {
      // The API has circular references, so we have to do a three-step process
      util.debug('Warning! This API contains circular references');

      // 1) Bundle the API (this is safe, since it doesn't produce circular references)
      bundle(parser, options);

      // 2) Validate the schema
      validateJsonSchema(parser.api);

      // 3) Dereference the API, now that we're done validating it
      dereference(parser, options);
    }
    else {
      throw err;
    }
  }
}

/**
 * Validates the given Swagger API against the Swagger 2.0 schema.
 *
 * @param {SwaggerObject} api
 */
function validateJsonSchema(api) {
  util.debug('Validating against the Swagger 2.0 schema');

  schemaInitialized || initializeSchema();
  var validator = new ZSchema();
  var isValid = validator.validate(api, swaggerSchema);

  if (isValid) {
    util.debug('    Validated successfully');
  }
  else {
    var err = validator.getLastError();
    var message = 'Swagger schema validation failed. ' + formatZSchemaError(err.details);
    throw ono.syntax(err, message);
  }
}

/**
 * Performs one-time initialization logic to prepare the Swagger 2.0 JSON Schema for validation.
 */
function initializeSchema() {
  schemaInitialized = true;

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
