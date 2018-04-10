describe('Real-world APIs', function () {
  'use strict';

  var realWorldAPIs = [];
  var apiIndex = 0;
  var knownApiErrors = getKnownApiErrors();

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

        // Flatten the list, so there's an API object for every API version
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
    this.currentTest.timeout(60000);
    this.currentTest.slow(5000);
  });

  // Mocha requires us to create our tests synchronously. But the list of APIs is downloaded asynchronously.
  // So, we just create 1500 placeholder tests, and then rename them later to reflect which API they're testing.
  for (var i = 1; i <= 1500; i++) {
    it(i + ') ', testNextAPI);
  }

  /**
   * This Mocha test is repeated for each API in the APIs.guru registry
   */
  function testNextAPI (done) {
    // Get the next API to test
    var api = realWorldAPIs[apiIndex++];

    if (api) {
      this.test.title += api.name + ' ' + (api.version[0] === 'v' ? api.version : 'v' + api.version);
      validateApi(api).then(done, done);
    }
    else {
      // There are no more APIs to test
      this.test.title += 'more APIs coming soon...';
      done();
    }
  }

  /**
   * Downloads an API definition and validates it.  Automatically retries if the download fails.
   */
  function validateApi (api, attemptNumber) {
    attemptNumber = attemptNumber || 1;

    return SwaggerParser.validate(api.swaggerYamlUrl)
      .then(function () {
        return null;
      })
      .catch(function (error) {
        var knownError = knownApiErrors.find(isMatch(api, error));

        if (!knownError) {
          console.error('\n\nERROR IN THIS API:', JSON.stringify(api, null, 2));
          throw error;
        }

        if (knownError.whatToDo === 'ignore') {
          // Ignore the error.  It's a known problem with this API
          return null;
        }

        if (knownError.whatToDo === 'retry') {
          if (attemptNumber >= 3) {
            console.error('        failed to download.  giving up.');
            return null;
          }
          else {
            // Wait a few seconds, then try the download again
            return new Promise(
              function (resolve) {
                console.error('        failed to download.  trying again...');
                setTimeout(resolve, 2000);
              })
              .then(function () {
                return validateApi(api, attemptNumber + 1);
              });
          }
        }
      });
  }

  /**
   * Determines whether an API and error match a known error.
   */
  function isMatch (api, error) {
    return function (knownError) {
      if (typeof knownError.api === 'string' && api.name.indexOf(knownError.api) === -1) {
        return false;
      }

      if (typeof knownError.error === 'string' && error.message.indexOf(knownError.error) === -1) {
        return false;
      }

      if (knownError.error instanceof RegExp && !knownError.error.test(error.message)) {
        return false;
      }

      return true;
    };
  }

  /**
   * Returns a list of known validation errors in certain API definitions on APIs.guru.
   */
  function getKnownApiErrors () {
    var knownErrors = [
      // If the API definition failed to download, then retry
      {
        error: /Error downloading https?:.*swagger\.yaml/,
        whatToDo: 'retry',
      },
      {
        error: 'socket hang up',
        whatToDo: 'retry',
      },

      // Swagger 3.0 files aren't supported yet
      {
        error: 'not a valid Swagger API definition',
        whatToDo: 'ignore',
      },

      // Many Azure API definitions erroneously reference external files that don't exist
      {
        api: 'azure.com', error: /Error downloading .*\.json\s+HTTP ERROR 404/,
        whatToDo: 'ignore',
      },

      // Many Azure API definitions have endpoints with multiple "location" placeholders, which is invalid
      {
        api: 'azure.com', error: 'has multiple path placeholders named {location}',
        whatToDo: 'ignore',
      },
      {
        api: 'azure.com', error: 'Required property \'location\' does not exist',
        whatToDo: 'ignore',
      },

      // Stoplight.io's API definition uses multi-type schemas, which isn't allowed by Swagger 2.0
      {
        api: 'stoplight.io', error: 'invalid response schema type (object,string)',
        whatToDo: 'ignore',
      },

      // VersionEye's API definition is missing MIME types
      {
        api: 'versioneye.com', error: 'has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded',
        whatToDo: 'ignore',
      },

      // Many API definitions have data models with required properties that aren't defined
      {
        api: 'azure.com:apimanagement-apimdeployment', error: 'Required property \'sku\' does not exist',
        whatToDo: 'ignore',
      },
      {
        api: 'azure.com:compute', error: 'Required property \'name\' does not exist',
        whatToDo: 'ignore',
      },
      {
        api: 'azure.com:recoveryservices-registeredidentities', error: 'Required property \'certificate\' does not exist',
        whatToDo: 'ignore',
      },
      {
        api: 'azure.com:resources', error: 'Required property \'code\' does not exist',
        whatToDo: 'ignore',
      },
      {
        api: 'azure.com:servicefabric', error: 'Required property \'ServiceKind\' does not exist',
        whatToDo: 'ignore',
      },
      {
        api: 'azure.com:timeseriesinsights', error: 'Required property \'dataRetentionTime\' does not exist',
        whatToDo: 'ignore',
      },
      {
        api: 'iqualify.com', error: 'Required property \'contentId\' does not exist',
        whatToDo: 'ignore',
      },
    ];

    if (host.node && host.node.version < 8) {
      // Many AWS APIs contain RegEx patterns that are invalid on older versions of Node.
      // They work fine on Node 8+ though.  Examples of problematic RegExp include:
      //    ^[0-9A-Za-z\.\-_]*(?<!\.)$
      //    jdbc:(redshift|postgresql)://((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+redshift\.amazonaws\.com:\d{1,5}/[a-zA-Z0-9_$]+
      knownErrors.push({
        api: 'amazonaws.com',
        error: "Object didn't pass validation for format regex",
        whatToDo: 'ignore',
      });
    }

    return knownErrors;
  }
});
