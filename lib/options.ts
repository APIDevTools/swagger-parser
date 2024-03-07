import type $RefParserOptions from "@apidevtools/json-schema-ref-parser/lib/options";
import { getNewOptions } from "@apidevtools/json-schema-ref-parser/lib/options";
import schemaValidator from "./validators/schema";
import specValidator from "./validators/spec";
import type { DeepPartial } from "@apidevtools/json-schema-ref-parser/dist/lib/options";
import type { Document } from "./index";
export default SwaggerParserOptions;

/**
 * SwaggerParserOptions that determine how Swagger APIs are parsed, resolved, dereferenced, and validated.
 *
 * @param {object|SwaggerParserOptions} [_options] - Overridden options
 * @class
 * @augments $RefParserOptions
 */
export interface ParserOptionsStrict<S extends Document = Document> extends $RefParserOptions<S> {
  validate: {
    schema?: typeof schemaValidator | false;
    spec?: typeof specValidator | false;
  };
}

export type SwaggerParserOptions<S extends Document = Document> = DeepPartial<ParserOptionsStrict<S>>;

const getSwaggerParserDefaultOptions = (): SwaggerParserOptions => {
  const baseDefaults = getNewOptions({});
  return {
    ...baseDefaults,
    validate: {
      schema: schemaValidator,
      spec: specValidator,
    },
  };
};

/**
 * Merges the properties of the source object into the target object.
 *
 * @param target - The object that we're populating
 * @param source - The options that are being merged
 * @returns
 */
function merge(target: any, source: any) {
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
      } else if (sourceSetting !== undefined) {
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
function isMergeable(val: any) {
  return val && typeof val === "object" && !Array.isArray(val) && !(val instanceof RegExp) && !(val instanceof Date);
}
export const getSwaggerParserOptions = <S extends Document = Document>(
  options: SwaggerParserOptions<S> | object,
): ParserOptionsStrict<S> => {
  const newOptions = getSwaggerParserDefaultOptions();
  if (options) {
    merge(newOptions, options);
  }
  return newOptions as ParserOptionsStrict;
};
