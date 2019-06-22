Swagger 2.0 and OpenAPI 3.0 parser/validator
============================

[![Build Status](https://api.travis-ci.org/APIDevTools/swagger-parser.svg?branch=master)](https://travis-ci.org/APIDevTools/swagger-parser)
[![Coverage Status](https://coveralls.io/repos/github/APIDevTools/swagger-parser/badge.svg?branch=master)](https://coveralls.io/github/APIDevTools/swagger-parser)
[![Tested on APIs.guru](https://api.apis.guru/badges/tested_on.svg)](https://apis.guru/browse-apis/)

[![npm](https://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/swagger-parser)
[![Dependencies](https://david-dm.org/APIDevTools/swagger-parser.svg)](https://david-dm.org/APIDevTools/swagger-parser)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](LICENSE)

[![OS and Browser Compatibility](https://apidevtools.org/img/badges/ci-badges-with-ie.svg)](https://travis-ci.com/APIDevTools/swagger-parser)

[![Online Demo](https://apidevtools.org/swagger-parser/online/img/demo.svg)](https://apidevtools.org/swagger-parser/online/)

Features
--------------------------
- Parses Swagger specs in **JSON** or **YAML** format
- Validates against the [Swagger 2.0 schema](https://github.com/OAI/OpenAPI-Specification/blob/master/schemas/v2.0/schema.json) or [OpenAPI 3.0 Schema](https://github.com/OAI/OpenAPI-Specification/blob/master/schemas/v3.0/schema.json)
- [Resolves](https://apidevtools.org/swagger-parser/docs/swagger-parser.html#resolveapi-options-callback) all `$ref` pointers, including external files and URLs
- Can [bundle](https://apidevtools.org/swagger-parser/docs/swagger-parser.html#bundleapi-options-callback) all your Swagger files into a single file that only has _internal_ `$ref` pointers
- Can [dereference](https://apidevtools.org/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback) all `$ref` pointers, giving you a normal JavaScript object that's easy to work with
- **[Tested](https://travis-ci.com/APIDevTools/swagger-parser)** in Node.js and all modern web browsers on Mac, Windows, and Linux
- Tested on **[over 1,500 real-world APIs](https://apis.guru/browse-apis/)** from Google, Instagram, Spotify, etc.
- Supports [circular references](https://apidevtools.org/swagger-parser/docs/#circular-refs), nested references, back-references, and cross-references
- Maintains object reference equality &mdash; `$ref` pointers to the same value always resolve to the same object instance


Related Projects
--------------------------
- [Swagger CLI](https://github.com/APIDevTools/swagger-cli)
- [Swagger Express Middleware](https://github.com/APIDevTools/swagger-express-middleware)


Example
--------------------------

```javascript
SwaggerParser.validate(myAPI, (err, api) => {
  if (err) {
    console.error(err);
  }
  else {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  }
});
```

Or use `async`/`await` or [Promise](http://javascriptplayground.com/blog/2015/02/promises/) syntax instead. The following example is the same as above:

```javascript
try {
  let api = await SwaggerParser.validate(myAPI);
  console.log("API name: %s, Version: %s", api.info.title, api.info.version);
}
catch(err) {
  console.error(err);
}
```

For more detailed examples, please see the [API Documentation](https://apidevtools.org/swagger-parser/docs/)



Installation
--------------------------
Install using [npm](https://docs.npmjs.com/about-npm/):

```bash
npm install swagger-parser
```



Usage
--------------------------
When using Swagger Parser in Node.js apps, you'll probably want to use **CommonJS** syntax:

```javascript
const SwaggerParser = require("swagger-parser");
```

When using a transpiler such as [Babel](https://babeljs.io/) or [TypeScript](https://www.typescriptlang.org/), or a bundler such as [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/), you can use **ECMAScript modules** syntax instead:

```javascript
import SwaggerParser from "swagger-parser";
```



Browser support
--------------------------
Swagger Parser supports recent versions of every major web browser.  Older browsers may require [Babel](https://babeljs.io/) and/or [polyfills](https://babeljs.io/docs/en/next/babel-polyfill).

To use Swagger Parser in a browser, you'll need to use a bundling tool such as [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/), [Parcel](https://parceljs.org/), or [Browserify](http://browserify.org/). Some bundlers may require a bit of configuration, such as setting `browser: true` in [rollup-plugin-resolve](https://github.com/rollup/rollup-plugin-node-resolve).



API Documentation
--------------------------
Full API documentation is available [right here](https://apidevtools.org/swagger-parser/docs/)


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/APIDevTools/swagger-parser/issues) on GitHub and [submit a pull request](https://github.com/APIDevTools/swagger-parser/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/APIDevTools/swagger-parser.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the build script__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`


License
--------------------------
Swagger Parser is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.

Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jsdevtools.org/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jsdevtools.org/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jsdevtools.org/img/badges/coveralls.svg)](https://coveralls.io)
