describe.only('Real-world APIs', function() {
  'use strict';

  var realWorldAPIs = [];
  var apiIndex = 0;

  before(function(done) {
    // Download a list of over 100 real-world Swagger APIs from apis.guru
    superagent.get('http://apis-guru.github.io/api-models/api/v1/list.json')
      .end(function(err, res) {
        if (err || !res.ok) {
          return done(err || new Error('Unable to downlaod real-world APIs from apis.guru'));
        }

        // Remove certain APIs that are known to cause problems
        var apis = res.body;
        delete apis['citrixonline.com:scim'];   // special characters in the URL cause problems
        delete apis['googleapis.com:adsense'];  // GitHub's CORS policy blocks this
        delete apis['motaword.com'];            // invalid (see https://github.com/BigstickCarpet/swagger-parser/issues/26)
        delete apis['uploady.com'];             // invalid (see https://github.com/BigstickCarpet/swagger-parser/issues/26)
        delete apis['watchful.li'];             // invalid (see https://github.com/BigstickCarpet/swagger-parser/issues/26)

        // Transform the list into an array of {name: string, url: string}
        realWorldAPIs = [];
        Object.keys(apis).forEach(function(apiName) {
          Object.keys(apis[apiName].versions).forEach(function(version) {
            var fullName = apiName + ' ' + (version[0] === 'v' ? version : 'v' + version);
            var url = apis[apiName].versions[version].swaggerYamlUrl;
            realWorldAPIs.push({ name: fullName, url: url });
          });
        });

        done();
      });
  });

  // Mocha requires us to create our tests synchronously. But the list of APIs is downloaded asynchronously.
  // So, we just create 200 placeholder tests, and then rename them later to reflect which API they're testing.
  for (var i = 1; i <= 300; i++) {
    it(i + ') ', function(done) {
      // Get the next API to test
      var api = realWorldAPIs[apiIndex++];

      if (!api) {
        // There are no more APIs to test
        this.test.title += 'more APIs coming soon...';
        return done();
      }

      // Validate this API
      this.test.title += api.name;
      SwaggerParser.validate(api.url)
        .then(function() {
          done();
        })
        .catch(done);
    });
  }
});
