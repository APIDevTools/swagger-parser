"use strict";

const { getJsonSchemaRefParserDefaultOptions } = require("@apidevtools/json-schema-ref-parser");
const schemaValidator = require("./validators/schema");
const specValidator = require("./validators/spec");

module.exports = ParserOptions;



/**
 * Merges the properties of the source object into the target object.
 *
 * @param target - The object that we're populating
 * @param source - The options that are being merged
 * @returns
 */
function merge (target, source) {
  if (isMergeable(source)) {
    // prevent prototype pollution
    const keys = Object.keys(source).filter((key) => !["__proto__", "constructor", "prototype"].includes(key));
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const sourceSetting = source[key];
      const targetSetting = target[key];

      if (isMergeable(sourceSetting)) {
        // It's a nested object, so merge it recursively
        target[key] = merge(targetSetting || {}, sourceSetting);
      }
      else if (sourceSetting !== undefined) {
        // It's a scalar value, function, or array. No merging necessary. Just overwrite the target value.
        target[key] = sourceSetting;
      }
    }
  }
  return target;
}
/**
 * Determines whether the given value can be merged,
 * or if it is a scalar value that should just override the target value.
 *
 * @param val
 * @returns
 */
function isMergeable (val) {
  return val && typeof val === "object" && !Array.isArray(val) && !(val instanceof RegExp) && !(val instanceof Date);
}

/**
 * Options that determine how Swagger APIs are parsed, resolved, dereferenced, and validated.
 *
 * @param {object|ParserOptions} [_options] - Overridden options
 * @class
 * @augments $RefParserOptions
 */
function ParserOptions (_options) {
  const defaultOptions = getJsonSchemaRefParserDefaultOptions();
  const options = merge(defaultOptions, ParserOptions.defaults);
  return merge(options, _options);
}

ParserOptions.defaults = {
  /**
   * Determines how the API definition will be validated.
   *
   * You can add additional validators of your own, replace an existing one with
   * your own implemenation, or disable any validator by setting it to false.
   */
  validate: {
    schema: schemaValidator,
    spec: specValidator,
  },
};
