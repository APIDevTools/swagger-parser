import * as util from "../util";
import { ono } from "@jsdevtools/ono";
import type { ErrorObject } from "ajv-draft-04";
import AjvDraft4 from "ajv-draft-04";
import Ajv from "ajv/dist/2020";
import { openapi } from "@apidevtools/openapi-schemas";
import type { OpenAPI } from "openapi-types";

export default validateSchema;

/**
 * Validates the given Swagger API against the Swagger 2.0 or OpenAPI 3.0 and 3.1 schemas.
 *
 * @param {SwaggerObject} api
 */
function validateSchema(api: OpenAPI.Document) {
  let ajv;

  // Choose the appropriate schema (Swagger or OpenAPI)
  let schema;

  if (api && "swagger" in api && api.swagger) {
    schema = openapi.v2;
    ajv = initializeAjv();
  } else {
    if (api && "openapi" in api && api.openapi.startsWith("3.1")) {
      schema = openapi.v31;

      // There's a bug with Ajv in how it handles `$dynamicRef` in the way that it's used within the 3.1 schema so we
      // need to do some adhoc workarounds.
      // https://github.com/OAI/OpenAPI-Specification/issues/2689
      // https://github.com/ajv-validator/ajv/issues/1573
      const $defs = schema.$defs;
      if (!$defs) {
        throw new Error("Schema $defs is not defined");
      }
      const schemaDynamicRef = $defs.schema;
      if ("$dynamicAnchor" in schemaDynamicRef) {
        delete schemaDynamicRef.$dynamicAnchor;
      }

      if ($defs.components.properties) {
        $defs.components.properties.schemas.additionalProperties = schemaDynamicRef;
      }
      if ("dependentSchemas" in $defs.header && $defs.header.dependentSchemas) {
        ($defs.header.dependentSchemas as any).schema.properties.schema = schemaDynamicRef;
      }
      if ($defs["media-type"].properties) {
        $defs["media-type"].properties.schema = schemaDynamicRef;
      }
      if ($defs.parameter.properties) {
        $defs.parameter.properties.schema = schemaDynamicRef;
      }

      ajv = initializeAjv(false);
    } else {
      schema = openapi.v3;
      ajv = initializeAjv();
    }
  }
  // Validate against the schema
  const isValid = ajv.validate(schema, api);
  if (!isValid) {
    const err = ajv.errors!;
    const message = `Swagger schema validation failed.\n${formatAjvError(err)}`;
    throw ono.syntax<any, { details: any }>(err!, { details: err }, message);
  }
}

/**
 * Determines which version of Ajv to load and prepares it for use.
 *
 * @param {bool} draft04
 * @returns {Ajv}
 */
function initializeAjv(draft04 = true) {
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
 * @returns {string}
 */
function formatAjvError(errors: ErrorObject[], indent = "  ") {
  let message = "";
  for (const error of errors) {
    message += util.format(`${indent}#${error.instancePath.length ? error.instancePath : "/"} ${error.message}\n`);
  }
  return message;
}
