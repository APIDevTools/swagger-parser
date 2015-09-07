Swagger Parser
============================
#### Swagger 2.0 parser and validator for Node and browsers

[![Build Status](https://api.travis-ci.org/BigstickCarpet/swagger-parser.svg)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://david-dm.org/BigstickCarpet/swagger-parser.svg)](https://david-dm.org/BigstickCarpet/swagger-parser)
[![Coverage Status](https://coveralls.io/repos/BigstickCarpet/swagger-parser/badge.svg?branch=master&service=github)](https://coveralls.io/r/BigstickCarpet/swagger-parser)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/swagger-parser/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](https://www.codacy.com/project/badge/6d686f916836433b9c013379fbe1052c)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/swagger-parser.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/swagger-parser)

[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](#bower)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

[![Browser Compatibility](https://saucelabs.com/browser-matrix/swagger-parser.svg)](https://saucelabs.com/u/swagger-parser)


| **!!! ALPHA NOTICE !!!**
|-----------------------------------
|Swagger Parser 3.0 is in alpha.  It is fairly stable, but not fully tested yet, so you may find bugs.  Also, please be aware that the API might change slightly before final release.<br><br>To install the alpha, run `npm install swagger-parser@alpha`


Features
--------------------------
- Parses Swagger specs in **JSON** or **YAML** format
- [Validates](#validatepath-options-callback) against the [Swagger 2.0 schema](https://github.com/reverb/swagger-spec/blob/master/schemas/v2.0/schema.json) _and_ the [Swagger 2.0 spec](https://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)
- [Resolves](#resolvepath-options-callback) all `$ref` pointers, including external files and URLs
- Can [bundle](#bundlepath-options-callback) all your Swagger files into a single file that only has _internal_ `$ref` pointers
- Can [dereference](#dereferencepath-options-callback) all `$ref` pointers, giving you a normal JavaScript object that's easy to work with
- Configurable caching of external files and URLs
- [Tested](http://bigstickcarpet.github.io/swagger-parser/tests/index.html) in Node, IO.js, and all modern web browsers on Mac, Windows, Linux, iOS, and Android
- Tested on [over 100 Google APIs](https://github.com/APIs-guru/api-models/tree/master/googleapis.com)
- Supports [circular references](#circular-refs), nested references, back-references, and cross-references
- Maintains object reference equality &mdash `$ref` pointers to the same value always resolve to the same object instance


Example
--------------------------

```javascript
SwaggerParser.validate("my-api.yaml", function(err, api) {
  if (err) {
    console.error(err);
  }
  else {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  }
});
```

Or use [Promises syntax](http://javascriptplayground.com/blog/2015/02/promises/) instead. The following example is the same as above:

```javascript
SwaggerParser.validate("my-api.yaml")
  .then(function(api) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  })
  .catch(function(err) {
    console.error(err);
  });
```


Installation
--------------------------
#### Node
Install using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

```bash
npm install swagger-parser
```

Then require it in your code:

```javascript
var SwaggerParser = require('swagger-parser');
```

#### Web Browsers
Install using [bower](http://bower.io/):

```bash
bower install swagger-parser
```

Then reference [`swagger-parser.js`](dist/swagger-parser.js) or [`swagger-parser.min.js`](dist/swagger-parser.min.js) in your HTML:

```html
<script src="bower_components/swagger-parser/dist/swagger-parser.js"></script>
```

Or, if you're using AMD (Require.js), then import it into your module:

```javascript
define(["swagger-parser"], function(SwaggerParser) { /* your module's code */ })
```


the API
--------------------------
- Methods
    - [`parse()`](#parsepath-options-callback)
    - [`resolve()`](#resolvepath-options-callback)
    - [`bundle()`](#bundlepath-options-callback)
    - [`dereference()`](#dereferencepath-options-callback)
    - [`validate()`](#validatepath-options-callback)
- Objects
    - [`Options`](#options)
    - [`API`](#api-object)
    - [`$Refs`](#refs-object)
      - [`$Refs.paths()`](#refspathstypes)
      - [`$Refs.values()`](#refsvaluestypes)
      - [`$Refs.isExpired()`](#refsisexpiredref)
      - [`$Refs.expire()`](#refsexpireref)
      - [`$Refs.exists()`](#refsexistsref)
      - [`$Refs.get()`](#refsgetref-options)
      - [`$Refs.set()`](#refssetref-value-options)
    - [`YAML`](#yaml-object)
      - [`YAML.parse()`](#yamlparsetext)
      - [`YAML.stringify()`](#yamlstringifyvalue)
- [Class methods vs. Instance methods](#class-methods-vs-instance-methods)
- [Callbacks vs. Promises](#callbacks-vs-promises)


### `parse(path, [options], [callback])`

- **path** (_required_) - `string`<br>
The file path or URL of your Swagger API.  The path can be absolute or relative.  In Node, the path is relative to `process.cwd()`.  In the browser, it's relative to the URL of the page.
<br><br>
If you already have the Swagger API as a JavaScript object, then you can pass that instead of a file path.

- **options** (_optional_) - `object`<br>
See [options](#options) below.

- **callback** (_optional_) - `function(err, api)`<br>
A callback that will receive the parsed [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object), or an error.

- **Return Value:** `Promise`<br>
See [Callbacks vs. Promises](#callbacks-vs-promises) below.

Parses the given Swagger API (in JSON or YAML format), and returns it as a JavaScript object.  This method **does not** resolve `$ref` pointers or dereference anything.  It simply parses _one_ file and returns it.

```javascript
SwaggerParser.parse("my-api.yaml")
  .then(function(api) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  });
```


### `resolve(path, [options], [callback])`

- **path** (_required_) - `string` or `object`<br>
The file path or URL of your Swagger API.  See the [`parse`](#parsepath-options-callback) method for more info.

- **options** (_optional_) - `object`<br>
See [options](#options) below.

- **callback** (_optional_) - `function(err, $refs)`<br>
A callback that will receive a [`$Refs`](#refs-object) object.

- **Return Value:** `Promise`<br>
See [Callbacks vs. Promises](#callbacks-vs-promises) below.

Resolves all JSON references (`$ref` pointers) in the given Swagger API.  If it references any other files/URLs, then they will be downloaded and resolved as well (unless `options.$refs.external` is false).   This method **does not** dereference anything.  It simply gives you a [`$Refs`](#refs-object) object, which is a map of all the resolved references and their values.

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    // $refs.paths() returns the paths of all the files in your API
    var filePaths = $refs.paths();

    // $refs.get() lets you query parts of your API
    var name = $refs.get("schemas/person.yaml#/properties/name");

    // $refs.set() lets you change parts of your API
    $refs.set("schemas/person.yaml#/properties/favoriteColor/default", "blue");
  });
```


### `bundle(path, [options], [callback])`

- **path** (_required_) - `string` or `object`<br>
The file path or URL of your Swagger API.  See the [`parse`](#parsepath-options-callback) method for more info.

- **options** (_optional_) - `object`<br>
See [options](#options) below.

- **callback** (_optional_) - `function(err, api)`<br>
A callback that will receive the bundled [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object).

- **Return Value:** `Promise`<br>
See [Callbacks vs. Promises](#callbacks-vs-promises) below.

Bundles all referenced files/URLs into a single api that only has _internal_ `$ref` pointers.  This lets you split-up your API however you want while you're building it, but easily combine all those files together when it's time to package or distribute the API to other people.  The resulting API size will be small, since it will still contain _internal_ JSON references rather than being [fully-dereferenced](#dereferencepath-options-callback).

This also eliminates the risk of [circular references](#circular-refs), so the API can be safely serialized using [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```javascript
SwaggerParser.bundle("my-api.yaml")
  .then(function(api) {
    console.log(api.definitions.person); // => {$ref: "#/definitions/schemas~1person.yaml"}
  });
```


### `dereference(path, [options], [callback])`

- **path** (_required_) - `string` or `object`<br>
The file path or URL of your Swagger API.  See the [`parse`](#parsepath-options-callback) method for more info.

- **options** (_optional_) - `object`<br>
See [options](#options) below.

- **callback** (_optional_) - `function(err, api)`<br>
A callback that will receive the dereferenced [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object).

- **Return Value:** `Promise`<br>
See [Callbacks vs. Promises](#callbacks-vs-promises) below.

Dereferences all `$ref` pointers in the Swagger API, replacing each reference with its resolved value.  This results in a [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object) that does not contain _any_ `$ref` pointers.  Instead, it's a normal JavaScript object tree that can easily be crawled and used just like any other JavaScript object.  This is great for programmatic usage, especially when using tools that don't understand JSON references.

The `dereference` method maintains object reference equality, meaning that all `$ref` pointers that point to the same object will be replaced with references to the same object.  Again, this is great for programmatic usage, but it does introduce the risk of [circular references](#circular-refs), so be careful if you intend to serialize the API using [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).  Consider using the [`bundle`](#bundlepath-options-callback) method instead, which does not create circular references.

```javascript
SwaggerParser.dereference("my-api.yaml")
  .then(function(api) {
    // The `api` object is a normal JavaScript object,
    // so you can easily access any part of the API using simple dot notation
    console.log(api.definitions.person.properties.firstName); // => {type: "string"}
  });
```


### `validate(path, [options], [callback])`

- **path** (_required_) - `string` or `object`<br>
The file path or URL of your Swagger API.  See the [`parse`](#parsepath-options-callback) method for more info.

- **options** (_optional_) - `object`<br>
See [options](#options) below.

- **callback** (_optional_) - `function(err, api)`<br>
A callback that will receive the dereferenced and validated [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object).

- **Return Value:** `Promise`<br>
See [Callbacks vs. Promises](#callbacks-vs-promises) below.

Validates the Swagger API against the [Swagger 2.0 schema](https://github.com/swagger-api/swagger-spec/blob/master/schemas/v2.0/schema.json) and/or the [Swagger 2.0 spec](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) (depending on the options).

If validation fails, then an error will be passed to the callback function, or the Promise will reject. Either way, the error will contain information about why the API is invalid.

This method calls [`dereference`](#dereferencepath-options-callback) internally, so the returned [Swagger object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object) is fully dereferenced.

```javascript
SwaggerParser.validate("my-api.yaml")
  .then(function(api) {
    console.log('Yay! The API is valid.');
  })
  .catch(function(err) {
    console.error('Onoes! The API is invalid. ' + err.message);
  });
```


### Options
You can pass an options parameter to any method.  You don't need to specify every option - only the ones you want to change.

```javascript
SwaggerParser.validate("my-api.yaml", {
  allow: {
    json: false,      // Don't allow JSON files
    yaml: true        // Allow YAML files
  },
  $refs: {
    internal: false   // Don't dereference internal $refs, only external
  },
  cache: {
    fs: 1,            // Cache local files for 1 second
    http: 600         // Cache http URLs for 10 minutes
  },
  validate: {
    spec: false       // Don't validate against the Swagger 2.0 spec
  }
});
```

|Option           |Type     |Default   |Description
|:----------------|:--------|:---------|:----------
|`allow.json`     |bool     |true      |Determines whether JSON files are supported
|`allow.yaml`     |bool     |true      |Determines whether YAML files are supported<br> (note: all JSON files are also valid YAML files)
|`allow.empty`    |bool     |true      |Determines whether it's ok for a `$ref` pointer to point to an empty file
|`allow.unknown`  |bool     |true      |Determines whether it's ok for a `$ref` pointer to point to an unknown/unsupported file type (such as HTML, text, image, etc.). The default is to resolve unknown files as a [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer)
|`$refs.internal` |bool     |true      |Determines whether internal `$ref` pointers (such as `#/definitions/widget`) will be dereferenced when calling [`dereference()`](#dereferencepath-options-callback).  Either way, you'll still be able to get the value using [`$Refs.get()`](#refsgetref-options)
|`$refs.external` |bool     |true      |Determines whether external `$ref` pointers get resolved/dereferenced. If `false`, then no files/URLs will be retrieved.  Use this if you only want to allow single-file APIs.
|`validate.schema`|bool     |true      |Determines whether the [`validate()`](#validatepath-options-callback) method validates the API against the [Swagger 2.0 schema](https://github.com/swagger-api/swagger-spec/blob/master/schemas/v2.0/schema.json)
|`validate.spec`  |bool     |true      |Determines whether the [`validate()`](#validatepath-options-callback) method validates the API against the [Swagger 2.0 spec](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md).  This will catch some things that aren't covered by the `validate.schema` option, such as duplicate parameters, invalid MIME types, etc.
|`cache.fs`       |number   |60        |<a name="caching"></a>The length of time (in seconds) to cache local files.  The default is one minute.  Setting to zero will cache forever.
|`cache.http`     |number   |300       |The length of time (in seconds) to cache HTTP URLs.  The default is five minutes.  Setting to zero will cache forever.
|`cache.https`    |number   |300       |The length of time (in seconds) to cache HTTPS URLs.  The default is five minutes.  Setting to zero will cache forever.


### `API` Object
If you create an instance of the `SwaggerParser` class (rather than just calling the static methods), then the `api` property gives you easy access to the JSON api.  This is the same value that is passed to the callback function (or Promise) when calling the [`parse`](#parsepath-options-callback), [`bundle`](#bundlepath-options-callback), [`dereference`](#dereferencepath-options-callback), or  [`validate`](#validatepath-options-callback) methods.

```javascript
var parser = new SwaggerParser();

parser.api;  // => null

parser.dereference("my-api.yaml")
  .then(function(api) {
    typeof parser.api;     // => "object"

    api === parser.api; // => true
  });
```


### `$Refs` Object
When you call the [`resolve`](#resolvepath-options-callback) method, the value that gets passed to the callback function (or Promise) is a `$Refs` object.  This same object is accessible via the `parser.$refs` property of `SwaggerParser` instances.

This object is a map of JSON References (`$ref` pointers) and their resolved values.  It also has several convenient helper methods that make it easy for you to navigate and manipulate the JSON References.


### `$Refs.paths([types])`

- **types** (_optional_) - `string` (one or more)<br>
Optionally only return certain types of paths ("fs", "http", "https")

- **Return Value:** `array` of `string`<br>
Returns the paths/URLs of all the files in your API (including the main api file).

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    // Get the paths of ALL files in the API
    $refs.paths();

    // Get the paths of local files only
    $refs.paths("fs");

    // Get all URLs
    $refs.paths("http", "https");
  });
```


### `$Refs.values([types])`

- **types** (_optional_) - `string` (one or more)<br>
Optionally only return values from certain locations ("fs", "http", "https")

- **Return Value:** `object`<br>
Returns a map of paths/URLs and their correspond values.

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    // Get ALL paths & values in the API
    // (this is the same as $refs.toJSON())
    var values = $refs.values();

    values["schemas/person.yaml"];
    values["http://company.com/my-api.yaml"];
  });
```


### `$Refs.isExpired($ref)`

- **$ref** (_required_) - `string`<br>
The JSON Reference path, optionally with a JSON Pointer in the hash

- **Return Value:** `boolean`<br>
Returns `true` if the given JSON reference has expired (or if it doesn't exist); otherwise, returns `false`

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    // Hasn't expired yet
    $refs.isExpired("schemas/person.yaml");   // => false

    // Check again after 10 minutes
    setTimeout(function() {
      $refs.isExpired("schemas/person.yaml"); // => true
    }, 600000);
  });
```


### `$Refs.expire($ref)`

- **$ref** (_required_) - `string`<br>
The JSON Reference path, optionally with a JSON Pointer in the hash

Immediately expires the given JSON reference, so the next time you call a method such as [`parse`](#parsepath-options-callback) or [`dereference`](#dereferencepath-options-callback), the file will be refreshed rather than reusing the cached value.

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    $refs.isExpired("schemas/person.yaml");   // => false

    $refs.expire("schemas/person.yaml");

    $refs.isExpired("schemas/person.yaml");   // => true
  });
```


### `$Refs.exists($ref)`

- **$ref** (_required_) - `string`<br>
The JSON Reference path, optionally with a JSON Pointer in the hash

- **Return Value:** `boolean`<br>
Returns `true` if the given path exists in the API; otherwise, returns `false`

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    $refs.exists("schemas/person.yaml#/properties/firstName"); // => true
    $refs.exists("schemas/person.yaml#/properties/foobar");    // => false
  });
```


### `$Refs.get($ref, [options])`

- **$ref** (_required_) - `string`<br>
The JSON Reference path, optionally with a JSON Pointer in the hash

- **options** (_optional_) - `object`<br>
See [options](#options) below.

- **Return Value:** `boolean`<br>
Gets the value at the given path in the API. Throws an error if the path does not exist.

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    var value = $refs.get("schemas/person.yaml#/properties/firstName");
  });
```


### `$Refs.set($ref, value, [options])`

- **$ref** (_required_) - `string`<br>
The JSON Reference path, optionally with a JSON Pointer in the hash

- **value** (_required_)<br>
The value to assign. Can be anything (object, string, number, etc.)

- **options** (_optional_) - `object`<br>
See [options](#options) below.

Sets the value at the given path in the API. If the property, or any of its parents, don't exist, they will be created.

```javascript
SwaggerParser.resolve("my-api.yaml")
  .then(function($refs) {
    $refs.set("schemas/person.yaml#/properties/favoriteColor/default", "blue");
  });
```


### `YAML` object
This object provides simple YAML parsing functions.  Swagger Parser uses this object internally
for its own YAML parsing, but it is also exposed so you can use it in your code if needed.


### `YAML.parse(text)`

- **text** (_required_) - `string`<br>
The YAML string to be parsed.

- **Return Value:**<br>
Returns the parsed value, which can be any valid JSON type (object, array, string, number, etc.)

This method is similar to [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse), but it supports YAML _in addition_ to JSON (since any JSON document is also a valid YAML document).

```javascript
var YAML = SwaggerParser.YAML;
var text = "title: person \n" +
           "required: \n" +
           "  - name \n" +
           "  - age \n" +
           "properties: \n" +
           "  name: \n" +
           "    type: string \n" +
           "  age: \n" +
           "    type: number"

var obj = YAML.parse(text);

// {
//   title: "person",
//   required: ["name", "age"],
//   properties: {
//     name: {
//       type: "string"
//     },
//     age: {
//       type: "number"
//     }
//   }
// }
```


### `YAML.stringify(value)`

- **value** (_required_)<br>
The value to be converted to a YAML string. Can be any valid JSON type (object, array, string, number, etc.)

- **Return Value:** `string`<br>
Returns the a YAML string containing the serialized value

This method is similar to [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify), except that it converts a value to a YAML string instead of a JSON string.

```javascript
var YAML = SwaggerParser.YAML;
var obj = {
  title: "person",
  required: ["name", "age"],
  properties: {
    name: {
      type: "string"
    },
    age: {
      type: "number"
    }
  }
};


var string = YAML.stringify(obj);

// title: person
// required:
//   - name
//   - age
// properties:
//   name:
//     type: string
//   age:
//     type: number
```


### Class methods vs. Instance methods
All of Swagger Parser's methods are available as static (class) methods, and as instance methods.  The static methods simply create a new `SwaggerParser` instance and then call the corresponding instance method.  Thus, the following line...

```javascript
SwaggerParser.validate("my-api.yaml");
```

... is the same as this:

```javascript
var parser = new SwaggerParser();
parser.validate("my-api.yaml");
```

The difference is that in the second example you now have a reference to `parser`, which means you can access the results ([`parser.api`](#api-object) and [`parser.$refs`](#refs-object)) anytime you want, rather than just in the callback function. Also, having a `SwaggerParser` instance allows you to benefit from **[caching](#caching)**, so the next time you call [`parser.resolve()`](#resolvepath-options-callback), it won't need to re-download those files again (as long as the cache hasn't expired).


### Callbacks vs. Promises
Many people prefer [ES6 Promise syntax](http://javascriptplayground.com/blog/2015/02/promises/) instead of callbacks.  Swagger Parser allows you to use whichever one you prefer.  Every method accepts an optional callback _and_ returns a Promise.  So pick your poison.


Circular $Refs
--------------------------
Swagger APIs can contain [circular $ref pointers](https://gist.github.com/BigstickCarpet/d18278935fc73e3a0ee1), and Swagger Parser fully supports them. Circular references can be resolved and dereferenced just like any other reference.  However, if you intend to serialize the dereferenced api as JSON, then you should be aware that [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) does not support circular references by default, so you will need to [use a custom replacer function](https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json).

Another option is to use the [`bundle`](#bundlepath-options-callback) method rather than the [`dereference`](#dereferencepath-options-callback) method.  Bundling does _not_ result in circular references, because it simply converts _external_ `$ref` pointers to _internal_ ones.

```javascript
"person": {
    "properties": {
        "name": {
          "type": "string"
        },
        "spouse": {
          "type": {
            "$ref": "#/person"        // circular reference
          }
        }
    }
}
```


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-parser/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/bigstickcarpet/swagger-parser.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the build script__<br>
`npm run build`

4. __Run the unit tests__<br>
`npm run mocha` (test in Node)<br>
`npm run karma` (test in web browsers)<br>
`npm test` (test in Node and browsers, and report code coverage)


License
--------------------------
Swagger Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.
