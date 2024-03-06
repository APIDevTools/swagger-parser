/* eslint-disable no-unused-vars */
import validateSchema from "./validators/schema";
import validateSpec from "./validators/spec";
import normalizeArgs from "./normalize-args";
import * as util from "./util";
import { getSwaggerParserOptions, SwaggerParserOptions } from "./options";
import maybe from "@apidevtools/json-schema-ref-parser/lib/util/maybe";
import { ono } from "@jsdevtools/ono";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import _dereference from "@apidevtools/json-schema-ref-parser/lib/dereference";
import type { OpenAPI, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type $Refs from "@apidevtools/json-schema-ref-parser/dist/lib/refs";
import type { FileInfo, Plugin, HTTPResolverOptions } from "@apidevtools/json-schema-ref-parser/dist/lib/types";

const isSwaggerSchema = (schema: any): schema is OpenAPI.Document => {
  return "swagger" in schema || "openapi" in schema;
};

const isOpenApiSchema = (schema: any): schema is OpenAPIV3.Document | OpenAPIV3_1.Document => {
  return "openapi" in schema && schema.openapi !== undefined;
};

/**
 * This class parses a Swagger 2.0 or 3.0 API, resolves its JSON references and their resolved values,
 * and provides methods for traversing, dereferencing, and validating the API.
 *
 * @class
 * @augments $RefParser
 */
export class SwaggerParser extends $RefParser {
  /**
   * The `api` property is the parsed/bundled/dereferenced OpenAPI definition. This is the same value that is passed to the callback function (or Promise) when calling the parse, bundle, or dereference methods.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#api
   */
  public api: OpenAPI.Document | null = null;

  /**
   * Parses the given Swagger API.
   * This method does not resolve any JSON references.
   * It just reads a single file in JSON or YAML format, and parse it as a JavaScript object.
   *
   * @param {string} [path] - The file path or URL of the JSON schema
   * @param {object} [api] - The Swagger API object. This object will be used instead of reading from `path`.
   * @param {SwaggerParserOptions} [options] - SwaggerParserOptions that determine how the API is parsed
   * @param {Function} [callback] - An error-first callback. The second parameter is the parsed API object.
   * @returns {Promise} - The returned promise resolves with the parsed API object.
   */

  public parse(api: SwaggerParserSchema, callback: ApiCallback): void;
  public parse(api: SwaggerParserSchema, options: SwaggerParserOptions, callback: ApiCallback): void;
  public parse(baseUrl: string, api: SwaggerParserSchema, options: SwaggerParserOptions, callback: ApiCallback): void;
  public parse(api: SwaggerParserSchema): Promise<OpenAPI.Document>;
  public parse(api: SwaggerParserSchema, options: SwaggerParserOptions): Promise<OpenAPI.Document>;
  public parse(baseUrl: string, api: SwaggerParserSchema, options: SwaggerParserOptions): Promise<OpenAPI.Document>;
  async parse() {
    const args = normalizeArgs(arguments);
    args.options = getSwaggerParserOptions(args.options);

    try {
      const schema = await super.parse(args.path, args.schema, args.options);
      if (!isSwaggerSchema(schema)) {
        throw ono.syntax(`${args.path || args.schema} is not a valid Swagger API definition`);
      }

      if ("swagger" in schema && schema.swagger) {
        // Verify that the parsed object is a Swagger API
        if (schema.swagger === undefined || schema.info === undefined || schema.paths === undefined) {
          throw ono.syntax(`${args.path || args.schema} is not a valid Swagger API definition`);
        } else if (typeof schema.swagger === "number") {
          // This is a very common mistake, so give a helpful error message
          throw ono.syntax('Swagger version number must be a string (e.g. "2.0") not a number.');
        } else if (typeof schema.info.version === "number") {
          // This is a very common mistake, so give a helpful error message
          throw ono.syntax('API version number must be a string (e.g. "1.0.0") not a number.');
        } else if (schema.swagger !== "2.0") {
          throw ono.syntax(`Unrecognized Swagger version: ${schema.swagger}. Expected 2.0`);
        }
      } else {
        const supportedVersions = ["3.0.0", "3.0.1", "3.0.2", "3.0.3", "3.1.0"];

        if (!isOpenApiSchema(schema)) {
          throw ono.syntax(`${args.path || args.schema} is not a valid Openapi API definition`);
        }

        // Verify that the parsed object is a Openapi API
        if (schema.openapi === undefined || schema.info === undefined) {
          throw ono.syntax(`${args.path || args.schema} is not a valid Openapi API definition`);
        } else if (schema.paths === undefined) {
          if (schema.openapi === "3.1.0") {
            if ("webhooks" in schema && schema.webhooks === undefined) {
              throw ono.syntax(`${args.path || args.schema} is not a valid Openapi API definition`);
            }
          } else {
            throw ono.syntax(`${args.path || args.schema} is not a valid Openapi API definition`);
          }
        } else if (typeof schema.openapi === "number") {
          // This is a very common mistake, so give a helpful error message
          throw ono.syntax('Openapi version number must be a string (e.g. "3.0.0") not a number.');
        } else if (typeof schema.info.version === "number") {
          // This is a very common mistake, so give a helpful error message
          throw ono.syntax('API version number must be a string (e.g. "1.0.0") not a number.');
        } else if (!supportedVersions.includes(schema.openapi)) {
          throw ono.syntax(
            `Unsupported OpenAPI version: ${schema.openapi}. ` +
              `Swagger Parser only supports versions ${supportedVersions.join(", ")}`,
          );
        }

        // This is an OpenAPI v3 schema, check if the "servers" have any relative paths and
        // fix them if the content was pulled from a web resource
        util.fixOasRelativeServers(schema, args.path);
      }

      // Looks good!
      return maybe(args.callback, Promise.resolve(schema));
    } catch (err) {
      return maybe(args.callback, Promise.reject(err));
    }
  }

  /**
   * Parses, dereferences, and validates the given Swagger API.
   * Depending on the options, validation can include JSON Schema validation and/or Swagger Spec validation.
   *
   * @param {string} [path] - The file path or URL of the JSON schema
   * @param {object} [api] - The Swagger API object. This object will be used instead of reading from `path`.
   * @param {SwaggerParserOptions} [options] - SwaggerParserOptions that determine how the API is parsed, dereferenced, and validated
   * @param {Function} [callback] - An error-first callback. The second parameter is the parsed API object.
   * @returns {Promise} - The returned promise resolves with the parsed API object.
   */
  public validate(api: SwaggerParserSchema, callback: ApiCallback): void;
  public validate(api: SwaggerParserSchema, options: SwaggerParserOptions, callback: ApiCallback): void;
  public validate(
    baseUrl: string,
    api: SwaggerParserSchema,
    options: SwaggerParserOptions,
    callback: ApiCallback,
  ): void;
  public validate(api: SwaggerParserSchema): Promise<OpenAPI.Document>;
  public validate(api: SwaggerParserSchema, options: SwaggerParserOptions): Promise<OpenAPI.Document>;
  public validate(baseUrl: string, api: SwaggerParserSchema, options: SwaggerParserOptions): Promise<OpenAPI.Document>;
  async validate() {
    const args = normalizeArgs(arguments);
    args.options = getSwaggerParserOptions(args.options);

    // ZSchema doesn't support circular objects, so don't dereference circular $refs yet
    // (see https://github.com/zaggino/z-schema/issues/137)
    const circular$RefOption = args.options.dereference.circular;
    args.options.validate.schema && (args.options.dereference.circular = "ignore");

    try {
      await this.dereference(args.path, args.schema, args.options);

      // Restore the original options, now that we're done dereferencing
      args.options.dereference.circular = circular$RefOption;

      if (args.options.validate.schema) {
        // Validate the API against the Swagger schema
        // NOTE: This is safe to do, because we haven't dereferenced circular $refs yet
        validateSchema(this.api!);

        if (this.$refs?.circular) {
          if (circular$RefOption === true) {
            // The API has circular references,
            // so we need to do a second-pass to fully-dereference it
            _dereference(this, args.options);
          } else if (circular$RefOption === false) {
            // The API has circular references, and they're not allowed, so throw an error
            throw ono.reference("The API contains circular references");
          }
        }
      }

      if (args.options.validate.spec) {
        // Validate the API against the Swagger spec
        validateSpec(this.api!);
      }

      return maybe(args.callback, Promise.resolve(this.schema));
    } catch (err) {
      return maybe(args.callback, Promise.reject(err));
    }
  }

  public static validate(schema: SwaggerParserSchema): Promise<OpenAPI.Document>;
  public static validate(schema: SwaggerParserSchema, callback: ApiCallback): Promise<void>;
  public static validate(schema: SwaggerParserSchema, options: SwaggerParserOptions): Promise<OpenAPI.Document>;
  public static validate(
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
    callback: ApiCallback,
  ): Promise<void>;
  public static validate(
    baseUrl: string,
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
  ): Promise<OpenAPI.Document>;
  public static validate(
    baseUrl: string,
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
    callback: ApiCallback,
  ): Promise<void>;
  static validate(): Promise<OpenAPI.Document> | Promise<void> {
    const instance = new SwaggerParser();
    return instance.validate.apply(instance, arguments as any);
  }
}

export const parse = SwaggerParser.parse;
export const resolve = SwaggerParser.resolve;
export const bundle = SwaggerParser.bundle;
export const dereference = SwaggerParser.dereference;
export const validate = SwaggerParser.validate;

export type ApiCallback = (err: Error | null, api?: OpenAPI.Document) => any;
export type $RefsCallback = (err: Error | null, $refs?: $Refs) => any;

// this isn't a great name for this type, but it's the same as the one in the original code, so I'm keeping it for now
export type ParserOptions = Plugin;

export { SwaggerParserOptions, FileInfo, Plugin, HTTPResolverOptions };
export type SwaggerParserSchema = OpenAPI.Document | string;
export default SwaggerParser;
