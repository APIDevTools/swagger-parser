import * as assert from "assert";
import { OpenAPI } from "openapi-types";
import * as SwaggerParser from "../../lib";

const baseUrl = "http://example.com/api";
const openapiPath = "my-api.json";
const options = {};
const promiseResolve = (_: object) => undefined;
const promiseReject = (_: Error) => undefined;
const callback = (_err: Error | null, _api?: object) => undefined;
const openapiObject: OpenAPI.Document = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
  paths: {}
};


// SwaggerParser class instance
let parser = new SwaggerParser();


// SwaggerParser instance properties
assert(parser.$refs.circular === true);
assert(parser.api.info.title === "My API");


// SwaggerParser instance methods (with callbacks)
parser.bundle(openapiPath, callback);
parser.bundle(openapiObject, callback);
parser.bundle(openapiPath, options, callback);
parser.bundle(openapiObject, options, callback);
parser.bundle(baseUrl, openapiPath, options, callback);
parser.bundle(baseUrl, openapiObject, options, callback);

parser.dereference(openapiPath, callback);
parser.dereference(openapiObject, callback);
parser.dereference(openapiPath, options, callback);
parser.dereference(openapiObject, options, callback);
parser.dereference(baseUrl, openapiPath, options, callback);
parser.dereference(baseUrl, openapiObject, options, callback);

parser.validate(openapiPath, callback);
parser.validate(openapiObject, callback);
parser.validate(openapiPath, options, callback);
parser.validate(openapiObject, options, callback);
parser.validate(baseUrl, openapiPath, options, callback);
parser.validate(baseUrl, openapiObject, options, callback);

parser.parse(openapiPath, callback);
parser.parse(openapiObject, callback);
parser.parse(openapiPath, options, callback);
parser.parse(openapiObject, options, callback);
parser.parse(baseUrl, openapiPath, options, callback);
parser.parse(baseUrl, openapiObject, options, callback);

parser.resolve(openapiPath, callback);
parser.resolve(openapiObject, callback);
parser.resolve(openapiPath, options, callback);
parser.resolve(openapiObject, options, callback);
parser.resolve(baseUrl, openapiPath, options, callback);
parser.resolve(baseUrl, openapiObject, options, callback);


