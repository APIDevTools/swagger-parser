/* eslint-disable no-unused-vars */
import validateSchema from "./validators/schema";
import validateSpec from "./validators/spec";
import * as util from "./util";
import type { ParserOptionsStrict } from "./options";
import { getSwaggerParserOptions, SwaggerParserOptions } from "./options";
import maybe from "@apidevtools/json-schema-ref-parser/lib/util/maybe";
import { ono } from "@jsdevtools/ono";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import _dereference from "@apidevtools/json-schema-ref-parser/lib/dereference";
import { normalizeArgs } from "@apidevtools/json-schema-ref-parser/lib/normalize-args";
import type { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type $Refs from "@apidevtools/json-schema-ref-parser/dist/lib/refs";
import type { FileInfo, Plugin, HTTPResolverOptions } from "@apidevtools/json-schema-ref-parser/dist/lib/types";
import { ResolverOptions, type SchemaCallback } from "@apidevtools/json-schema-ref-parser/lib/types";

const isSwaggerSchema = (schema: any): schema is OpenAPI.Document => {
  return "swagger" in schema || "openapi" in schema;
};

const isOpenApiSchema = (schema: any): schema is OpenAPIV3.Document | OpenAPIV3_1.Document => {
  return "openapi" in schema && schema.openapi !== undefined;
};

export type SwaggerParserSchema = OpenAPI.Document | string;
export type Document<T extends object = NonNullable<unknown>> =
  | OpenAPIV2.Document<T>
  | OpenAPIV3.Document<T>
  | OpenAPIV3_1.Document<T>;
export type OpenAPIV2Doc<T extends object = NonNullable<unknown>> = OpenAPIV2.Document<T>;
export type OpenAPIV3Doc<T extends object = NonNullable<unknown>> = OpenAPIV3.Document<T>;
export type OpenAPIV31Doc<T extends object = NonNullable<unknown>> = OpenAPIV3_1.Document<T>;
/**
 * This class parses a Swagger 2.0 or 3.0 API, resolves its JSON references and their resolved values,
 * and provides methods for traversing, dereferencing, and validating the API.
 *
 * @class
 * @augments $RefParser
 */
export class SwaggerParser<S extends Document = Document> extends $RefParser<S, SwaggerParserOptions> {
  /**
   * The `api` property is the parsed/bundled/dereferenced OpenAPI definition. This is the same value that is passed to the callback function (or Promise) when calling the parse, bundle, or dereference methods.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#api
   */
  public api: S | null = null;

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
  public override parse(api: S | string): Promise<S>;
  public override parse(api: S | string, callback: SchemaCallback): Promise<void>;
  public override parse(api: S | string, options: SwaggerParserOptions, callback: SchemaCallback<S>): Promise<void>;
  public override parse(
    baseUrl: string,
    api: S | string,
    options: SwaggerParserOptions,
    callback: SchemaCallback<S>,
  ): Promise<void>;
  public override parse(api: S | string, options: SwaggerParserOptions): Promise<S>;
  public override parse(baseUrl: string, api: S | string, options: SwaggerParserOptions): Promise<S>;
  override async parse() {
    const args = normalizeArgs<S>(arguments);
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
    } catch (err: any) {
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
  public validate(api: S | string, callback: SchemaCallback<S>): Promise<void>;
  public validate(api: S | string, options: SwaggerParserOptions, callback: SchemaCallback<S>): Promise<void>;
  public validate(
    baseUrl: string,
    api: S | string,
    options: SwaggerParserOptions,
    callback: SchemaCallback<S>,
  ): Promise<void>;
  public validate(api: S | string): Promise<S>;
  public validate(api: S | string, options: SwaggerParserOptions): Promise<S>;
  public validate(baseUrl: string, api: S | string, options: SwaggerParserOptions): Promise<S>;
  async validate() {
    const args = normalizeArgs<S, ParserOptionsStrict>(arguments);
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
            _dereference<S>(this, args.options);
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
    } catch (err: any) {
      return maybe(args.callback, Promise.reject(err));
    }
  }

  public static validate<S extends Document = Document>(schema: SwaggerParserSchema): Promise<S>;
  public static validate<S extends Document = Document>(
    schema: SwaggerParserSchema,
    callback: SchemaCallback<S>,
  ): Promise<void>;
  public static validate<S extends Document = Document>(
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
  ): Promise<S>;
  public static validate<S extends Document = Document>(
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
    callback: SchemaCallback<S>,
  ): Promise<void>;
  public static validate<S extends Document = Document>(
    baseUrl: string,
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
  ): Promise<S>;
  public static validate<S extends Document = Document>(
    baseUrl: string,
    schema: SwaggerParserSchema,
    options: SwaggerParserOptions,
    callback: SchemaCallback<S>,
  ): Promise<void>;
  static validate<S extends Document = Document>(): Promise<S> | Promise<void> {
    const instance = new SwaggerParser<S>();
    return instance.validate.apply(instance, arguments as any);
  }
}

export const parse = SwaggerParser.parse;
export const resolve = SwaggerParser.resolve;
export const bundle = SwaggerParser.bundle;
export const dereference = SwaggerParser.dereference;
export const validate = SwaggerParser.validate;

export type $RefsCallback = (err: Error | null, $refs?: $Refs) => any;

// this isn't a great name for this type, but it's the same as the one in the original code, so I'm keeping it for now
export type ParserOptions = Plugin;
export type Options = SwaggerParserOptions;
export type ApiCallback<S extends Document = Document> = SchemaCallback<S>;

export { SwaggerParserOptions, ResolverOptions, FileInfo, Plugin, HTTPResolverOptions };

export default SwaggerParser;
