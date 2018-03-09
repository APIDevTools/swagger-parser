describe('Real-world APIs', function () {
  'use strict';

  var realWorldAPIs = [];
  var apiIndex = 0;

  before(function (done) {
    // Download a list of over 200 real-world Swagger APIs from apis.guru
    superagent.get('https://api.apis.guru/v2/list.json')
      .end(function (err, res) {
        if (err || !res.ok) {
          return done(err || new Error('Unable to download real-world APIs from apis.guru'));
        }

        var apis = res.body;

        // Remove certain APIs that are known to cause problems
        delete apis['googleapis.com:adsense'];  // GitHub's CORS policy blocks this
        delete apis['versioneye.com'];          // Fails validation due to incorrect content type

        // https://github.com/BigstickCarpet/json-schema-ref-parser/issues/56
        delete apis['bungie.net'];
        delete apis['stripe.com'];

        // https://github.com/APIs-guru/openapi-directory/issues/351
        delete apis['azure.com:network-expressRouteCircuit'];
        delete apis['azure.com:automation-dscCompilationJob'];
        delete apis['azure.com:automation-job'];
        delete apis['azure.com:automation-runbook'];
        delete apis['azure.com:automation-softwareUpdateConfiguration v2017-05-15-preview'];
        delete apis['azure.com:automation-softwareUpdateConfiguration'];
        delete apis['azure.com:automation-softwareUpdateConfigurationMachineRun'];

        // OpenAPI 3.0 definitions
        delete apis['brex.io']; // https://api.apis.guru/v2/specs/brex.io/1.0.0/openapi.yaml

        // Transform the list into an array of {name: string, url: string}
        realWorldAPIs = [];
        Object.keys(apis).forEach(function (apiName) {
          Object.keys(apis[apiName].versions).forEach(function (version) {
            var fullName = apiName + ' ' + (version[0] === 'v' ? version : 'v' + version);
            var url = apis[apiName].versions[version].swaggerYamlUrl;
            realWorldAPIs.push({ name: fullName, url: url });
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
  // So, we just create 1,500 placeholder tests, and then rename them later to reflect which API they're testing.
  for (var i = 1; i <= 1500; i++) {
    it(i + ') ', testNextAPI);
  }

  function testNextAPI (done) {
    // Get the next API to test
    var api = realWorldAPIs[apiIndex++];

    if (api) {
      this.test.title += api.name;

      // Validate this API
      SwaggerParser.validate(api.url)
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });
    }
    else {
      // There are no more APIs to test
      this.test.title += 'more APIs coming soon...';
      done();
    }
  }
});
