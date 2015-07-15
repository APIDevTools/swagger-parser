//'use strict';
//
//var util           = require('./util'),
//    tv4            = require('tv4'),
//    Promise        = require('./promise'),
//    _keys          = require('lodash/object/keys'),
//    _where         = require('lodash/collection/where'),
//    _unique        = require('lodash/array/unique'),
//    swaggerSchema  = require('swagger-schema-official/schema'),
//    primitiveTypes = ['array', 'boolean', 'integer', 'number', 'string'],
//    schemaTypes    = ['array', 'boolean', 'integer', 'number', 'null', 'object', 'string', undefined];
//
//module.exports = validate;
//
///**
// * @this SwaggerParser
// * @param {Options.validate} options
// * @returns {Promise}
// */
//function validate(options) {
//  /* jshint -W040 */
//  var me = this;
//  return new Promise(function(resolve, reject) {
//    //tv4.addSchema(swaggerSchema);
//    if (tv4.validate(me.api, swaggerSchema)) {
//      util.debug('    Validated successfully');
//    }
//    else {
//      reject(util.newSyntaxError(
//        '%s \nData path: "%s" \nSchema path: "%s"\n',
//        tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath)
//      );
//    }
//    resolve(me.api);
//  });
//}
//
///**
// * Validates the given Swagger API for adherence to the Swagger spec.
// *
// * @param   {SwaggerObject} api             The Swagger API to validate
// * @param   {State}         state           The state for the current parse operation
// * @param   {function}      callback
// */
//function validateOLD(api, state, callback) {
//  try {
//    if (state.options.validateSchema) {
//      validateAgainstSchema(api, state);
//    }
//
//    if (state.options.strictValidation) {
//      validateOperations(api, state);
//    }
//
//    util.doCallback(callback, null, api);
//  }
//  catch (e) {
//    util.doCallback(callback, e);
//  }
//}
//
///**
// * Validates the given Swagger API against the Swagger schema.
// */
//function validateAgainstSchema(api, state) {
//  util.debug('Validating "%s" against the Swagger schema', state.swaggerPath);
//
//  tv4.addSchema(swaggerSchema);
//  if (tv4.validate(api, swaggerSchema)) {
//    util.debug('    Validated successfully');
//  }
//  else {
//    throw util.newSyntaxError(
//      '%s \nData path: "%s" \nSchema path: "%s"\n',
//      tv4.error.message, tv4.error.dataPath, tv4.error.schemaPath);
//  }
//}
//
///**
// * Validates each operation in the Swagger API.
// */
//function validateOperations(api, state) {
//  // NOTE: We use for loops here instead of Array.ForEach
//  // to prevent stack overflows on very deep APIs
//  var paths = _keys(api.paths);
//  for (var i = 0; i < paths.length; i++) {
//    var pathName = paths[i];
//    var path = api.paths[pathName];
//
//    if (path && pathName.indexOf('/') === 0) {
//      pathName = '/paths' + pathName;
//
//      for (var j = 0; j < util.swaggerMethods.length; j++) {
//        var operationName = util.swaggerMethods[j];
//        var operation = path[operationName];
//
//        if (operation) {
//          operationName = pathName + '/' + operationName;
//          validateParameters(api, path, pathName, operation, operationName);
//
//          var responses = _keys(operation.responses);
//          for (var k = 0; k < responses.length; k++) {
//            var responseName = responses[k];
//            var response = operation.responses[responseName];
//            responseName = operationName + '/responses/' + responseName;
//            validateResponse(response, responseName);
//          }
//        }
//      }
//    }
//  }
//}
//
///**
// * Validates the parameters for the given operation.
// *
// * @param   {object}    api             The entire Swagger API object
// * @param   {object}    path            A Path object, from the Swagger API
// * @param   {string}    pathId          A value that uniquely identifies the path
// * @param   {object}    operation       An Operation object, from the Swagger API
// * @param   {string}    operationId     A value that uniquely identifies the operation
// */
//function validateParameters(api, path, pathId, operation, operationId) {
//  var pathParams = path.parameters || [];
//  var operationParams = operation.parameters || [];
//
//  // Check for duplicate path parameters
//  try {
//    checkForDuplicates(pathParams);
//  }
//  catch (e) {
//    throw util.newSyntaxError(e, '%s has duplicate parameters', pathId);
//  }
//
//  // Check for duplicate operation parameters
//  try {
//    checkForDuplicates(operationParams);
//  }
//  catch (e) {
//    throw util.newSyntaxError(e, '%s has duplicate parameters', operationId);
//  }
//
//  // Combine the path and operation parameters,
//  // with the operation params taking precedence over the path params
//  var params = _unique(operationParams.concat(pathParams), function(param) {
//    return param.in + param.name;
//  });
//
//  validateBodyParameters(params, operationId);
//  validatePathParameters(params, pathId, operationId);
//  validateParameterTypes(params, api, operation, operationId);
//}
//
///**
// * Validates body and formData parameters for the given operation.
// *
// * @param   {object[]}  params          An array of Parameter objects
// * @param   {string}    operationId     A value that uniquely identifies the operation
// */
//function validateBodyParameters(params, operationId) {
//  var bodyParams = _where(params, {in: 'body'});
//  var formParams = _where(params, {in: 'formData'});
//
//  // There can only be one "body" parameter
//  if (bodyParams.length > 1) {
//    throw util.newSyntaxError('%s has %d body parameters. Only one is allowed.', operationId, bodyParams.length);
//  }
//  else if (bodyParams.length > 0 && formParams.length > 0) {
//    // "body" params and "formData" params are mutually exclusive
//    throw util.newSyntaxError(
//      '%s has body parameters and formData parameters. Only one or the other is allowed.',
//      operationId
//    );
//  }
//}
//
///**
// * Validates path parameters for the given path.
// *
// * @param   {object[]}  params          An array of Parameter objects
// * @param   {string}    pathId          A value that uniquely identifies the path
// * @param   {string}    operationId     A value that uniquely identifies the operation
// */
//function validatePathParameters(params, pathId, operationId) {
//  // Find all {placeholders} in the path string
//  var placeholders = pathId.match(util.swaggerParamRegExp) || [];
//
//  // Check for duplicates
//  for (var i = 0; i < placeholders.length; i++) {
//    for (var j = i + 1; j < placeholders.length; j++) {
//      if (placeholders[i] === placeholders[j]) {
//        throw util.newSyntaxError('%s has multiple path placeholders named %s', operationId, placeholders[i]);
//      }
//    }
//  }
//
//  _where(params, {in: 'path'}).forEach(function(param) {
//    if (param.required !== true) {
//      throw util.newSyntaxError(
//        'Path parameters cannot be optional. Set required=true for the "%s" parameter at %s',
//        param.name,
//        operationId
//      );
//    }
//    var match = placeholders.indexOf('{' + param.name + '}');
//    if (match === -1) {
//      throw util.newSyntaxError(
//        '%s has a path parameter named "%s", but there is no corresponding {%s} in the path string',
//        operationId,
//        param.name,
//        param.name
//      );
//    }
//    placeholders.splice(match, 1);
//  });
//
//  if (placeholders.length > 0) {
//    throw util.newSyntaxError('%s is missing path parameter(s) for %s', operationId, placeholders);
//  }
//}
//
///**
// * Validates data types of parameters for the given operation.
// *
// * @param   {object[]}  params          An array of Parameter objects
// * @param   {object}    api             The entire Swagger API object
// * @param   {object}    operation       An Operation object, from the Swagger API
// * @param   {string}    operationId     A value that uniquely identifies the operation
// */
//function validateParameterTypes(params, api, operation, operationId) {
//  params.forEach(function(param) {
//    var validTypes, schema;
//    switch (param.in) {
//      case 'body':
//        validTypes = schemaTypes;
//        schema = param.schema;
//        break;
//      case 'formData':
//        validTypes = primitiveTypes.concat('file');
//        schema = param;
//        break;
//      default:
//        validTypes = primitiveTypes;
//        schema = param;
//    }
//
//    if (validTypes.indexOf(schema.type) === -1) {
//      throw util.newSyntaxError('%s has an invalid %s parameter type (%s)', operationId, param.in, schema.type);
//    }
//
//    if (schema.type === 'file') {
//      // "file" params require specific "consumes" types
//      var consumes = operation.consumes || api.consumes || [];
//      if (consumes.indexOf('multipart/form-data') === -1 &&
//        consumes.indexOf('application/x-www-form-urlencoded') === -1) {
//        throw util.newSyntaxError(
//          '%s has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded',
//          operationId
//        );
//      }
//    }
//    else if (schema.type === 'array' && !schema.items) {
//      throw util.newSyntaxError(
//        'The "%s" %s parameter at %s is an array, so it must include an "items" schema',
//        param.name,
//        param.in,
//        operationId
//      );
//    }
//  });
//}
//
///**
// * Checks the given parameter list for duplicates, and throws an error if found.
// *
// * @param   {object[]}  params  An array of Parameter objects
// */
//function checkForDuplicates(params) {
//  for (var i = 0; i < params.length - 1; i++) {
//    var outer = params[i];
//    for (var j = i + 1; j < params.length; j++) {
//      var inner = params[j];
//      if (outer.name === inner.name && outer.in === inner.in) {
//        throw util.newSyntaxError('Found multiple %s parameters named "%s"', outer.in, outer.name);
//      }
//    }
//  }
//}
//
///**
// * Validates the given response object.
// *
// * @param   {object}    response       A Response object, from the Swagger API
// * @param   {string}    responseId     A value that uniquely identifies the response
// */
//function validateResponse(response, responseId) {
//  if (response.schema) {
//    var validTypes = schemaTypes.concat('file');
//    if (validTypes.indexOf(response.schema.type) === -1) {
//      throw util.newSyntaxError('%s has an invalid response schema type (%s)', responseId, response.schema.type);
//    }
//  }
//}
//
