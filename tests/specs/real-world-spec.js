var fs   = require('fs'),
    path = require('path');

describe('Real-world tests', function() {
    'use strict';

    var testsCreated = 0;
    var currentDir = path.join(__dirname, '..', 'files', 'real-world');
    createTests(currentDir);

    if (testsCreated < 50) {
        // Something went wrong
        throw new Error('Unable to initialize real-world tests.  Perhaps the "/tests/files/real-world" directory is empty?');
    }

    /**
     * Creates unit tests for all Swagger files in the given directory and its sub-directories.
     * @param {string}  dir
     */
    function createTests(dir) {
        fs.readdirSync(dir).forEach(function(name) {
            var fullName = path.join(dir, name);
            var ext = path.extname(name);
            var stat = fs.statSync(fullName);

            if (stat.isFile() &&
                ['.json', '.yaml', '.yml'].indexOf(ext) >= 0) {
                // This is a Swagger file, so create a test
                createTest(fullName);
            }
            else if (stat.isDirectory()) {
                // Recursively process this sub-directories
                createTests(fullName);
            }
        });
    }

    /**
     * Creates a unit test for the given Swagger file.
     * @param {string} file
     */
    function createTest(file) {
        testsCreated++;
        it(testsCreated + ') ' + file,
            function(done) {
                this.timeout(5000); // Some of these APIs are REALLY big!

                env.parser.parse(file, function(err, api, metadata) {
                    if (err) {
                        expect(err).to.be.an.instanceOf(ReferenceError);
                        expect(err.message).to.contain('circular reference(s) detected')
                    }

                    expect(api).to.be.an('object');
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );
    }
});
