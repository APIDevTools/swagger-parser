require('../test-environment');
require('../files/real-world/file-list');

describe('Real-world tests', function() {
    'use strict';

    if (!env.realWorldFiles || env.realWorldFiles.length === 0) {
        throw new Error('Unable to initialize real-world tests. Check the "/tests/files/real-world" directory.');
    }

    env.realWorldFiles.forEach(function(file, index) {
        it((index + 1) + ') ' + file,
            function(done) {
                // Some of these APIs are REALLY big, so increase the timeouts
                this.timeout(6000); 
                this.slow(3000);

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
