"use strict";

const util = require("../util");
const { ono } = require("ono");
const ZSchema = require("z-schema");
const { openapi } = require("openapi-schemas");

module.exports = validateSchema;

let zSchema = initializeZSchema();

/**
 * Validates the given Swagger API against the Swagger 2.0 or 3.0 schema.
 *
 * @param {SwaggerObject} api
 */
function validateSchema (api) {
  // Choose the appropriate schema (Swagger or OpenAPI)
  let schema = api.swagger ? openapi.v2 : openapi.v3;

  // Validate against the schema
  let isValid = zSchema.validate(api, schema);

  if (!isValid) {
    let err = zSchema.getLastError();
    let message = "Swagger schema validation failed. \n" + formatZSchemaError(err.details);
    throw ono.syntax(err, { details: err.details }, message);
  }
}

/**
 * Performs one-time initialization logic to prepare for Swagger Schema validation.
 */
function initializeZSchema () {
  // HACK: Delete the OpenAPI schema IDs because ZSchema can't resolve them
  delete openapi.v2.id;
  delete openapi.v3.id;

  // The OpenAPI 3.0 schema uses "uri-reference" formats.
  // Assume that any non-whitespace string is valid.
  ZSchema.registerFormat("uri-reference", (value) => value.trim().length > 0);

  // Configure ZSchema
  return new ZSchema({
    breakOnFirstError: true,
    noExtraKeywords: true,
    ignoreUnknownFormats: false,
    reportPathAsArray: true
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
function formatZSchemaError (errors, indent) {
  indent = indent || "  ";
  let message = "";
  for (let error of errors) {
    message += util.format(`${indent}${error.message} at #/${error.path.join("/")}\n`);
    if (error.inner) {
      message += formatZSchemaError(error.inner, indent + "  ");
    }
  }
  return message;
}
