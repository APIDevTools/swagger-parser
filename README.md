Swagger-Parser
============================
#### Parses, validates, and dereferences JSON/YAML Swagger specs in Node and browsers

[![Build Status](https://img.shields.io/travis/BigstickCarpet/swagger-parser.svg)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://img.shields.io/david/bigstickcarpet/swagger-parser.svg)](https://david-dm.org/bigstickcarpet/swagger-parser)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/swagger-parser/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](http://img.shields.io/codacy/6d686f916836433b9c013379fbe1052c.svg)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Coverage Status](https://img.shields.io/coveralls/BigstickCarpet/swagger-parser.svg)](https://coveralls.io/r/BigstickCarpet/swagger-parser)

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
* Supports nested $ref pointers, even in external files and URLs
* Multiple $ref pointers to the same definition are resolved to the same object instance, thus maintaining [strict reference equality](https://github.com/BigstickCarpet/swagger-parser/blob/a525d5e6f3a2af1774d0bcc283cb59737f02bb1e/tests/specs/dereference-spec.js#L137)


Basic Example
--------------------------
````javascript
swagger.parser.parse("swagger.yaml", function(err, api, metadata) {
  if (!err) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  }
});
````
The `api` parameter that's passed to the callback function is the parsed, validated, and dereferenced [Swagger object](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-).


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

* __`swaggerPath`__ (_required_) - string<br>
The file path or URL of your Swagger file.  Relative paths are allowed.  In Node, the path is relative to `process.cwd()`.  In the browser, it's relative to the URL of the page.

* __`options`__ (_optional_) - object<br>
An object containing one or more parsing options. See [options](#options) below.

* __`callback`__ (_required_) - function(err, api, metadata)<br>
Called after the parsing is finished, or when an error occurs.  See [callback](#callback) below for details.

#### Options
|Property               |Type        |Default       |Description
|:----------------------|:-----------|:-------------|:----------
|`parseYaml`            |bool        |true          |Determines whether the parser will allow Swagger specs in YAML format.  If set to `false`, then only JSON will be allowed. 
|`resolve$Refs`         |bool        |true          |Determines whether `$ref` pointers will be resolved.  If set to `false`, then the resulting Swagger object will contain [Reference objects](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) instead of the objects they reference.
|`resolveExternal$Refs` |bool        |true          |Determines whether `$ref` pointers will be resolved if they point to external files or URLs.  If set to `false` then the resulting Swagger object will contain [Reference objects](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) for external pointers instead of the objects they reference.
|`validateSchema`        |bool       |true          |Determines whether your API will be validated against the official Swagger schema.  If set to `false`, then the resulting [Swagger object](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-) may be missing properties, have properties of the wrong data type, etc.

#### Callback
|Parameter  |Type                |Description
|:----------|:-------------------|:----------
|`err`      |Error               |`null` unless an error occurred.
|`api`      |[Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object-) |The complete Swagger API object. Or `undefined` if an error occurred
|`metadata`  |object             |This parameter can usually be ignored. It provides useful information about the parsing operation itself.

The `metadata` parameter is an object with the following properties:

|Property   |Type                |Description
|:----------|:-------------------|:----------
|`baseDir`  |string              |The directory of the main Swagger file, which is the base directory used to resolve any external $ref pointers.
|`files`    |array of strings    |The full paths of all files that were parsed. This only includes local files, _not_ URLs.  If `Parser.parse()` was called with a local file path, then it will be the first item in this array.
|`urls`     |array of [URL objects](http://nodejs.org/api/url.html#url_url)|The URLs that were parsed.  If `Parser.parse()` was called with a URL, then it will be the first item in this array.
|`$refs`    |object              |A map of all the $ref pointers that were resolved, and the objects they resolved to.


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-parser/pulls).  Use JSHint to make sure your code passes muster.  (see [.jshintrc](.jshintrc)).

Here are some things currently on the to-do list:

* __Circular $ref pointers__ - Circular `$ref` pointers are a bit of an edge case, but it would be nice to support them anyway.  Currently, something like this won't work:

````yaml
person:
  properties:
    name:
      type: string
    spouse:
      type:
        $ref: person
````


License
--------------------------
Swagger-Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want. 
