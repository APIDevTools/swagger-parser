describe('Real-world APIs', function () {
  'use strict';

  var realWorldAPIs = [];
  var apiIndex = 0;
  var safeToIgnore = getKnownApiErrors();

  before(function (done) {
    // This hook sometimes takes several seconds, due to the large download
    this.timeout(10000);

    // Download a list of over 1500 real-world Swagger APIs from apis.guru
    superagent.get('https://api.apis.guru/v2/list.json')
      .end(function (err, res) {
        if (err || !res.ok) {
          return done(err || new Error('Unable to downlaod real-world APIs from apis.guru'));
        }

        // Remove certain APIs that are known to cause problems
        var apis = res.body;

        // GitHub's CORS policy blocks this request
        delete apis['googleapis.com:adsense'];

        // These APIs cause infinite loops in json-schema-ref-parser.  Still investigating.
        // https://github.com/BigstickCarpet/json-schema-ref-parser/issues/56
        delete apis['bungie.net'];
        delete apis['stripe.com'];

        // Transform the list into an array of {name: string, url: string}
        realWorldAPIs = [];
        Object.keys(apis).forEach(function (apiName) {
          Object.keys(apis[apiName].versions).forEach(function (version) {
            var api = apis[apiName].versions[version];
            api.name = apiName;
            api.version = version;
            realWorldAPIs.push(api);
          });
        });

        done();
      });
  });

  beforeEach(function () {
    // Some of these APIs are vary large, so we need to increase the timouts
    // to allow time for them to be downloaded, dereferenced, and validated.
    // so we need to increase the timeouts to allow for that
    this.currentTest.timeout(30000);
    this.currentTest.slow(5000);
  });

  // Mocha requires us to create our tests synchronously. But the list of APIs is downloaded asynchronously.
  // So, we just create 1500 placeholder tests, and then rename them later to reflect which API they're testing.
  for (var i = 1; i <= 1500; i++) {
    it(i + ') ', testNextAPI);
  }

  function testNextAPI (done) {
    // Get the next API to test
    var api = realWorldAPIs[apiIndex++];

    if (api) {
      this.test.title += api.name + ' ' + (api.version[0] === 'v' ? api.version : 'v' + api.version);

      // Validate this API
      SwaggerParser.validate(api.swaggerYamlUrl)
        .then(function () {
          done();
        })
        .catch(function (err) {
          if (shouldIgnoreError(api, err)) {
            done();
          }
          else {
            console.error('\n\nERROR IN THIS API:', JSON.stringify(api, null, 2));
            done(err);
          }
        });
    }
    else {
      // There are no more APIs to test
      this.test.title += 'more APIs coming soon...';
      done();
    }
  }

  /**
   * Determines whether an API validation error is safe to ignore.
   * It checks for known validation errors in certain API definitions on APIs.guru
   */
  function shouldIgnoreError (api, error) {
    for (var i = 0; i < safeToIgnore.length; i++) {
      var expected = safeToIgnore[i];
      var actual = { api: api.name, error: error.message };

      if (isMatch(actual, expected)) {
        // This error is safe to ignore because it's a known problem with this API definition
        return true;
      }
    }
  }

  /**
   * Determines whether an API and error match a known error that is safe to ignore.
   */
  function isMatch (actual, expected) {
    if (typeof expected.api === 'string' && actual.api.indexOf(expected.api) === -1) {
      return false;
    }

    if (typeof expected.error === 'string' && actual.error.indexOf(expected.error) === -1) {
      return false;
    }

    if (expected.error instanceof RegExp && !expected.error.test(actual.error)) {
      return false;
    }

    return true;
  }

  /**
   * Returns a list of known validation errors in certain API definitions on APIs.guru.
   */
  function getKnownApiErrors () {
    var safeToIgnore = [
      // Swagger 3.0 files aren't supported yet
      { error: 'not a valid Swagger API definition' },

      // Many Azure API definitions erroneously reference external files that don't exist
      { api: 'azure.com', error: /Error downloading .*\.json\s+HTTP ERROR 404/ },

      // Many Azure API definitions have endpoints with multiple "location" placeholders, which is invalid
      { api: 'azure.com', error: 'has multiple path placeholders named {location}' },
      { api: 'azure.com', error: 'Required property \'location\' does not exist' },

      // Stoplight.io's API definition uses multi-type schemas, which isn't allowed by Swagger 2.0
      { api: 'stoplight.io', error: 'invalid response schema type (object,string)' },

      // VersionEye's API definition is missing MIME types
      { api: 'versioneye.com', error: 'has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded' },

      // Many API definitions have data models with required properties that aren't defined
      { api: 'azure.com:apimanagement-apimdeployment', error: 'Required property \'sku\' does not exist' },
      { api: 'azure.com:compute', error: 'Required property \'name\' does not exist' },
      { api: 'azure.com:recoveryservices-registeredidentities', error: 'Required property \'certificate\' does not exist' },
      { api: 'azure.com:resources', error: 'Required property \'code\' does not exist' },
      { api: 'azure.com:servicefabric', error: 'Required property \'ServiceKind\' does not exist' },
      { api: 'azure.com:timeseriesinsights', error: 'Required property \'dataRetentionTime\' does not exist' },
      { api: 'iqualify.com', error: 'Required property \'contentId\' does not exist' },
    ];

    var nodeVersion = parseFloat(process.version.substr(1));

    if (nodeVersion < 8) {
      // Many AWS APIs contain RegEx patterns that are invalid on older versions of Node.
      // They work fine on Node 8+ though.  Examples of problematic RegExp include:
      //    ^[0-9A-Za-z\.\-_]*(?<!\.)$
      //    jdbc:(redshift|postgresql)://((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+redshift\.amazonaws\.com:\d{1,5}/[a-zA-Z0-9_$]+
      safeToIgnore.push({
        api: 'amazonaws.com',
        error: "Object didn't pass validation for format regex",
      });
    }

    return safeToIgnore;
  }
});