// SwaggerParser instance methods (with Promises)
parser.bundle(openapiPath).then(promiseResolve, promiseReject);
parser.bundle(openapiObject).then(promiseResolve, promiseReject);
parser.bundle(openapiPath, options).then(promiseResolve, promiseReject);
parser.bundle(openapiObject, options).then(promiseResolve, promiseReject);
parser.bundle(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
parser.bundle(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

parser.dereference(openapiPath).then(promiseResolve, promiseReject);
parser.dereference(openapiObject).then(promiseResolve, promiseReject);
parser.dereference(openapiPath, options).then(promiseResolve, promiseReject);
parser.dereference(openapiObject, options).then(promiseResolve, promiseReject);
parser.dereference(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
parser.dereference(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

parser.validate(openapiPath).then(promiseResolve, promiseReject);
parser.validate(openapiObject).then(promiseResolve, promiseReject);
parser.validate(openapiPath, options).then(promiseResolve, promiseReject);
parser.validate(openapiObject, options).then(promiseResolve, promiseReject);
parser.validate(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
parser.validate(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

parser.parse(openapiPath).then(promiseResolve, promiseReject);
parser.parse(openapiObject).then(promiseResolve, promiseReject);
parser.parse(openapiPath, options).then(promiseResolve, promiseReject);
parser.parse(openapiObject, options).then(promiseResolve, promiseReject);
parser.parse(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
parser.parse(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

parser.resolve(openapiPath).then(promiseResolve, promiseReject);
parser.resolve(openapiObject).then(promiseResolve, promiseReject);
parser.resolve(openapiPath, options).then(promiseResolve, promiseReject);
parser.resolve(openapiObject, options).then(promiseResolve, promiseReject);
parser.resolve(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
parser.resolve(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);


// SwaggerParser static methods (with callbacks)
SwaggerParser.bundle(openapiPath, callback);
SwaggerParser.bundle(openapiObject, callback);
SwaggerParser.bundle(openapiPath, options, callback);
SwaggerParser.bundle(openapiObject, options, callback);
SwaggerParser.bundle(baseUrl, openapiPath, options, callback);
SwaggerParser.bundle(baseUrl, openapiObject, options, callback);

SwaggerParser.dereference(openapiPath, callback);
SwaggerParser.dereference(openapiObject, callback);
SwaggerParser.dereference(openapiPath, options, callback);
SwaggerParser.dereference(openapiObject, options, callback);
SwaggerParser.dereference(baseUrl, openapiPath, options, callback);
SwaggerParser.dereference(baseUrl, openapiObject, options, callback);

SwaggerParser.validate(openapiPath, callback);
SwaggerParser.validate(openapiObject, callback);
SwaggerParser.validate(openapiPath, options, callback);
SwaggerParser.validate(openapiObject, options, callback);
SwaggerParser.validate(baseUrl, openapiPath, options, callback);
SwaggerParser.validate(baseUrl, openapiObject, options, callback);

SwaggerParser.parse(openapiPath, callback);
SwaggerParser.parse(openapiObject, callback);
SwaggerParser.parse(openapiPath, options, callback);
SwaggerParser.parse(openapiObject, options, callback);
SwaggerParser.parse(baseUrl, openapiPath, options, callback);
SwaggerParser.parse(baseUrl, openapiObject, options, callback);

SwaggerParser.resolve(openapiPath, callback);
SwaggerParser.resolve(openapiObject, callback);
SwaggerParser.resolve(openapiPath, options, callback);
SwaggerParser.resolve(openapiObject, options, callback);
SwaggerParser.resolve(baseUrl, openapiPath, options, callback);
SwaggerParser.resolve(baseUrl, openapiObject, options, callback);


// SwaggerParser static methods (with Promises)
SwaggerParser.bundle(openapiPath).then(promiseResolve, promiseReject);
SwaggerParser.bundle(openapiObject).then(promiseResolve, promiseReject);
SwaggerParser.bundle(openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.bundle(openapiObject, options).then(promiseResolve, promiseReject);
SwaggerParser.bundle(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.bundle(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

SwaggerParser.dereference(openapiPath).then(promiseResolve, promiseReject);
SwaggerParser.dereference(openapiObject).then(promiseResolve, promiseReject);
SwaggerParser.dereference(openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.dereference(openapiObject, options).then(promiseResolve, promiseReject);
SwaggerParser.dereference(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.dereference(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

SwaggerParser.validate(openapiPath).then(promiseResolve, promiseReject);
SwaggerParser.validate(openapiObject).then(promiseResolve, promiseReject);
SwaggerParser.validate(openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.validate(openapiObject, options).then(promiseResolve, promiseReject);
SwaggerParser.validate(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.validate(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

SwaggerParser.parse(openapiPath).then(promiseResolve, promiseReject);
SwaggerParser.parse(openapiObject).then(promiseResolve, promiseReject);
SwaggerParser.parse(openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.parse(openapiObject, options).then(promiseResolve, promiseReject);
SwaggerParser.parse(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.parse(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);

SwaggerParser.resolve(openapiPath).then(promiseResolve, promiseReject);
SwaggerParser.resolve(openapiObject).then(promiseResolve, promiseReject);
SwaggerParser.resolve(openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.resolve(openapiObject, options).then(promiseResolve, promiseReject);
SwaggerParser.resolve(baseUrl, openapiPath, options).then(promiseResolve, promiseReject);
SwaggerParser.resolve(baseUrl, openapiObject, options).then(promiseResolve, promiseReject);
