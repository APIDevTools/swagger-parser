"use strict";

const util = require("../util");
const { ono } = require("@jsdevtools/ono");
const swaggerMethods = require("@apidevtools/swagger-methods");
const primitiveTypes = ["array", "boolean", "integer", "number", "string"];
const schemaTypes = ["array", "boolean", "integer", "number", "string", "object", "null", undefined];

module.exports = validateSpec;

/**
 * Validates parts of the Swagger 2.0 spec that aren't covered by the Swagger 2.0 JSON Schema.
 *
 * @param {object}        api           - The entire Swagger API object
 */
function validateSpec (api) {
  let paths = Object.keys(api.paths || {});
  let operationIds = [];

  // accumulate errors
  let message = "Specification check failed.\n";
  let isValid = true;

  for (let pathName of paths) {
    let path = api.paths[pathName];
    let pathId = "/paths" + pathName;

    try {

      // ...and off we go ...
      if (path && pathName.indexOf("/") === 0) {
        validatePath(api, path, pathId, operationIds);
      }
    }
    catch (err) {
      message += err.message;
      isValid = false;
    }

    // in OpenAPI v3.0 they are in re-usable schemas are in #/components/schemas
    if (api.openapi) {
      let schemas = Object.keys(api.components?.schemas || {});
      for (let schemaName of schemas) {
        let schema = api.components.schemas[schemaName];
        let schemaId = "/components/schemas/" + schemaName;

        try {
          validateRequiredPropertiesExist(schema, schemaId);
        }
        catch (err) {
          message += err.message;
          isValid = false;
        }
      }
    }
    else {
      // ... in Swagger v2.0 they were definitions
      let definitions = Object.keys(api.definitions || {});
      for (let definitionName of definitions) {
        let definition = api.definitions[definitionName];
        let definitionId = "/definitions/" + definitionName;

        try {
          validateRequiredPropertiesExist(definition, definitionId);
        }
        catch (err) {
          message += err.message;
          isValid = false;
        }
      }
    }
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates the given path.
 *
 * @param {object}        api           - The entire Swagger API object
 * @param {object}        path          - A Path object, from the Swagger API
 * @param {string}        pathId        - A value that uniquely identifies the path
 * @param {string}        operationIds  - An array of collected operationIds found in other paths
 */
function validatePath (api, path, pathId, operationIds) {
  // accumulate errors
  let message = "";
  let isValid = true;

  for (let operationName of swaggerMethods) {
    let operation = path[operationName];
    let operationId = pathId + "/" + operationName;

    if (operation) {
      let declaredOperationId = operation.operationId;
      if (declaredOperationId) {
        if (operationIds.indexOf(declaredOperationId) === -1) {
          operationIds.push(declaredOperationId);
        }
        else {
          message += `Validation failed. Duplicate operation id '${declaredOperationId}'\n`;
          isValid = false;
        }
      }
      try {
        validateParameters(api, path, pathId, operation, operationId);
      }
      catch (err) {
        message += err.message;
        isValid = false;
      }

      let responses = Object.keys(operation.responses || {});
      for (let responseName of responses) {
        let response = operation.responses[responseName];
        let responseId = operationId + "/responses/" + responseName;

        try {
          validateResponse(api, responseName, (response || {}), responseId);
        }
        catch (err) {
          message += err.message;
          isValid = false;
        }
      }
    }
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates the parameters for the given operation.
 *
 * @param {object}        api           - The entire Swagger API object
 * @param {object}        path          - A Path object, from the Swagger API
 * @param {string}        pathId        - A value that uniquely identifies the path
 * @param {object}        operation     - An Operation object, from the Swagger API
 * @param {string}        operationId   - A value that uniquely identifies the operation
 */
function validateParameters (api, path, pathId, operation, operationId) {
  let pathParams = path.parameters || [];
  let operationParams = operation.parameters || [];

  // accumulate errors
  let message = "";
  let isValid = true;

  // Check for duplicate path parameters
  try {
    checkForDuplicates(pathParams);
  }
  catch (e) {
    message += `Validation failed. ${pathId} has duplicate parameters\n` + e.message;
    isValid = false;
  }

  // Check for duplicate operation parameters
  try {
    checkForDuplicates(operationParams);
  }
  catch (e) {
    message += `Validation failed. ${operationId} has duplicate parameters\n` + e.message;
    isValid = false;
  }

  // Combine the path and operation parameters,
  // with the operation params taking precedence over the path params
  let params = pathParams.reduce((combinedParams, value) => {
    let duplicate = combinedParams.some((param) => {
      return param.in === value.in && param.name === value.name;
    });
    if (!duplicate) {
      combinedParams.push(value);
    }
    return combinedParams;
  }, operationParams.slice());

  try {
    validateBodyParameters(params, operationId);
  }
  catch (err) {
    message += err.message;
    isValid = false;
  }
  try {
    validatePathParameters(params, pathId, operationId);
  }
  catch (err) {
    message += err.message;
    isValid = false;
  }
  try {
    validateParameterTypes(params, api, operation, operationId);
  }
  catch (err) {
    message += err.message;
    isValid = false;
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates body and formData parameters for the given operation.
 *
 * @param   {object[]}  params       -  An array of Parameter objects
 * @param   {string}    operationId  -  A value that uniquely identifies the operation
 */
function validateBodyParameters (params, operationId) {
  let bodyParams = params.filter((param) => { return param.in === "body"; });
  let formParams = params.filter((param) => { return param.in === "formData"; });


  // accumulate errors
  let message = "";
  let isValid = true;

  // There can only be one "body" parameter
  if (bodyParams.length > 1) {
    message +=
      `Validation failed. ${operationId} has ${bodyParams.length} body parameters. Only one is allowed.\n`;
    isValid = false;
  }
  else if (bodyParams.length > 0 && formParams.length > 0) {
    // "body" params and "formData" params are mutually exclusive
    message +=
      `Validation failed. ${operationId} has body parameters and formData parameters. Only one or the other is allowed.\n`;
    isValid = false;
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates path parameters for the given path.
 *
 * @param   {object[]}  params        - An array of Parameter objects
 * @param   {string}    pathId        - A value that uniquely identifies the path
 * @param   {string}    operationId   - A value that uniquely identifies the operation
 */
function validatePathParameters (params, pathId, operationId) {
  // Find all {placeholders} in the path string
  let placeholders = pathId.match(util.swaggerParamRegExp) || [];

  // accumulate errors
  let message = "";
  let isValid = true;

  // Check for duplicates
  for (let i = 0; i < placeholders.length; i++) {
    for (let j = i + 1; j < placeholders.length; j++) {
      if (placeholders[i] === placeholders[j]) {
        message +=
          `Validation failed. ${operationId} has multiple path placeholders named ${placeholders[i]}\n`;
        isValid = false;
      }
    }
  }

  params = params.filter((param) => { return param.in === "path"; });

  for (let param of params) {
    if (param.required !== true) {
      message +=
        "Validation failed. Path parameters cannot be optional. " +
        `Set required=true for the "${param.name}" parameter at ${operationId}\n`;
      isValid = false;
    }
    let match = placeholders.indexOf("{" + param.name + "}");
    if (match === -1) {
      message +=
        `Validation failed. ${operationId} has a path parameter named "${param.name}", ` +
        `but there is no corresponding {${param.name}} in the path string\n`;
      isValid = false;
    }
    placeholders.splice(match, 1);
  }

  if (placeholders.length > 0) {
    message += `Validation failed. ${operationId} is missing path parameter(s) for ${placeholders}`;
    isValid = false;
  }

  if (!isValid) {
    throw ono.syntax(message);
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
function validateParameterTypes (params, api, operation, operationId) {

  let message = "";
  let isValid = true;

  for (let param of params) {
    let parameterId = operationId + "/parameters/" + param.name;
    let schema, validTypes;

    // schema is always inside 'schema' tag in openapi specs...
    if (api.openapi) {
      schema = param.schema;
      validTypes = schemaTypes;
    }
    else {
      //  Swagger 2.0 was different...
      switch (param.in) {
        case "body":
          schema = param.schema;
          validTypes = schemaTypes;
          break;
        case "formData":
          schema = param;
          validTypes = primitiveTypes.concat("file");
          break;
        default:
          schema = param;
          validTypes = primitiveTypes;
      }
    }

    try {
      validateSchema(schema, parameterId, validTypes);
      validateRequiredPropertiesExist(schema, parameterId);
    }
    catch (err) {
      message += err.message;
      isValid = false;
    }

    if (schema.type === "file") {
      // "file" params must consume at least one of these MIME types
      let formData = /multipart\/(.*\+)?form-data/;
      let urlEncoded = /application\/(.*\+)?x-www-form-urlencoded/;

      let consumes = operation.consumes || api.consumes || [];

      let hasValidMimeType = consumes.some((consume) => {
        return formData.test(consume) || urlEncoded.test(consume);
      });

      if (!hasValidMimeType) {
        message += `Validation failed. ${operationId} has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded\n`;
        isValid = false;
      }
    }
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Checks the given parameter list for duplicates, and throws an error if found.
 *
 * @param   {object[]}  params  - An array of Parameter objects
 */
function checkForDuplicates (params) {
  let message = "";
  let isValid = true;

  for (let i = 0; i < params.length - 1; i++) {
    let outer = params[i];
    for (let j = i + 1; j < params.length; j++) {
      let inner = params[j];
      if (outer.name === inner.name && outer.in === inner.in) {
        message += `Validation failed. Found multiple ${outer.in} parameters named "${outer.name}"\n`;
        isValid = false;
      }
    }
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates the given response object.
 *
 * @param   {object}    api         -  The entire Swagger API object
 * @param   {string}    code        -  The HTTP response code (or "default")
 * @param   {object}    response    -  A Response object, from the Swagger API
 * @param   {string}    responseId  -  A value that uniquely identifies the response
 */
function validateResponse (api, code, response, responseId) {

  let message = "";
  let isValid = true;

  if (code !== "default" && (code < 100 || code > 599)) {
    message += `Validation failed. ${responseId} has an invalid response code (${code})\n`;
    isValid = false;
  }

  let headers = Object.keys(response.headers || {});
  for (let headerName of headers) {
    let header = response.headers[headerName];
    let headerId = responseId + "/headers/" + headerName;
    let schema, validTypes;

    // schema is always inside 'schema' tag in openapi specs...
    if (api.openapi) {
      schema = header.schema;
      validTypes = schemaTypes;
    }
    else {
      //  Swagger 2.0 was different...
      schema = header;
      validTypes = primitiveTypes;
    }
    try {
      validateSchema(schema, headerId, validTypes);
    }
    catch (err) {
      message += err.message;
      isValid = false;
    }
  }

  if (response.schema) {
    let validTypes = schemaTypes.concat("file");
    if (validTypes.indexOf(response.schema.type) === -1) {
      message += `Validation failed. ${responseId} has an invalid response schema type (${response.schema.type})\n`;
      isValid = false;
    }
    else {
      try {
        validateSchema(response.schema, responseId + "/schema", validTypes);
      }
      catch (err) {
        message += err.message;
        isValid = false;
      }
    }
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates the given Swagger schema object.
 *
 * @param {object}    schema      - A Schema object, from the Swagger API
 * @param {string}    schemaId    - A value that uniquely identifies the schema object
 * @param {string[]}  validTypes  - An array of the allowed schema types
 */
function validateSchema (schema, schemaId, validTypes) {
  let message = "";
  let isValid = true;

  if (validTypes.indexOf(schema.type) === -1) {
    message += `Validation failed. ${schemaId} has an invalid type (${schema.type})\n`;
    isValid = false;
  }

  if (schema.type === "array" && !schema.items) {
    message += `Validation failed. ${schemaId} is an array, so it must include an "items" schema\n`;
    isValid = false;
  }

  if (!isValid) {
    throw ono.syntax(message);
  }
}

/**
 * Validates that the declared properties of the given Swagger schema object actually exist.
 *
 * @param {object}    schema      - A Schema object, from the Swagger API
 * @param {string}    schemaId    - A value that uniquely identifies the schema object
 */
function validateRequiredPropertiesExist (schema, schemaId) {
  /**
   * Recursively collects all properties of the schema and its ancestors. They are added to the props object.
   */
  function collectProperties (schemaObj, props) {
    if (schemaObj.properties) {
      for (let property in schemaObj.properties) {
        if (schemaObj.properties.hasOwnProperty(property)) {
          props[property] = schemaObj.properties[property];
        }
      }
    }
    if (schemaObj.allOf) {
      for (let parent of schemaObj.allOf) {
        collectProperties(parent, props);
      }
    }
  }

  if (schema.required && Array.isArray(schema.required)) {
    let props = {};
    collectProperties(schema, props);

    let message = "";
    let isValid = true;

    for (let requiredProperty of schema.required) {
      if (!props[requiredProperty]) {
        message += `Validation failed. Property '${requiredProperty}' listed as required but does not exist in '${schemaId}'\n`;
        isValid = false;
      }
    }
    if (!isValid) {
      throw ono.syntax(message);
    }
  }
}
