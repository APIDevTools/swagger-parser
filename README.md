Swagger-Parser
============================
#### Parses, validates, and dereferences JSON/YAML Swagger specs in Node and browsers

[![Build Status](https://img.shields.io/travis/BigstickCarpet/swagger-parser.svg)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://david-dm.org/bigstickcarpet/swagger-parser.svg)](https://david-dm.org/bigstickcarpet/swagger-parser)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/swagger-parser/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](http://img.shields.io/codacy/6d686f916836433b9c013379fbe1052c.svg)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Coverage Status](https://img.shields.io/coveralls/BigstickCarpet/swagger-parser.svg)](https://coveralls.io/r/BigstickCarpet/swagger-parser)

[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](#bower)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

Features
--------------------------
* Supports Swagger specs in __JSON or YAML__ format
* __Validates__ against the [official Swagger 2.0 schema](http://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)
* Dereferences all __$ref__ pointers, including pointers to __external files and URLs__
* __Tested__ in Node.js and all major web browsers on Windows, Mac, and Linux
* Asynchronously downloads and __caches__ external files and URLs
* Nested $ref pointers are supported, even in external files and URLs
* Multiple $ref pointers to the same definition are resolved to the same object instance, thus maintaining [strict reference equality](https://github.com/BigstickCarpet/swagger-parser/blob/e1867cd9b14666a726264ba45641f2e4761edf61/tests/specs/dereference-spec.js#L127)


Basic Example
--------------------------
````javascript
swagger.parser.parse("swagger.yaml", function(err, api, metadata) {
  if (!err) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  }
});
````
The `api` parameter that's passed to the callback function is the parsed, validated, and dereferenced [Swagger Object](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-).


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
### `Parser.parse()`

This method can be called with two parameters (as shown above), or with three parameters, like this:

````javascript
var options = { 
    dereferencePointers: false, 
    validateSpec: false 
};
parser.parse("swagger.yaml", options, function(err, api, metadata) {
  ...
});
````
The three parameters are as follows:


### `swaggerFile` - string (_required_)
The file path or URL of the Swagger file.  Relative paths are allowed.  In Node, the path is relative to `process.cwd()`.  In the browser, it's relative to the URL of the page.

### `options` - object (_optional_)
An object containing one or more of the following properties:

* __parseYaml__ (default: true) - 
Determines whether the parser will allow Swagger specs in YAML format.  If set to `false`, then only JSON will be allowed. 

* __dereferencePointers__ (default: true) - 
Determines whether `$ref` pointers will be dereferenced.  If set to `false`, then the resulting SwaggerObject will contain [Reference Objects](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) instead of the objects they reference.

* __dereferenceExternalPointers__ (default: true) - 
Determines whether `$ref` pointers will be dereferenced if they point to external files (e.g. "http://company.com/my/schema.yaml").  If set to `false` then the resulting SwaggerObject will contain [Reference Objects](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) for external pointers instead of the objects they reference.

* __validateSpec__ (default: true) - 
Determines whether your Swagger spec will be validated against the official Swagger schema.  If set to `false`, then the resulting [Swagger Object](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-) may be missing properties, have properties of the wrong data type, etc.

### `callback` - function (_required_)
The callback function is called when the Swagger file and all referenced files have been downloaded, parsed, validated, and dereferenced.  

* __err__ (Error object) -
If an error occurred during parsing, then this will be the `Error` object; otherwise, this parameter will be `null`. You should always check the `err` parameter first, because the other parameters may be `undefined` if an error occurred.

* __api__ (Swagger object) -
If the file(s) were parsed successfully, then this object is the complete Swagger API object.   See the [official Swagger 2.0 specification](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object-) for details.

* __metadata__ (object) -
This object provides useful information about the parsing operation itself, namely:

    * __baseDir__ (string) - The directory of the main Swagger file, which is the base directory used to resolve any relative $ref pointers.
    
    * __files__ (array of strings) - The full paths of all files that were parsed. This only includes local files, _not_ URLs.  If The main Swagger file was local, then it will be the first item in this array.
    
    * __urls__ (array of objects) - The URLs that were parsed.  Each item in the array is a [URL object](http://nodejs.org/api/url.html#url_url), which lets you easily access the full URL, or specific parts of it.
    
    * __resolvedPointers__ (object) - A map of all the $ref pointers that were resolved, and the objects they resolved to. 


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-parser/pulls).  Use JSHint to make sure your code passes muster.  (see [.jshintrc](.jshintrc)).

Here are some things currently on the to-do list:

* __Recursive (circular) $ref pointers__ - Recursive (circular) `$ref` pointers are __not__ currently supported.  So something like this won't work:

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
