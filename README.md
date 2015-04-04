Swagger-Parser
============================
#### Parses, validates, and dereferences JSON/YAML Swagger specs in Node and browsers

[![Build Status](https://img.shields.io/travis/BigstickCarpet/swagger-parser.svg)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://img.shields.io/david/bigstickcarpet/swagger-parser.svg)](https://david-dm.org/bigstickcarpet/swagger-parser)
[![Code Climate Score](https://img.shields.io/codeclimate/github/BigstickCarpet/swagger-parser.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](http://img.shields.io/codacy/6d686f916836433b9c013379fbe1052c.svg)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Coverage Status](https://img.shields.io/coveralls/BigstickCarpet/swagger-parser.svg)](https://coveralls.io/r/BigstickCarpet/swagger-parser)

[![Downloads](https://img.shields.io/npm/dm/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](#bower)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

Features
--------------------------
* Parses Swagger specs in __JSON or YAML__ format
* __Validates__ against the [official Swagger 2.0 schema](http://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)
* Dereferences all __$ref__ pointers, including pointers to __external files and URLs__
* Asynchronously downloads and __caches__ external files and URLs
* __Tested__ in Node.js and all major web browsers on Windows, Mac, and Linux
* Tested on [over 100 Google APIs](https://github.com/APIs-guru/api-models/tree/master/google)
* Supports nested $ref pointers, even in external files and URLs
* Supports circular $ref pointers (see [notes](#circular-refs) below)
* Multiple $ref pointers to the same object are resolved to the [same object instance](https://github.com/BigstickCarpet/swagger-parser/blob/c5c2f0033af992fa11f0f41ded3567ce7e9517a2/tests/specs/dereference-spec.js#L124)
* [Try it out online](http://bigstickcarpet.github.io/swagger-parser/)


Basic Example
--------------------------
````javascript
swagger.parser.parse("swagger.yaml", function(err, api, metadata) {
  if (!err) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  }
});
````
The `api` parameter that's passed to the callback function is the parsed, validated, and dereferenced [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object).


Installation and Use
--------------------------
#### Node
````bash
npm install swagger-parser
````

Then add this to your Node script:

````javascript
var parser = require("swagger-parser");
parser.parse('swagger.yaml', function(err, api, metadata) { ... });
````

#### Bower
````bash
bower install swagger-parser
````

Then add this to your HTML page:

````html
<script src="bower_components/swagger-parser/dist/swagger-parser.js"></script>
<script>
    swagger.parser.parse('http://mysite.com/swagger.yaml', function(err, api, metadata) { ... });
</script>
````

#### AMD (Require.js)
Just add `swagger-parser` to your AMD module's dependencies, or `require("swagger-parser")` explicitly.

````javascript
define("myModule", ["swagger-parser"], function(parser) {
    parser.parse('http://mysite.com/swagger.yaml', function(err, api, metadata) { ... });
});
````


The API
--------------------------
### `Parser.parse(swaggerPath, [options], callback)`

* __swagger__ (_required_) - `string` or `object`<br>
The file path or URL of your Swagger file.  Relative paths are allowed.  In Node, the path is relative to `process.cwd()`.  In the browser, it's relative to the URL of the page.
<br><br>
If you pass an object instead of a string, then the parsing step will be skipped, but the object will still be validated, resolved, and dereferenced just like normal.

* __options__ (_optional_) - `object`<br>
An object containing one or more parsing options. See [options](#options) below.

* __callback__ (_required_) - `function(err, api, metadata)`<br>
Called after the parsing is finished, or when an error occurs.  See [callback](#callback) below for details.

#### Options
|Property               |Type        |Default       |Description
|:----------------------|:-----------|:-------------|:----------
|`parseYaml`            |bool        |true          |Determines whether the parser will allow Swagger specs in YAML format.  If set to `false`, then only JSON will be allowed. 
|`dereference$Refs`     |bool        |true          |Determines whether `$ref` pointers in the Swagger API will be replaced with their resolved values.  Different `$ref` pointers that resolve to the same object will be replaced with [the same object instance](https://github.com/BigstickCarpet/swagger-parser/blob/c5c2f0033af992fa11f0f41ded3567ce7e9517a2/tests/specs/dereference-spec.js#L124).  Setting this option to `false` will leave the `$ref` pointers in the Swagger API, but you can still access the resolved values using the [metadata object](#metadata).
|`resolve$Refs`         |bool        |true          |Determines whether `$ref` pointers will be resolved.  Setting this option to `false` effectively disables `dereference$Refs` as well. The difference is that the [metadata object](#metadata) won't be populated either.
|`resolveExternal$Refs` |bool        |true          |Determines whether `$ref` pointers will be resolved if they point to external files or URLs.  Internal `$ref` pointers will still be resolved and dereferenced.
|`validateSchema`       |bool        |true          |Determines whether your API will be validated against the official Swagger schema.  If set to `false`, then the resulting [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object) may be missing properties, have properties of the wrong data type, etc.
|`strictValidation`     |bool        |true          |Determines whether to perform strict validation, which enforces parts of the Swagger Spec that aren't enforced by the JSON schema.  For example, duplicate parameters, invalid parameter types, etc.

#### Callback
|Parameter  |Type                |Description
|:----------|:-------------------|:----------
|`err`      |Error               |`null` unless an error occurred.
|`api`      |[Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object) |The complete Swagger API object. Or `null` if an error occurred
|`metadata` |object              |This parameter provides extra information about the parsing operation. It is always provided, even if there's an error.

#### Metadata
The `metadata` parameter is an object with the following properties:

|Property   |Type                |Description
|:----------|:-------------------|:----------
|`baseDir`  |string              |The base directory used to resolve any external $ref pointers.  If you passed a file path/URL to the `parse` method, then the `baseDir` is the directory of that file.  If you passed an object, then `baseDir` is set to `process.cwd()` in Node, or the URL of the current page in browsers.
|`files`    |array of strings    |The full paths of all files that were parsed. This only includes local files, _not_ URLs.  If `Parser.parse()` was called with a local file path, then it will be the first item in this array.
|`urls`     |array of [URL objects](http://nodejs.org/api/url.html#url_url)|The URLs that were parsed.  If `Parser.parse()` was called with a URL, then it will be the first item in this array.
|`$refs`    |object              |A map of all the $ref pointers that were resolved, and the objects they resolved to.  If an error occurs while resolving a reference, then this object will still contain the $refs that were successfully parsed up to that point.


Circular $Refs
--------------------------
Swagger files can contain [circular $ref pointers](https://github.com/BigstickCarpet/swagger-parser/blob/master/tests/files/circular-refs.yaml), and Swagger-Parser will correctly parse them, resolve their values, and validate them against the Swagger schema.  However, Swagger-Parser __does not dereference__ circular references because this can easily cause stack overflows when the Swagger object is serialized, as well as other, more subtle bugs.

If your Swagger API includes circular references, then the callback will receive a `ReferenceError` to alert you that the Swagger object was not fully dereferenced. However, you can choose to ignore this error and use the `api` parameter anyway. All non-circular `$ref` pointers in the Swagger object will still be resolved and dereferenced like always.  Circular `$ref` pointers will not be dereferenced, but they _will_ be resolved, so you can access their resolved values in [`metadata.$refs`](#metadata).

````yaml
person:
  properties:
    name:
      type: string
    spouse:
      type:
        $ref: person   # circular reference
````



Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-parser/pulls).  Use JSHint to make sure your code passes muster.  (see [.jshintrc](.jshintrc)).

License
--------------------------
Swagger-Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want. 
