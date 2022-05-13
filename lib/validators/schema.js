"use strict";

const util = require("../util");
const { ono } = require("@jsdevtools/ono");
const AjvDraft4 = require("ajv-draft-04");
const Ajv = require("ajv/dist/2020");
const { openapi } = require("@apidevtools/openapi-schemas");

/**
 * The Swagger v2.0 or OpenAPI v3.0.x object - it could be either (but not both)
 *
 * cf.
 *    - https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swagger-object
 *    - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#oasObject
 *
 * @typedef {{swagger: string, info: {}, paths: {},
 *           openapi:string, }} SwaggerOrOpenAPIObject
 */

module.exports = validateSchema;

/**
 * Validates the given Swagger API against the Swagger 2.0 or OpenAPI 3.0 and 3.1 schemas.
 *
 * @param {SwaggerOrOpenAPIObject} api  Either a Swagger or OpenAPI object - determined by presence of swagger, or openapi fields
 */
function validateSchema (api) {
  let ajv;

  // Choose the appropriate schema (Swagger or OpenAPI)
  let schema;

  if (api.swagger) {
    schema = openapi.v2;
    ajv = initializeAjv();
  }
  else {
    if (api.openapi.startsWith("3.1")) {
      schema = openapi.v31;

      // There's a bug with Ajv in how it handles `$dynamicRef` in the way that it's used within the 3.1 schema so we
      // need to do some adhoc workarounds.
      // https://github.com/OAI/OpenAPI-Specification/issues/2689
      // https://github.com/ajv-validator/ajv/issues/1573
      const schemaDynamicRef = schema.$defs.schema;
      delete schemaDynamicRef.$dynamicAnchor;

      schema.$defs.components.properties.schemas.additionalProperties = schemaDynamicRef;
      schema.$defs.header.dependentSchemas.schema.properties.schema = schemaDynamicRef;
      schema.$defs["media-type"].properties.schema = schemaDynamicRef;
      schema.$defs.parameter.properties.schema = schemaDynamicRef;

      ajv = initializeAjv(false);
    }
    else {
      schema = openapi.v3;
      ajv = initializeAjv();
    }
  }

  // Validate against the schema
  let isValid = ajv.validate(schema, api);
  if (!isValid) {
    let err = ajv.errors;
    let message = "Swagger schema validation failed.\n" + formatAjvError(err);
    throw ono.syntax(err, { details: err }, message);
  }
}

/**
 * Determines which version of Ajv to load and prepares it for use.
 *
 * @param {boolean} draft04  Are we initialising for JsonSchemaDraft04?
 * @returns {Ajv}  The initialized Ajv environment
 */
function initializeAjv (draft04 = true) {
  const opts = {
    allErrors: true,
    strict: false,
    validateFormats: false,
  };

  if (draft04) {
    return new AjvDraft4(opts);
  }

  return new Ajv(opts);
}

/**
 * Run through a set of Ajv errors and compile them into an error message string.
 *
 * @param {object[]}  errors     - The Ajv errors
 * @param {string}    [indent]   - The whitespace used to indent the error message
 * @returns {string}             - Formatted error message string
 */
function formatAjvError (errors, indent) {
  indent = indent || "  ";
  let message = "";
  for (let error of errors) {
    message += util.format(`${indent}#${error.instancePath.length ? error.instancePath : "/"} ${error.message}\n`);
  }
  return message;
}
