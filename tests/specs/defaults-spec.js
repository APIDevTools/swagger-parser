require('../test-environment.js');

describe('env.parser.defaults tests', function() {
    'use strict';

    afterEach(function() {
        // Reset defaults
        env.parser.defaults.parseYaml = true;
    });


    it('should be initialized with the default values',
        function() {
            expect(env.parser.defaults).to.deep.equal({
                parseYaml: true,
                resolve$Refs: true,
                resolveExternal$Refs: true,
                dereference$Refs: true,
                validateSchema: true
            });
        }
    );

    it('should use modified defaults when parsing',
        function(done) {
            // Disable YAML parsing by default
            env.parser.defaults.parseYaml = false;

            // Which means this call should fail
            env.parser.parse(env.getPath('minimal.yaml'), function(err, api, metadata) {
                expect(err).to.be.an.instanceOf(SyntaxError);
                expect(err.message).to.contain('Error parsing file');
                expect(api).to.be.null;
                expect(metadata).to.satisfy(env.isMetadata);

                done();
            });
        }
    );

    it.only('should override defaults with options when parsing',
        function(done) {
            // Disable YAML parsing by default
            env.parser.defaults.parseYaml = false;

            // Enable YAML parsing in the parse options
            var options = {parseYaml: true};

            // This call should succeed, because options override defaults
            env.parser.parse(env.getPath('minimal.yaml'), options, function(err, api) {
                if (err) return done(err);
                expect(api).to.be.an('object');

                done();
            });
        }
    );

});
