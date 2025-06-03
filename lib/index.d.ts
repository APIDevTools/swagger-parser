import type { OpenAPI } from "openapi-types";
import type {
  HTTPResolverOptions,
  ResolverOptions,
  ParserOptions,
  FileInfo,
  $Refs,
} from "@apidevtools/json-schema-ref-parser";
export = SwaggerParser;

/**
 * This is the default export of Swagger Parser. You can creates instances of this class using new SwaggerParser(), or you can just call its static methods.
 *
 * See https://apitools.dev/swagger-parser/docs/swagger-parser.html
 */
declare class SwaggerParser {
  /**
   * The `api` property is the parsed/bundled/dereferenced OpenAPI definition. This is the same value that is passed to the callback function (or Promise) when calling the parse, bundle, or dereference methods.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#api
   */
  public api: OpenAPI.Document;

  /**
   * The $refs property is a `$Refs` object, which lets you access all of the externally-referenced files in the OpenAPI definition, as well as easily get and set specific values in the OpenAPI definition using JSON pointers.
   *
   * This is the same value that is passed to the callback function (or Promise) when calling the `resolve` method.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#refs
   */
  public $refs: $Refs;

  /**
   * Parses, dereferences, and validates the given Swagger API.
   * Depending on the options, validation can include JSON Schema validation and/or Swagger Spec validation.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#validateapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the dereferenced OpenAPI definition
   */
  public validate(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public validate(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public validate(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public validate(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public validate(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public validate(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * Parses, dereferences, and validates the given Swagger API.
   * Depending on the options, validation can include JSON Schema validation and/or Swagger Spec validation.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#validateapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the dereferenced OpenAPI definition
   */
  public static validate(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public static validate(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static validate(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static validate(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public static validate(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public static validate(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * Dereferences all `$ref` pointers in the OpenAPI definition, replacing each reference with its resolved value. This results in an API definition that does not contain any `$ref` pointers. Instead, it's a normal JavaScript object tree that can easily be crawled and used just like any other JavaScript object. This is great for programmatic usage, especially when using tools that don't understand JSON references.
   *
   * The dereference method maintains object reference equality, meaning that all `$ref` pointers that point to the same object will be replaced with references to the same object. Again, this is great for programmatic usage, but it does introduce the risk of circular references, so be careful if you intend to serialize the API definition using `JSON.stringify()`. Consider using the bundle method instead, which does not create circular references.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the dereferenced OpenAPI definition
   */
  public dereference(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public dereference(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public dereference(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public dereference(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public dereference(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public dereference(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * Dereferences all `$ref` pointers in the OpenAPI definition, replacing each reference with its resolved value. This results in an API definition that does not contain any `$ref` pointers. Instead, it's a normal JavaScript object tree that can easily be crawled and used just like any other JavaScript object. This is great for programmatic usage, especially when using tools that don't understand JSON references.
   *
   * The dereference method maintains object reference equality, meaning that all `$ref` pointers that point to the same object will be replaced with references to the same object. Again, this is great for programmatic usage, but it does introduce the risk of circular references, so be careful if you intend to serialize the API definition using `JSON.stringify()`. Consider using the bundle method instead, which does not create circular references.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the dereferenced OpenAPI definition
   */
  public static dereference(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public static dereference(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static dereference(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static dereference(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public static dereference(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public static dereference(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * Bundles all referenced files/URLs into a single API definition that only has internal `$ref` pointers. This lets you split-up your API definition however you want while you're building it, but easily combine all those files together when it's time to package or distribute the API definition to other people. The resulting API definition size will be small, since it will still contain internal JSON references rather than being fully-dereferenced.
   *
   * This also eliminates the risk of circular references, so the API definition can be safely serialized using `JSON.stringify()`.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#bundleapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the bundled API definition object
   */
  public bundle(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public bundle(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public bundle(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public bundle(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public bundle(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public bundle(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * Bundles all referenced files/URLs into a single API definition that only has internal `$ref` pointers. This lets you split-up your API definition however you want while you're building it, but easily combine all those files together when it's time to package or distribute the API definition to other people. The resulting API definition size will be small, since it will still contain internal JSON references rather than being fully-dereferenced.
   *
   * This also eliminates the risk of circular references, so the API definition can be safely serialized using `JSON.stringify()`.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#bundleapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the bundled API definition object
   */
  public static bundle(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public static bundle(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static bundle(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static bundle(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public static bundle(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public static bundle(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * *This method is used internally by other methods, such as `bundle` and `dereference`. You probably won't need to call this method yourself.*
   *
   * Parses the given OpenAPI definition file (in JSON or YAML format), and returns it as a JavaScript object. This method `does not` resolve `$ref` pointers or dereference anything. It simply parses one file and returns it.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#parseapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. The path can be absolute or relative. In Node, the path is relative to `process.cwd()`. In the browser, it's relative to the URL of the page.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the parsed OpenAPI definition object, or an error
   */
  public parse(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public parse(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public parse(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public parse(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public parse(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public parse(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * *This method is used internally by other methods, such as `bundle` and `dereference`. You probably won't need to call this method yourself.*
   *
   * Parses the given OpenAPI definition file (in JSON or YAML format), and returns it as a JavaScript object. This method `does not` resolve `$ref` pointers or dereference anything. It simply parses one file and returns it.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#parseapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. The path can be absolute or relative. In Node, the path is relative to `process.cwd()`. In the browser, it's relative to the URL of the page.
   * @param options (optional)
   * @param callback (optional) A callback that will receive the parsed OpenAPI definition object, or an error
   */
  public static parse(api: string | OpenAPI.Document, callback: SwaggerParser.ApiCallback): void;
  public static parse(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static parse(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.ApiCallback,
  ): void;
  public static parse(api: string | OpenAPI.Document): Promise<OpenAPI.Document>;
  public static parse(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<OpenAPI.Document>;
  public static parse(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<OpenAPI.Document>;

  /**
   * *This method is used internally by other methods, such as `bundle` and `dereference`. You probably won't need to call this method yourself.*
   *
   * Resolves all JSON references (`$ref` pointers) in the given OpenAPI definition file. If it references any other files/URLs, then they will be downloaded and resolved as well. This method **does not** dereference anything. It simply gives you a `$Refs` object, which is a map of all the resolved references and their values.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#resolveapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive a `$Refs` object
   */
  public resolve(api: string | OpenAPI.Document, callback: SwaggerParser.$RefsCallback): void;
  public resolve(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.$RefsCallback,
  ): void;
  public resolve(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.$RefsCallback,
  ): void;
  public resolve(api: string | OpenAPI.Document): Promise<$Refs>;
  public resolve(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<$Refs>;
  public resolve(baseUrl: string, api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<$Refs>;

  /**
   * *This method is used internally by other methods, such as `bundle` and `dereference`. You probably won't need to call this method yourself.*
   *
   * Resolves all JSON references (`$ref` pointers) in the given OpenAPI definition file. If it references any other files/URLs, then they will be downloaded and resolved as well. This method **does not** dereference anything. It simply gives you a `$Refs` object, which is a map of all the resolved references and their values.
   *
   * See https://apitools.dev/swagger-parser/docs/swagger-parser.html#resolveapi-options-callback
   *
   * @param api An OpenAPI definition, or the file path or URL of an OpenAPI definition. See the `parse` method for more info.
   * @param options (optional)
   * @param callback (optional) A callback that will receive a `$Refs` object
   */
  public static resolve(api: string | OpenAPI.Document, callback: SwaggerParser.$RefsCallback): void;
  public static resolve(
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.$RefsCallback,
  ): void;
  public static resolve(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
    callback: SwaggerParser.$RefsCallback,
  ): void;
  public static resolve(api: string | OpenAPI.Document): Promise<$Refs>;
  public static resolve(api: string | OpenAPI.Document, options: SwaggerParser.Options): Promise<$Refs>;
  public static resolve(
    baseUrl: string,
    api: string | OpenAPI.Document,
    options: SwaggerParser.Options,
  ): Promise<$Refs>;
}

declare namespace SwaggerParser {
  export type ApiCallback = (err: Error | null, api?: OpenAPI.Document) => any;
  export type $RefsCallback = (err: Error | null, $refs?: $Refs) => any;

  /**
   * See https://apitools.dev/swagger-parser/docs/options.html
   */
  export interface Options extends Partial<ParserOptions> {
    /**
     * The `validate` options control how Swagger Parser will validate the API.
     */
    validate?: {
      /**
       * If set to `false`, then validating against the Swagger 2.0 Schema or OpenAPI 3.0 Schema is disabled.
       */
      schema?: boolean;

      /**
       * If set to `false`, then validating against the Swagger 2.0 Specification is disabled.
       */
      spec?: boolean;
    };
  }

  export { HTTPResolverOptions, ResolverOptions, ParserOptions, FileInfo };
}
