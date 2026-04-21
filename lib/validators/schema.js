"use strict";

const util = require("../util");
const Ajv = require("ajv/dist/2020");
const { openapi } = require("@apidevtools/openapi-schemas");

module.exports = validateSchema;

/**
 * Validates the given Swagger API against the Swagger 2.0 or OpenAPI 3.0 and 3.1 schemas.
 *
 * @param {SwaggerObject} api
 */
function validateSchema(api) {
  let ajv;

  // Choose the appropriate schema (Swagger or OpenAPI)
  let schema;

  if (api.swagger) {
    schema = openapi.v2;
    ajv = initializeAjv();
  } else {
    if (api.openapi.startsWith("3.1") || api.openapi.startsWith("3.2")) {
      schema = structuredClone(openapi.v31);

      if (api.openapi.startsWith("3.2")) {
        applyOpenApi32Compat(schema);
      }

      // There's a bug with Ajv in how it handles `$dynamicRef` in the way that it's used within the 3.1 schema so we
      // need to do some adhoc workarounds.
      // https://github.com/OAI/OpenAPI-Specification/issues/2689
      // https://github.com/ajv-validator/ajv/issues/1573
      const schemaDynamicRef = schema.$defs.schema;
      delete schemaDynamicRef.$dynamicAnchor;

      schema.$defs.components.properties.schemas.additionalProperties = schemaDynamicRef;
      schema.$defs.header.dependentSchemas.schema.properties.schema = schemaDynamicRef;
      schema.$defs["media-type"].properties.schema = schemaDynamicRef;
      if (schema.$defs["media-type"].properties.itemSchema) {
        schema.$defs["media-type"].properties.itemSchema = schemaDynamicRef;
      }
      schema.$defs.parameter.properties.schema = schemaDynamicRef;

      ajv = initializeAjv(false);
    } else {
      schema = openapi.v3;
      ajv = initializeAjv();
    }
  }

  // Validate against the schema
  let isValid = ajv.validate(schema, api);
  if (!isValid) {
    let err = ajv.errors;
    let message = "Swagger schema validation failed.\n" + formatAjvError(err);
    const error = new SyntaxError(message);
    error.details = err;
    throw error;
  }
}

/**
 * Applies a targeted compatibility layer so the bundled OpenAPI 3.1 schema can validate
 * the most important OpenAPI 3.2 additions until @apidevtools/openapi-schemas ships v3.2.
 *
 * @param {object} schema
 */
function applyOpenApi32Compat(schema) {
  schema.properties.openapi.pattern = "^3\\.2\\.\\d+(-.+)?$";

  schema.$defs.components.properties.mediaTypes = {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/media-type",
    },
  };

  schema.$defs["path-item"].patternProperties["^query$"] = {
    $ref: "#/$defs/operation",
  };
  schema.$defs["path-item"].properties.additionalOperations = {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/operation",
    },
  };

  schema.$defs.response.properties.summary = {
    type: "string",
  };

  schema.$defs["media-type"].properties.itemSchema = {
    $dynamicRef: "#meta",
  };
  schema.$defs["media-type"].properties.prefixEncoding = {
    type: "array",
    items: {
      $ref: "#/$defs/encoding",
    },
  };
  schema.$defs["media-type"].properties.itemEncoding = {
    $ref: "#/$defs/encoding",
  };

  schema.$defs.tag.properties.summary = {
    type: "string",
  };
  schema.$defs.tag.properties.parent = {
    type: "string",
  };
  schema.$defs.tag.properties.kind = {
    type: "string",
  };

  schema.$defs.parameter.properties.in.enum.push("querystring");

  schema.$defs["security-scheme"].properties.oauth2MetadataUrl = {
    $ref: "#/$defs/uri",
  };
  schema.$defs["security-scheme"].properties.deprecated = {
    default: false,
    type: "boolean",
  };

  schema.$defs["oauth-flows"].properties.deviceAuthorization = {
    $ref: "#/$defs/oauth-flows/$defs/device-authorization",
  };
  schema.$defs["oauth-flows"].$defs["device-authorization"] = {
    type: "object",
    properties: {
      deviceAuthorizationUrl: {
        type: "string",
      },
      tokenUrl: {
        type: "string",
      },
      refreshUrl: {
        type: "string",
      },
      scopes: {
        $ref: "#/$defs/map-of-strings",
      },
    },
    required: ["deviceAuthorizationUrl", "tokenUrl", "scopes"],
    $ref: "#/$defs/specification-extensions",
    unevaluatedProperties: false,
  };
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
    const AjvDraft4 = require("ajv-draft-04");
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
function formatAjvError(errors, indent) {
  indent = indent || "  ";
  let message = "";
  for (let error of errors) {
    message += util.format(`${indent}#${error.instancePath.length ? error.instancePath : "/"} ${error.message}\n`);
  }
  return message;
}
