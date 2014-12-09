Swagger-Parser
============================
#### Parses, validates, and dereferences your Swagger specs

[![Build Status](https://travis-ci.org/BigstickCarpet/swagger-parser.svg?branch=master)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://david-dm.org/bigstickcarpet/swagger-parser.svg)](https://david-dm.org/bigstickcarpet/swagger-parser)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/swagger-parser/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](http://img.shields.io/codacy/6d686f916836433b9c013379fbe1052c.svg)](https://www.codacy.com/public/jamesmessinger/swagger-parser)

[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](#node)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](#bower)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

Features
--------------------------
* Supports Swagger specs in __JSON or YAML__ format
* __Validates__ against the [official Swagger 2.0 schema](http://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)
* Dereferences all __$ref__ pointers, including pointers to external URLs
* Nested $ref pointers are supported, even in external URLs
* Multiple $ref pointers to the same definition are resolved to the same object instance, thus maintaining [strict reference equality](https://github.com/BigstickCarpet/swagger-parser/blob/29ebda3ca739574791ebc24913121d6d765ce24f/tests/specs/dereference-spec.js#L110)


Basic Example
--------------------------
````javascript
swagger.parser.parse("path/to/my/swagger.yaml", function(err, swagger) {
  if (err) {
    console.error("There's an error in the Swagger file: " + err.message);
    return;
  }

  console.log("Your API is " + swagger.info.title + ", version " + swagger.info.version);
});
````
The `swagger` parameter that is passed to the callback function is a fully-parsed, validated, and dereferenced [Swagger Object](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-).


Installation and Use
--------------------------
### Node
````bash
npm install swagger-parser
````
Then add this to your Node script:
````javascript
var parser = require("swagger-parser");
parser.parse('path/to/my/swagger.yaml', function(err, swagger) { ... });
````

### Bower
````bash
bower install swagger-parser
````
Then add this to your HTML page:
````html
<script src="bower_components/swagger-parser/dist/swagger-parser.js"></script>
<script>
    swagger.parser.parse('http://mysite.com/path/to/my/swagger.yaml', function(err, swagger) { ... });
</script>
````

### AMD (Require.js)
Just add `swagger-parser` to your AMD module's dependencies, or `require("swagger-parser")` explicitly.
````javascript
define("myModule", ["swagger-parser"], function(parser) {
    parser.parse('http://mysite.com/path/to/my/swagger.yaml', function(err, swagger) { ... });
});
````


Options
--------------------------
The `parse` function accepts an optional `options` parameter, like this:
````javascript
var options = { 
    dereferencePointers: false, 
    validateSpec: false 
};
parser.parse("path/to/my/swagger.yaml", options, function(err, swaggerObject) {
  ...
});
````
Available options are as follows:

* __parseYaml__ (default: true) - 
Determines whether the parser will allow Swagger specs in YAML format.  If set to `false`, then only JSON will be allowed. 

* __dereferencePointers__ (default: true) - 
Determines whether `$ref` pointers will be dereferenced.  If set to `false`, then the resulting SwaggerObject will contain [Reference Objects](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) instead of the objects they reference.

* __dereferenceExternalPointers__ (default: true) - 
Determines whether `$ref` pointers will be dereferenced if they point to external files (e.g. "http://company.com/my/schema.yaml").  If set to `false` then the resulting SwaggerObject will contain [Reference Objects](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) for external pointers instead of the objects they reference.

* __validateSpec__ (default: true) - 
Determines whether your Swagger spec will be validated against the official Swagger schema.  If set to `false`, then the resulting [Swagger Object](https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-) may be missing properties, have properties of the wrong data type, etc.
 

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
