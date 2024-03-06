import * as util from "../util";
import { ono } from "@jsdevtools/ono";
import { swaggerMethods } from "../util";
import type { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import { OpenAPI } from "openapi-types";
import Operation = OpenAPI.Operation;

type ParameterObject = OpenAPIV2.ParameterObject | OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV2.SchemaObject | OpenAPIV3_1.SchemaObject;
type ResponseObject = OpenAPIV3.ResponseObject | OpenAPIV2.ResponseObject | OpenAPIV3_1.ResponseObject;
type Parameters = OpenAPIV2.Parameter[] | OpenAPIV3.ParameterObject[] | OpenAPIV3_1.ParameterObject[];
type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV2.ReferenceObject | OpenAPIV3_1.ReferenceObject;
type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV2.PathItemObject | OpenAPIV3_1.PathItemObject;
const primitiveTypes = ["array", "boolean", "integer", "number", "string"];
const schemaTypes = ["array", "boolean", "integer", "number", "string", "object", "null", undefined];

export default validateSpec;

/**
 * Validates parts of the Swagger 2.0 spec that aren't covered by the Swagger 2.0 JSON Schema.
 *
 * @param {SwaggerObject} api
 */
function validateSpec(api: OpenAPI.Document) {
  if ("openapi" in api && api.openapi) {
    // We don't (yet) support validating against the OpenAPI spec
    return;
  }

  const paths = Object.keys(api.paths || {});
  const operationIds: string[] = [];
  for (const pathName of paths) {
    const path = api.paths![pathName];
    const pathId = `/paths${pathName}`;

    if (path && pathName[0] === "/") {
      validatePath(api, path, pathId, operationIds);
    }
  }

  if ("definitions" in api) {
    const definitions = Object.keys(api.definitions || {}) as (keyof OpenAPIV2.DefinitionsObject)[];
    for (const definitionName of definitions) {
      const definition = api.definitions![definitionName];
      const definitionId = `/definitions/${definitionName}`;
      validateRequiredPropertiesExist(definition, definitionId);
    }
  }
}

/**
 * Validates the given path.
 *
 * @param {SwaggerObject} api           - The entire Swagger API object
 * @param {object}        path          - A Path object, from the Swagger API
 * @param {string}        pathId        - A value that uniquely identifies the path
 * @param {string}        operationIds  - An array of collected operationIds found in other paths
 */
function validatePath(api: OpenAPI.Document, path: PathItemObject, pathId: string, operationIds: string[]) {
  for (const operationName of swaggerMethods) {
    const operation = path[operationName];
    const operationId = `${pathId}/${operationName}`;

    if (operation) {
      const declaredOperationId = operation.operationId;
      if (declaredOperationId) {
        if (!operationIds.includes(declaredOperationId)) {
          operationIds.push(declaredOperationId);
        } else {
          throw ono.syntax(`Validation failed. Duplicate operation id '${declaredOperationId}'`);
        }
      }
      validateParameters(api, path, pathId, operation, operationId);

      const responses = Object.keys(operation.responses || {});
      for (const responseName of responses) {
        const response = operation.responses[responseName];
        const responseId = `${operationId}/responses/${responseName}`;
        validateResponse(responseName, response || {}, responseId);
      }
    }
  }
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
function validateParameters(
  api: OpenAPI.Document,
  { parameters }: PathItemObject,
  pathId: string,
  operation: Operation,
  operationId: string,
) {
  const pathParams = (parameters || []) as Parameters;
  const operationParams = operation.parameters || [];

  // Check for duplicate path parameters
  try {
    checkForDuplicates(pathParams);
  } catch (e) {
    throw ono.syntax(e, `Validation failed. ${pathId} has duplicate parameters`);
  }

  // Check for duplicate operation parameters
  try {
    checkForDuplicates(operationParams);
  } catch (e) {
    throw ono.syntax(e, `Validation failed. ${operationId} has duplicate parameters`);
  }

  // Combine the path and operation parameters,
  // with the operation params taking precedence over the path params
  const params = pathParams.reduce((combinedParams, value) => {
    const duplicate = combinedParams.some((param) => param.in === value.in && param.name === value.name);
    if (!duplicate) {
      combinedParams.push(value);
    }
    return combinedParams;
  }, operationParams.slice());

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
function validateBodyParameters(params: Parameters[], operationId: string[]) {
  const bodyParams = params.filter((param) => param.in === "body");
  const formParams = params.filter((param) => param.in === "formData");

  // There can only be one "body" parameter
  if (bodyParams.length > 1) {
    throw ono.syntax(
      `Validation failed. ${operationId} has ${bodyParams.length} body parameters. Only one is allowed.`,
    );
  } else if (bodyParams.length > 0 && formParams.length > 0) {
    // "body" params and "formData" params are mutually exclusive
    throw ono.syntax(
      `Validation failed. ${operationId} has body parameters and formData parameters. Only one or the other is allowed.`,
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
function validatePathParameters(params: Parameters[], pathId: string, operationId: string) {
  // Find all {placeholders} in the path string
  const placeholders = pathId.match(util.swaggerParamRegExp) || [];

  // Check for duplicates
  for (let i = 0; i < placeholders.length; i++) {
    for (let j = i + 1; j < placeholders.length; j++) {
      if (placeholders[i] === placeholders[j]) {
        throw ono.syntax(`Validation failed. ${operationId} has multiple path placeholders named ${placeholders[i]}`);
      }
    }
  }

  params = params.filter((param) => param.in === "path");

  for (const param of params) {
    if (param.required !== true) {
      throw ono.syntax(
        `Validation failed. Path parameters cannot be optional. ${`Set required=true for the "${param.name}" parameter at ${operationId}`}`,
      );
    }
    const match = placeholders.indexOf(`{${param.name}}`);
    if (match === -1) {
      throw ono.syntax(
        `Validation failed. ${operationId} has a path parameter named "${param.name}", ` +
          `but there is no corresponding {${param.name}} in the path string`,
      );
    }
    placeholders.splice(match, 1);
  }

  if (placeholders.length > 0) {
    throw ono.syntax(`Validation failed. ${operationId} is missing path parameter(s) for ${placeholders}`);
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
function validateParameterTypes(
  params: Parameters[],
  api: OpenAPI.Document,
  operation: Operation,
  operationId: string,
) {
  for (const param of params) {
    const parameterId = `${operationId}/parameters/${param.name}`;
    let schema;
    let validTypes;

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

    validateSchema(schema, parameterId, validTypes);
    validateRequiredPropertiesExist(schema, parameterId);

    if (schema.type === "file") {
      // "file" params must consume at least one of these MIME types
      const formData = /multipart\/(.*\+)?form-data/;
      const urlEncoded = /application\/(.*\+)?x-www-form-urlencoded/;

      const consumes = operation.consumes || api.consumes || [];

      const hasValidMimeType = consumes.some((consume) => formData.test(consume) || urlEncoded.test(consume));

      if (!hasValidMimeType) {
        throw ono.syntax(
          `${`Validation failed. ${operationId} has a file parameter, so it must consume multipart/form-data `}or application/x-www-form-urlencoded`,
        );
      }
    }
  }
}

/**
 * Checks the given parameter list for duplicates, and throws an error if found.
 *
 * @param   {object[]}  params  - An array of Parameter objects
 */
function checkForDuplicates(params: Parameters | (ReferenceObject | ParameterObject)[]) {
  for (let i = 0; i < params.length - 1; i++) {
    const outer = params[i];
    for (let j = i + 1; j < params.length; j++) {
      const inner = params[j];
      if (outer.name === inner.name && outer.in === inner.in) {
        throw ono.syntax(`Validation failed. Found multiple ${outer.in} parameters named "${outer.name}"`);
      }
    }
  }
}

/**
 * Validates the given response object.
 *
 * @param   {string}    code        -  The HTTP response code (or "default")
 * @param   {object}    response    -  A Response object, from the Swagger API
 * @param   {string}    responseId  -  A value that uniquely identifies the response
 */
function validateResponse(
  code: string,
  response: ResponseObject | ReferenceObject | Record<string, never>,
  responseId: string,
) {
  const numericCode = parseInt(code, 10);
  if (code !== "default" && !Number.isNaN(numericCode) && (numericCode < 100 || numericCode > 599)) {
    throw ono.syntax(`Validation failed. ${responseId} has an invalid response code (${code})`);
  }

  if ("headers" in response && response.headers) {
    const headers = Object.keys(response.headers || {});
    for (const headerName of headers) {
      const header = response.headers[headerName];
      const headerId = `${responseId}/headers/${headerName}`;
      validateSchema(header, headerId, primitiveTypes);
    }
  }

  if ("schema" in response && response.schema) {
    const validTypes = schemaTypes.concat("file");
    if (!validTypes.includes(response.schema.type)) {
      throw ono.syntax(
        `Validation failed. ${responseId} has an invalid response schema type (${response.schema.type})`,
      );
    } else {
      validateSchema(response.schema, `${responseId}/schema`, validTypes);
    }
  }
}

/**
 * Validates the given Swagger schema object.
 *
 * @param {object}    schema      - A Schema object, from the Swagger API
 * @param {string}    schemaId    - A value that uniquely identifies the schema object
 * @param {string[]}  validTypes  - An array of the allowed schema types
 */
function validateSchema(schema: SchemaObject, schemaId: string, validTypes: string[]) {
  const type = schema.type;
  if (!validTypes.includes(type as unknown as string)) {
    throw ono.syntax(`Validation failed. ${schemaId} has an invalid type (${type})`);
  }

  if (type === "array" && !schema.items) {
    throw ono.syntax(`Validation failed. ${schemaId} is an array, so it must include an "items" schema`);
  }
}

/**
 * Validates that the declared properties of the given Swagger schema object actually exist.
 *
 * @param {object}    schema      - A Schema object, from the Swagger API
 * @param {string}    schemaId    - A value that uniquely identifies the schema object
 */
function validateRequiredPropertiesExist(schema: SchemaObject, schemaId: string) {
  /**
   * Recursively collects all properties of the schema and its ancestors. They are added to the props object.
   */
  function collectProperties({ properties, allOf }: SchemaObject, props: { [x: string]: any }) {
    if (properties) {
      for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
          props[property] = properties[property];
        }
      }
    }
    if (allOf) {
      for (const parent of allOf) {
        collectProperties(parent, props);
      }
    }
  }

  // The "required" keyword is only applicable for objects
  if (Array.isArray(schema.type) && !schema.type.includes("object")) {
    return;
  }
  if (!Array.isArray(schema.type) && schema.type !== "object") {
    return;
  }

  if ("required" in schema && schema.required && Array.isArray(schema.required)) {
    const props = {};
    collectProperties(schema, props);
    for (const requiredProperty of schema.required) {
      if (!props[requiredProperty]) {
        throw ono.syntax(
          `Validation failed. Property '${requiredProperty}' listed as required but does not exist in '${schemaId}'`,
        );
      }
    }
  }
}
