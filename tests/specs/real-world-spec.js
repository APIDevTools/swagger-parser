require('../test-environment');
require('../files/real-world/file-list');

describe('Real-world tests', function() {
  'use strict';

  beforeEach(function() {
    // Some of these APIs are REALLY big, so increase the timeout threshold.
    var timeout = 4000;

    // Increase the timeout thresholds when running on Travis CI,
    // because Travis is SO. FREAKING. SLOW.
    if (env.isTravisCI) {
      timeout *= 3;
    }

    this.currentTest.timeout(timeout);
    this.currentTest.slow(timeout);
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
