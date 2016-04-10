------------------------------------------------

##### NOTICE: Swagger Parser v4.0 _beta_ is now available
You can install the beta using `npm install swagger-parser@beta`.

- [v4.0 code branch](https://github.com/BigstickCarpet/swagger-parser/tree/releases/4.0.0)
- [v4.0 documentation](https://github.com/BigstickCarpet/swagger-parser/tree/releases/4.0.0/docs)
- [v4.0 changelog](https://github.com/BigstickCarpet/swagger-parser/blob/releases/4.0.0/CHANGELOG.md)

------------------------------------------------

Swagger Parser v3.4
============================
#### Swagger 2.0 parser and validator for Node and browsers

[![Build Status](https://api.travis-ci.org/BigstickCarpet/swagger-parser.svg)](https://travis-ci.org/BigstickCarpet/swagger-parser)
[![Dependencies](https://david-dm.org/BigstickCarpet/swagger-parser.svg)](https://david-dm.org/BigstickCarpet/swagger-parser)
[![Coverage Status](https://coveralls.io/repos/BigstickCarpet/swagger-parser/badge.svg?branch=master&service=github)](https://coveralls.io/r/BigstickCarpet/swagger-parser)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/swagger-parser/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-parser)
[![Codacy Score](https://www.codacy.com/project/badge/6d686f916836433b9c013379fbe1052c)](https://www.codacy.com/public/jamesmessinger/swagger-parser)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/swagger-parser.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/swagger-parser)

[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Bower](http://img.shields.io/bower/v/swagger-parser.svg)](http://bower.io/)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

[![Browser Compatibility](https://saucelabs.com/browser-matrix/swagger-parser.svg)](https://saucelabs.com/u/swagger-parser)

[![Online Demo](http://bigstickcarpet.com/swagger-parser/www/img/demo.svg)](http://bigstickcarpet.com/swagger-parser/)

Features
--------------------------
- Parses Swagger specs in **JSON** or **YAML** format
- Validates against the [Swagger 2.0 schema](https://github.com/swagger-api/swagger-spec/blob/master/schemas/v2.0/schema.json) _and_ the [Swagger 2.0 spec](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md)
- [Resolves](docs/swagger-parser.md#resolveapi-options-callback) all `$ref` pointers, including external files and URLs
- Can [bundle](docs/swagger-parser.md#bundleapi-options-callback) all your Swagger files into a single file that only has _internal_ `$ref` pointers
- Can [dereference](docs/swagger-parser.md#dereferenceapi-options-callback) all `$ref` pointers, giving you a normal JavaScript object that's easy to work with
- Configurable caching of external files and URLs
- **[Tested](http://bigstickcarpet.github.io/swagger-parser/tests/index.html)** in Node, IO.js, and all modern web browsers on Mac, Windows, Linux, iOS, and Android
- Tested on **[over 200 real-world APIs](https://github.com/APIs-guru/api-models)** from Google, Instagram, Cisco, etc.
- Supports [circular references](docs/README.md#circular-refs), nested references, back-references, and cross-references
- Maintains object reference equality &mdash; `$ref` pointers to the same value always resolve to the same object instance


Related Projects
--------------------------
- [Swagger CLI](https://github.com/BigstickCarpet/swagger-cli)
- [Swagger Express Middleware](https://github.com/BigstickCarpet/swagger-express-middleware)


Example
--------------------------

```javascript
SwaggerParser.validate(myAPI, function(err, api) {
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
SwaggerParser.validate(myAPI)
  .then(function(api) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  })
  .catch(function(err) {
    console.error(err);
  });
```

For more detailed examples, please see the [API Documentation](docs/README.md)


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


API Documentation
--------------------------
Full API documentation is available [right here](docs/README.md)


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

5. __Start the local web server__<br>
`npm start` (then browse to [http://localhost:8080/www/index.html](http://bigstickcarpet.com/swagger-parser/www/index.html) or [http://localhost:8080/tests/index.html](http://bigstickcarpet.com/swagger-parser/tests/index.html))


License
--------------------------
Swagger Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.
