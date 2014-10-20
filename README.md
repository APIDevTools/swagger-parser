Swagger-Parser
============================
#### Parses a Swagger spec (in JSON or YAML format), validates it against the Swagger schema, and dereferences all $ref pointers


Supported Swagger Versions
--------------------------
* [2.0](http://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)


Basic Example
--------------------------
````javascript
var parser = require("swagger-parser");

// Parse a JSON or YAML Swagger spec
parser.parse("path/to/my/swagger.yaml", function(err, swaggerObject) {
  // This callback will be invoked once the Swagger spec is parsed, validated, and dereferenced.
  if (err) {
    console.error("Swagger Spec could not be parsed because: " + err.message);
    return;
  }

  // If there's no error, then `swaggerObject` is a reference to the parsed SwaggerObject
  // (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-)
  console.log(
    "Your API title is " + swaggerObject.info.title + ", version " + swaggerObject.info.version
  );
});

````


Installation and Use
--------------------------

    npm install swagger-parser

And then use  `var parser = require("swagger-parser")` in your Node script.


Options
--------------------------
The `parse` function accepts an optional `options` parameter, like this:
````javascript
var options = { dereferencePointers: false, validateSpec: false };
parser.parse("path/to/my/swagger.yaml", options, function(err, swaggerObject) {
  ...
});
````
Available options are as follows:

* __parseYaml__ (default: true) - 
Determines whether the parser will allow Swagger specs in YAML format.  If set to `false`, then only JSON will be allowed. 

* __dereferencePointers__ (default: true) - 
Determines whether `$ref` pointers will be dereferenced.  If set to `false`, then the resulting SwaggerObject will contain [ReferenceObjects](see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) instead of the objects they reference.

* __dereferenceExternalPointers__ (default: true) - 
Determines whether `$ref` pointers will be dereferenced if they point to external files (e.g. "http://company.com/my/schema.json").  If set to `false` then the resulting SwaggerObject will contain [ReferenceObjects](see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-) for external pointers instead of the objects they reference.

* __validateSpec__ (default: true) - 
Determines whether the Swagger spec will be validated against the Swagger schema.  If set to `false`, then the resulting SwaggerObject may be missing properties, have properties of the wrong data type, etc.
 

Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-parser/pulls).  Use JSHint to make sure your code passes muster.  (see [.jshintrc](.jshintrc)).

Here are some things currently on the to-do list:

* __Unit tests__ - Especially surrounding `$ref` dereferencing logic

* __Browser Support__ - Some slight refactoring is needed to make Swagger-Parser work in web browsers.  All of the dependencies already work in the browser, and most of them are available as [Bower](http://bower.io) packages, so it won't be difficult at all.

* __Recursive $ref pointers__ - Recursive `$ref` pointers are __not__ currently supported, but I plan to add support for them.


License
--------------------------
Swagger-Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want. 
