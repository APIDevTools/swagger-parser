describe('Real-world APIs', function() {
  'use strict';

  // If we're not running on localhost, then assume we're running on GitHub Pages
  var isGitHub = userAgent.isBrowser &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  // Skip Google AdSense APIs when running on GitHub Pages.
  // The gh-pages server mistakenly attempts to serve the AdSense script instead of Swagger file.
  if (isGitHub) {
    global.realWorldAPIs = realWorldAPIs.filter(function(api) {
      return api.name !== 'adsense';
    });
  }

  realWorldAPIs.forEach(function(api, index) {
    // Build a friendly name for the API
    var name = (index + 1) + ') ' + api.domain;
    if (api.name) {
      name += ' (' + api.name + ')';
    }
    name += ' v' + api.version;

    it(name, function(done) {
      // Parse and Validate the API
      SwaggerParser.validate(api.path)
        .then(function(api) {
          done(); // Validated successfully!
        })
        .catch(helper.shouldNotGetCalled(done))
    });
  });
});
