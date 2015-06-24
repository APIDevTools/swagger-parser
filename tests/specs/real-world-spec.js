require('../test-environment');
require('../files/real-world/file-list');

describe('Real-world tests', function() {
  'use strict';

  beforeEach(function() {
    // Some of these APIs are REALLY big, so we need to allow a large enough timeout
    // to allow for parsing and for garbage collection between each test.
    this.currentTest.timeout(6000 * env.timeoutMultiplier);
    this.currentTest.slow(5000 * env.timeoutMultiplier);
  });

  env.realWorldFiles.forEach(function(file, index) {
    it((index + 1) + ') ' + file,
      function(done) {
        if (env.isGitHub && file.indexOf('/adsense/') >= 0) {
          // Skip Google AdSense tests when running on GitHub Pages.
          // The gh-pages server mistakenly attempts to serve the AdSense script instead of Swagger file.
          done();
          return;
        }

        env.parser.parse(env.getPath('real-world/' + file), function(err, api, metadata) {
          if (err) {
            expect(err).to.be.an.instanceOf(ReferenceError);
            expect(err.message).to.contain('circular reference(s) detected')
          }

          expect(api).to.be.an('object').and.not.empty;
          expect(api.swagger).to.be.a('string').and.not.empty;
          expect(api.info).to.be.an('object').and.not.empty;
          expect(api.paths).to.be.an('object');                   // <-- api.paths can be empty
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );
  });
});
