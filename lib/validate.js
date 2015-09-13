'use strict';

var util              = require('./util'),
    ono               = require('ono'),
    ZSchema           = require('z-schema'),
    swaggerSchema     = require('swagger-schema-official/schema'),
    swaggerMethods    = require('swagger-methods'),
    schemaInitialized = false,
    primitiveTypes    = ['array', 'boolean', 'integer', 'number', 'string'],
    schemaTypes       = ['array', 'boolean', 'integer', 'number', 'null', 'object', 'string', undefined];

module.exports = validate;

/**
 * Validates the Swagger API.
 * Depending on the options, validation can include JSON Schema validation and/or Swagger Spec validation.
 *
 * @param {SwaggerParser} parser
 * @param {ParserOptions} options
 */
function validate(parser, options) {
  if (options.validate.schema) {
    validateAgainstSwaggerSchema(parser.api);
  }

  if (options.validate.spec) {
    validateAgainstSwaggerSpec(parser.api);
  }
}

/**
 * Validates the given Swagger API against the Swagger 2.0 schema.
 *
 * @param {SwaggerObject} api
 */
function validateAgainstSwaggerSchema(api) {
  util.debug('Validating against the Swagger 2.0 schema');

  initializeSchema();
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

/**
 * Performs one-time initialization logic to prepare the Swagger 2.0 JSON Schema for validation.
 */
function initializeSchema() {
  if (schemaInitialized) {
    return;
  }

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

  // TODO: Register all of the Swagger 2.0 formats
  ZSchema.registerFormat('xstring', function(str) {
    return str === 'xxx';
  });
}

/**
 * Validates parts of the Swagger 2.0 spec that aren't covered by the Swagger 2.0 JSON Schema.
 *
 * @param {SwaggerObject} api
 */
function validateAgainstSwaggerSpec(api) {
  util.debug('Validating against the Swagger 2.0 spec');

  // NOTE: We use for loops here instead of Array.ForEach
  // to prevent stack overflows on very deep APIs
  var paths = Object.keys(api.paths || {});
  for (var i = 0; i < paths.length; i++) {
    var pathName = paths[i];
    var path = api.paths[pathName];

    if (path && pathName.indexOf('/') === 0) {
      pathName = '/paths' + pathName;

      for (var j = 0; j < swaggerMethods.length; j++) {
        var operationName = swaggerMethods[j];
        var operation = path[operationName];

        if (operation) {
          operationName = pathName + '/' + operationName;
          validateParameters(api, path, pathName, operation, operationName);

          var responses = Object.keys(operation.responses || {});
          for (var k = 0; k < responses.length; k++) {
            var responseName = responses[k];
            var response = operation.responses[responseName];
            responseName = operationName + '/responses/' + responseName;
            validateResponse(response, responseName);
          }
        }
      }
    }
  }

  util.debug('    Validated successfully');
}

/**
 * Validates the parameters for the given operation.
 *
 * @param {SwaggerObject} api           - The entire Swagger API object
 * @param {object}        path          - A Path object, from the Swagger API
 * @param {string}        pathId        - A value that uniquely identifies the path
 * @param {object}        operation     - An Operation object, from the Swagger API
 * @param {string}        operationId   - A value that uniquely identifies the operation
 */
function validateParameters(api, path, pathId, operation, operationId) {
  var pathParams = path.parameters || [];
  var operationParams = operation.parameters || [];

  // Check for duplicate path parameters
  try {
    checkForDuplicates(pathParams);
  }
  catch (e) {
    throw ono.syntax(e, 'Validation failed. %s has duplicate parameters', pathId);
  }

  // Check for duplicate operation parameters
  try {
    checkForDuplicates(operationParams);
  }
  catch (e) {
    throw ono.syntax(e, 'Validation failed. %s has duplicate parameters', operationId);
  }

  // Combine the path and operation parameters,
  // with the operation params taking precedence over the path params
  var params = pathParams.reduce(function(params, value) {
    var duplicate = params.some(function(param) {
      return param.in === value.in && param.name == value.name;
    });
    if (!duplicate) {
      params.push(value);
    }
    return params;
  }, operationParams);

  validateBodyParameters(params, operationId);
  validatePathParameters(params, pathId, operationId);
  validateParameterTypes(params, api, operation, operationId);
}

/**
 * Validates body and formData parameters for the given operation.
 *
 * @param   {object[]}  params       -  An array of Parameter objects
 * @param   {string}    operationId  -  A value that uniquely identifies the operation
 */
function validateBodyParameters(params, operationId) {
  var bodyParams = params.filter(function(param) { return param.in === 'body'; });
  var formParams = params.filter(function(param) { return param.in === 'formData'; });

  // There can only be one "body" parameter
  if (bodyParams.length > 1) {
    throw ono.syntax(
      'Validation failed. %s has %d body parameters. Only one is allowed.',
      operationId, bodyParams.length
    );
  }
  else if (bodyParams.length > 0 && formParams.length > 0) {
    // "body" params and "formData" params are mutually exclusive
    throw ono.syntax(
      'Validation failed. %s has body parameters and formData parameters. Only one or the other is allowed.',
      operationId
    );
  }
}

/**
 * Validates path parameters for the given path.
 *
 * @param   {object[]}  params        - An array of Parameter objects
 * @param   {string}    pathId        - A value that uniquely identifies the path
 * @param   {string}    operationId   - A value that uniquely identifies the operation
 */
function validatePathParameters(params, pathId, operationId) {
  // Find all {placeholders} in the path string
  var placeholders = pathId.match(util.swaggerParamRegExp) || [];

  // Check for duplicates
  for (var i = 0; i < placeholders.length; i++) {
    for (var j = i + 1; j < placeholders.length; j++) {
      if (placeholders[i] === placeholders[j]) {
        throw ono.syntax(
          'Validation failed. %s has multiple path placeholders named %s', operationId, placeholders[i]);
      }
    }
  }

  params
    .filter(function(param) { return param.in === 'path'; })
    .forEach(function(param) {
      if (param.required !== true) {
        throw ono.syntax(
          'Validation failed. Path parameters cannot be optional. Set required=true for the "%s" parameter at %s',
          param.name,
          operationId
        );
      }
      var match = placeholders.indexOf('{' + param.name + '}');
      if (match === -1) {
        throw ono.syntax(
          'Validation failed. %s has a path parameter named "%s", but there is no corresponding {%s} in the path string',
          operationId,
          param.name,
          param.name
        );
      }
      placeholders.splice(match, 1);
    });

  if (placeholders.length > 0) {
    throw ono.syntax('Validation failed. %s is missing path parameter(s) for %s', operationId, placeholders);
  }
}

/**
 * Validates data types of parameters for the given operation.
 *
 * @param   {object[]}  params       -  An array of Parameter objects
 * @param   {object}    api          -  The entire Swagger API object
 * @param   {object}    operation    -  An Operation object, from the Swagger API
 * @param   {string}    operationId  -  A value that uniquely identifies the operation
 */
function validateParameterTypes(params, api, operation, operationId) {
  params.forEach(function(param) {
    var validTypes, schema;
    switch (param.in) {
      case 'body':
        validTypes = schemaTypes;
        schema = param.schema;
        break;
      case 'formData':
        validTypes = primitiveTypes.concat('file');
        schema = param;
        break;
      default:
        validTypes = primitiveTypes;
        schema = param;
    }

    if (validTypes.indexOf(schema.type) === -1) {
      throw ono.syntax(
        'Validation failed. %s has an invalid %s parameter type (%s)', operationId, param.in, schema.type);
    }

    if (schema.type === 'file') {
      // "file" params require specific "consumes" types
      var consumes = operation.consumes || api.consumes || [];
      if (consumes.indexOf('multipart/form-data') === -1 &&
        consumes.indexOf('application/x-www-form-urlencoded') === -1) {
        throw ono.syntax(
          'Validation failed. %s has a file parameter, so it must consume multipart/form-data ' +
          'or application/x-www-form-urlencoded',
          operationId
        );
      }
    }
    else if (schema.type === 'array' && !schema.items) {
      throw ono.syntax(
        'Validation failed. The "%s" %s parameter at %s is an array, so it must include an "items" schema',
        param.name,
        param.in,
        operationId
      );
    }
  });
}

/**
 * Checks the given parameter list for duplicates, and throws an error if found.
 *
 * @param   {object[]}  params  - An array of Parameter objects
 */
function checkForDuplicates(params) {
  for (var i = 0; i < params.length - 1; i++) {
    var outer = params[i];
    for (var j = i + 1; j < params.length; j++) {
      var inner = params[j];
      if (outer.name === inner.name && outer.in === inner.in) {
        throw ono.syntax('Validation failed. Found multiple %s parameters named "%s"', outer.in, outer.name);
      }
    }
  }
}

/**
 * Validates the given response object.
 *
 * @param   {object}    response    -  A Response object, from the Swagger API
 * @param   {string}    responseId  -  A value that uniquely identifies the response
 */
function validateResponse(response, responseId) {
  if (response.schema) {
    var validTypes = schemaTypes.concat('file');
    if (validTypes.indexOf(response.schema.type) === -1) {
      throw ono.syntax(
        'Validation failed. %s has an invalid response schema type (%s)', responseId, response.schema.type);
    }
  }
}

