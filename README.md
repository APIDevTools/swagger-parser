Swagger-Parser
============================
#### Parses, validates, and dereferences JSON/YAML Swagger specs in Node and browsers

[![Build Status](https://img.shields.io/travis/BigstickCarpet/swagger-parser.svg)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://img.shields.io/david/bigstickcarpet/swagger-parser.svg)](https://david-dm.org/bigstickcarpet/swagger-parser)
[![Code Climate Score](https://img.shields.io/codeclimate/github/BigstickCarpet/swagger-parser.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](http://img.shields.io/codacy/6d686f916836433b9c013379fbe1052c.svg)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Coverage Status](https://img.shields.io/coveralls/BigstickCarpet/swagger-parser.svg)](https://coveralls.io/r/BigstickCarpet/swagger-parser)
[![Inline docs](http://inch-ci.org/github/bigstickcarpet/swagger-parser.svg?branch=master&style=shields)](http://inch-ci.org/github/bigstickcarpet/swagger-parser)

[![Downloads](https://img.shields.io/npm/dm/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](#bower)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

|[Live Demo!](http://bigstickcarpet.github.io/swagger-parser/)
|------------------------------------------------------------


| **!!! ALPHA NOTICE !!!**
|-----------------------------------
|Swagger Parser 3.0 is in alpha.  It is fairly stable, but not fully tested yet, so you may find bugs.  Also, please be aware that the API might change slightly before final release.<br><br>To install the alpha, run `npm install swagger-parser@alpha`


Features
--------------------------
* Parses Swagger specs in **JSON or YAML** format
* **Validates** against the [Swagger 2.0 schema](https://github.com/reverb/swagger-spec/blob/master/schemas/v2.0/schema.json) _and_ the [Swagger 2.0 spec](https://github.com/reverb/swagger-spec/blob/master/versions/2.0.md)
* **Resolves** all `$ref` pointers, including pointers to **external files and URLs**
* Can **dereference** all `$ref` pointers, giving you a single JavaScript object that's easy to use
* You can choose to dereference only internal `$refs`, external `$refs`, or both
* Configurable **caching** of external files and URLs
* **[Tested](http://bigstickcarpet.com/swagger-parser/tests/index.html)** in Node.js, io.js, Browserify, and all major web browsers on Windows, Mac, and Linux
* Tested on **[over 100 Google APIs](https://github.com/APIs-guru/api-models/tree/master/googleapis.com)**
* Supports [circular references](#circular-refs), nested references, back-references, and cross-references
* Different `$ref` pointers to the same value are resolved to the same object instance, thus maintaining reference equality


Installation
--------------------------
Install using **[npm](https://docs.npmjs.com/getting-started/what-is-npm)** or **[bower](http://bower.io/)**, or just download [`swagger-parser.js`](dist/swagger-parser.js) or [`swagger-parser.min.js`](dist/swagger-parser.min.js).

#### Node

```bash
npm install swagger-parser@alpha
```

#### Bower

```bash
bower install swagger-parser
```


Sample Usage
--------------------------
In Node or Browserify, you'll need to `require("swagger-parser")` first.  On the web, either use `<script src="dist/swagger-parser.js"></script>` or add `swagger-parser` as a dependency in your AMD (Require.js) module.


```javascript
// Use it with callbacks
SwaggerParser.parse("swagger.yaml", function(err, api) {
  if (err) {
    console.error(err);
  }
  else {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  }
});

// Or use it with Promises
SwaggerParser.parse("swagger.yaml")
  .then(function(api) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  })
  .catch(function(err) {
    console.error(err);
  });
```


The API
--------------------------
* [Class methods vs. Instance methods](#class-methods-vs-instance-methods)
* [Callbacks vs. Promises](#callbacks-vs-promises)
* [Options](#options)
* Methods
    * [`parse()`](#parsepath-options-callback)
    * [`resolve()`](#resolvepath-options-callback)
    * [`dereference()`](#dereferencepath-options-callback)
    * [`validate()`](#validatepath-options-callback)
* Properties
    * [`api`](#api-property)
    * [`$refs`](#refs-property)

### Class methods vs. Instance methods
All of SwaggerParser's methods are available as static (class) methods, or as instance methods.  The static methods simply create a new `SwaggerParser` instance and then call the corresponding instance method.  Thus, the following line...

```javascript
SwaggerParser.resolve("MyApi.json");
```

... is the same as this:

```javascript
var parser = new SwaggerParser();
parser.resolve("MyAPI.json");
```

The difference is that in the second example you now have a reference to `parser`, which means you can access the results ([`parser.api`](#api-property) and [`parser.$refs`](#refs-property)) anytime you want, rather than just in the callback function. Another benefit of creating a `SwaggerParser` instance is to benefit from **[caching](#caching)**.  SwaggerParser caches all of the files/URLs it downloads, so the next time you call [`parser.resolve()`](#resolvepath-options-callback), it won't have to re-download those files again (as long as the cache hasn't expired).


### Callbacks vs. Promises
Many people prefer [ES6 Promise syntax](http://javascriptplayground.com/blog/2015/02/promises/) instead of callbacks.  SwaggerParser allows you to use whichever one you prefer.  Every method accepts an optional callback _and_ returns a Promise.  So pick your poison.


### Options
You can pass an options parameter to any method.  You don't need to specify all options.  Only the ones you want to change.

```javascript
SwaggerParser.dereference("MyApi.yaml", {
    allow: {
        json: false,        // Don't allow JSON files
        yaml: true          // Allow YAML files
    }, 
    $refs: {
        internal: false     // Don't dereference internal $refs, only external
    },
    cache: {
        fs: 0,              // Don't cache local files
        http: 600           // Cache http URLs for 10 minutes
    },
    validate: {
        spec: false         // Allow the API to violate the Swagger spec
    }
});
```

|Option           |Type     |Default   |Description
|:----------------|:--------|:---------|:----------
|`allow.json`     |bool     |true      |Determines whether JSON files are supported
|`allow.yaml`     |bool     |true      |Determines whether YAML files are supported<br> (note: all JSON files are also valid YAML files)
|`allow.empty`    |bool     |true      |Determines whether it's ok for a `$ref` pointer to point to an empty file
|`allow.unknown`  |bool     |true      |Determines whether it's ok for a `$ref` pointer to point to an unknown/unsupported file type (such as HTML, text, image, etc.). The default is to resolve unknown files as a [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer)
|`$refs.internal` |bool     |true      |Determines whether internal `$ref` pointers (such as `#/definitions/widget`) will be dereferenced when calling [`dereference()`](#dereferencepath-options-callback).  Either way, you'll still be able to get the value using [`$refs.get()`](#refs-get)
|`$refs.external` |bool     |true      |Determines whether external `$ref` pointers get resolved/dereferenced. If `false`, then no files/URLs will be retrieved.  Use this if you only want to allow single-file Swagger APIs.
|`cache.fs`       |number   |60        |<a name="caching"></a>The length of time (in seconds) to cache local files.  The default is one minute.
|`cache.http`     |number   |300       |The length of time (in seconds) to cache HTTP URLs.  The default is five minutes.
|`cache.https`    |number   |300       |The length of time (in seconds) to cache HTTPS URLs.  The default is five minutes.
|`validate.schema`|bool     |true      |Determines whether the [`validate()`](#validatepath-options-callback) method validates the API against the [Swagger 2.0 schema](https://github.com/swagger-api/swagger-spec/blob/master/schemas/v2.0/schema.json)
|`validate.spec`  |bool     |true      |Determines whether the [`validate()`](#validatepath-options-callback) method validates the API against the [Swagger 2.0 spec] (https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md).  This will catch some things that aren't covered by the `validate.schema` option, such as duplicate parameters, invalid MIME types, etc.


### `parse(path, [options], [callback])`
Parses the given Swagger file (in JSON or YAML format), and returns it as a JavaScript object.  This method **does not** resolve `$ref` pointers, dereference anything, or validate your API.  It simply parses _one_ file and returns it.

* **path** (_required_) - `string` or `object`<br>
The file path or URL of your Swagger file.  The path can be absolute or relative.  In Node, the path is relative to `process.cwd()`.  In the browser, it's relative to the URL of the page.
<br><br>
If you already have the Swagger API as a JavaScript object, then you can pass that instead of a file path.  Swagger Parser will verify that it's actually a [Swagger Object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object).

* **options** (_optional_) - `object`<br>
See [options](#options) above.

* **callback** (_required_) - `function(err, api)`<br>
A callback that will receive the parsed [Swagger Object](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#swagger-object), or an error.

* **Return Value:** `Promise`<br>
You can use [ES6 Promise syntax](http://javascriptplayground.com/blog/2015/02/promises/) instead of a callback if you prefer. 


### `resolve(path, [options], [callback])`
Resolves `$ref` pointers in the given Swagger file.  If it references any other files/URLs, then they will be downloaded and resolved as well (unless `options.$refs.external` is false).   This method **does not** dereference anything.  It simply gives you a [`$refs`](#refs-property) object, which has the resolved values for every `$ref` pointer.

* **path** (_required_) - `string` or `object`<br>
The file path or URL of your Swagger file.  The path can be absolute or relative.  In Node, the path is relative to `process.cwd()`.  In the browser, it's relative to the URL of the page.
<br><br>
If you already have the Swagger API as a JavaScript object, then you can pass that instead of a file path.  Swagger Parser will crawl the object and resolve all of its `$ref` pointers.

* **options** (_optional_) - `object`<br>
See [options](#options) above.

* **callback** (_required_) - `function(err, api)`<br>
A callback that will receive a [`$refs`](#refs-property) object, which has the resolved values for every `$ref` pointer.

* **Return Value:** `Promise`<br>
You can use [ES6 Promise syntax](http://javascriptplayground.com/blog/2015/02/promises/) instead of a callback if you prefer. 


### `dereference(path, [options], [callback])`
To-do


### `validate(path, [options], [callback])`
To-do


### `api` property
To-do


### `$refs` property
To-do


Circular $Refs
--------------------------
Swagger files can contain [circular $ref pointers](https://github.com/BigstickCarpet/swagger-parser/blob/master/tests/files/circular-refs.yaml), and Swagger-Parser will correctly parse them, resolve their values, and validate them against the Swagger schema.  However, Swagger-Parser **does not dereference** circular references because this can easily cause stack overflows when the Swagger object is serialized, as well as other, more subtle bugs.

If your Swagger API includes circular references, then the callback will receive a `ReferenceError` to alert you that the Swagger object was not fully dereferenced. However, you can choose to ignore this error and use the `api` parameter anyway. All non-circular `$ref` pointers in the Swagger object will still be resolved and dereferenced like always.  Circular `$ref` pointers will not be dereferenced, but they _will_ be resolved, so you can access their resolved values in [`metadata.$refs`](#metadata).

```yaml
person:
  properties:
    name:
      type: string
    spouse:
      type:
        $ref: person   # circular reference
```


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-parser/pulls).  Just make sure you build the code and run the unit tests first.

#### Building/Testing
To build the project locally on your computer:

1. **Clone this repo**<br>
`git clone https://github.com/BigstickCarpet/swagger-parser.git`

2. **Install dev dependencies**<br>
`npm install`

3. **Run the build script**<br>
`npm run build`

4. **Run unit tests**<br>
`npm test`


License
--------------------------
Swagger-Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.
