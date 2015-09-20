describe('Real-world APIs', function() {
  'use strict';

  // If we're not running on localhost, then assume we're running on GitHub Pages
  var isGitHub = userAgent.isBrowser &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  beforeEach(function() {
    // Some of these APIs are REALLY big, so we need to allow a large enough timeout
    // to allow for parsing and for garbage collection between each test.
    // (this mostly just applies to really slow environments, such as TravisCI and SauceLabs)
    this.currentTest.timeout(5000);
    this.currentTest.slow(4000);
  });

  path.realWorld.forEach(function(file, index) {
    it((index + 1) + ') ' + file,
      function(done) {
        if (isGitHub && file.indexOf('/adsense/') >= 0) {
          // Skip Google AdSense tests when running on GitHub Pages.
          // The gh-pages server mistakenly attempts to serve the AdSense script instead of Swagger file.
          done();
          return;
        }

        SwaggerParser.validate(path.rel(file))
          .then(function(api) {
            // The API was successfully parsed and passed validation
            done();
          })
          .catch(helper.shouldNotGetCalled(done))
      }
    );
  });
});
