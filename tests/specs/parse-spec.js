require('../test-environment.js');

describe('env.parser.parse tests', function() {
    'use strict';

    describe('Success tests', function() {
        it('should parse a YAML file',
            function(done) {
                env.parser.parse(env.getPath('good/minimal.yaml'), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.resolved.minimal);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should parse a JSON file',
            function(done) {
                env.parser.parse(env.getPath('good/minimal.json'), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.resolved.minimal);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should parse a file with special characters in the path',
            function(done) {
                var swaggerFilePath = '__({[ ! % & $ # @ ` ~ ,)}]__/__({[ ! % & $ # @ ` ~ ,)}]__.yaml';
                if (env.isBrowser) {
                    swaggerFilePath = '__({[ ! % & $ # @ ` ~ ,)}]__/__({[ ! % & $ # @ ` ~ ,)}]__-web.yaml';
                }

                env.parser.parse(env.getPath(swaggerFilePath), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.dereferenced.specialCharacters);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('can be called with a String object',
            function(done) {
                //noinspection JSPrimitiveTypeWrapperUsage
                env.parser.parse(new String(env.getPath('good/minimal.yaml')), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.resolved.minimal);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('can be called with an already-parsed object (without references)',
            function(done) {
                this.slow(1000);
                env.parser.parse(env.resolved.noRefs, function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.resolved.noRefs);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('can be called with an already-parsed object (with references)',
            function(done) {
                env.parser.parse(env.resolved.nestedRefs, function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.dereferenced.nestedRefs);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('can be called with an already-dereferenced object',
            function(done) {
                env.parser.parse(env.dereferenced.refs, function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.dereferenced.refs);
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should ignore Swagger schema violations when "validateSchema" is false',
            function(done) {
                env.parser.parse(env.getPath('bad/invalid.yaml'), {validateSchema: false}, function(err, api, metadata) {
                    if (err) return done(err);
                    expect(metadata).to.satisfy(env.isMetadata);
                    expect(api).to.deep.equal(env.resolved.invalid);
                    expect(api.paths['/users'].get.responses).to.have.property('helloworld').that.is.an('object');
                    done();
                });
            }
        );

        it('can parse multiple files simultaneously',
            function(done) {
                var counter = 0;

                env.parser.parse(env.getPath('good/shorthand-refs.yaml'), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.dereferenced.shorthandRefs);
                    expect(metadata).to.satisfy(env.isMetadata);
                    if (++counter === 3) done();
                });

                env.parser.parse(env.getPath('good/minimal.json'), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.resolved.minimal);
                    expect(metadata).to.satisfy(env.isMetadata);
                    if (++counter === 3) done();
                });

                env.parser.parse(env.getPath('good/nested-refs.yaml'), function(err, api, metadata) {
                    if (err) return done(err);
                    expect(api).to.deep.equal(env.dereferenced.nestedRefs);
                    expect(metadata).to.satisfy(env.isMetadata);
                    if (++counter === 3) done();
                });
            }
        );

    });


    describe('Failure tests', function() {
        it('should throw an error if called with no params',
            function() {
                expect(env.call(env.parser.parse)).to.throw(/Expected a Swagger file or object/);
            }
        );

        it('should throw an error if called with only a file path',
            function() {
                expect(env.call(env.parser.parse, 'foo')).to.throw(/A callback function must be provided/);
            }
        );

        it('should throw an error if called with only an object',
            function() {
                expect(env.call(env.parser.parse, env.resolved.minimal)).to.throw(/A callback function must be provided/);
            }
        );

        it('should throw an error if called with only a callback',
            function() {
                expect(env.call(env.parser.parse, env.noop)).to.throw(/Expected a Swagger file or object/);
            }
        );

        it('should throw an error if called with only a file path and an options object',
            function() {
                expect(env.call(env.parser.parse, 'foo', {parseYaml: true})).to.throw(/A callback function must be provided/);
            }
        );

        it('should throw an error if the filename is blank',
            function() {
                expect(env.call(env.parser.parse, '')).to.throw(/Expected a Swagger file or object/);
            }
        );

        it('should throw an error if the filename is a blank String object',
            function() {
                //noinspection JSPrimitiveTypeWrapperUsage
                expect(env.call(env.parser.parse, new String())).to.throw(/Expected a Swagger file or object/);
            }
        );

        it('should return an error if called with only an options object and a callback',
            function(done) {
                env.parser.parse({parseYaml: true}, function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.contain('The object is not a valid Swagger API definition');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if an invalid file is given',
            function(done) {
                env.parser.parse(env.getPath('good/nonexistent-file.json'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.match(/Error opening file|Error downloading file/);
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if an invalid URL is given',
            function(done) {
                env.parser.parse('http://nonexistent-server.com/nonexistent-file.json', function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.match(/Error downloading file|Error parsing file|The object is not a valid Swagger API definition/);
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if an already-parsed object contains external refs that cannot be resolved',
            function(done) {
                env.parser.parse(env.resolved.refs, function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.match(/Error opening file|Error downloading file/);
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if a YAML file is given and YAML is disabled',
            function(done) {
                env.parser.parse(env.getPath('good/minimal.yaml'), {parseYaml: false}, function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Error parsing file');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the file is blank (YAML parser)',
            function(done) {
                env.parser.parse(env.getPath('bad/blank.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.match(/Parsed value is empty|HTTP 204: No Content/);
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the file is blank (JSON parser)',
            function(done) {
                env.parser.parse(env.getPath('bad/blank.yaml'), {parseYaml: false}, function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.match(/Unexpected end of input|HTTP 204: No Content/);
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the Swagger version is too old',
            function(done) {
                env.parser.parse(env.getPath('bad/old-version.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Unsupported Swagger version: 1.2');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the Swagger version is too new',
            function(done) {
                env.parser.parse(env.getPath('bad/newer-version.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Unsupported Swagger version: 3');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the Swagger version is a number',
            function(done) {
                env.parser.parse(env.getPath('bad/numeric-version.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Swagger version number must be a string (e.g. "2.0") not a number');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the API version is a number',
            function(done) {
                env.parser.parse(env.getPath('bad/numeric-info-version.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('API version number must be a string (e.g. "1.0.0") not a number');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if a YAML file is malformed',
            function(done) {
                env.parser.parse(env.getPath('bad/malformed.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Error parsing file');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if a JSON file is malformed',
            function(done) {
                env.parser.parse(env.getPath('bad/malformed.json'), {parseYaml: false}, function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Error parsing file');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if the file does not comply with the Swagger schema',
            function(done) {
                env.parser.parse(env.getPath('bad/invalid.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('Additional properties not allowed');
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

        it('should return an error if an external reference uses an invalid host',
            function(done) {
                env.parser.parse(env.getPath('bad/invalid-external-host.yaml'), function(err, api, metadata) {
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.match(/Error downloading file|URI malformed|malformed URI|URI error|URIError/);
                    expect(api).to.be.null;
                    expect(metadata).to.satisfy(env.isMetadata);
                    done();
                });
            }
        );

    });


    describe('Mock HTTP tests', function() {
        var MOCK_URL = 'http://mock/path/to/api.yaml';

        function mockHttpResponse(responseCode, response) {
            var nock = require('nock');
            nock('http://mock').get('/path/to/api.yaml').reply(responseCode, response);
        }

        // TODO: Find an XHR mock that works with Browserify's "http" module, so we can run these tests in browsers too
        if (env.isNode) {
            it('should parse an API that includes external $refs to remote URLs',
                function(done) {
                    mockHttpResponse(200, 'type: object');

                    env.parser.parse(env.getPath('good/mock-url.yaml'), function(err, api, metadata) {
                        if (err) return done(err);
                        expect(api).to.deep.equal(env.dereferenced.mockUrl);
                        expect(metadata).to.satisfy(env.isMetadata);
                        done();
                    });
                }
            );

            it('should return an error if an HTTP 204 error occurs',
                function(done) {
                    mockHttpResponse(204);

                    env.parser.parse(MOCK_URL, function(err, api, metadata) {
                        expect(err).to.be.an.instanceOf(Error);
                        expect(err.message).to.contain('HTTP 204: No Content');
                        expect(api).to.be.null;
                        expect(metadata).to.satisfy(env.isMetadata);
                        done();
                    });
                }
            );

            it('should return an error if an HTTP 4XX error occurs',
                function(done) {
                    mockHttpResponse(404);

                    env.parser.parse(MOCK_URL, function(err, api, metadata) {
                        expect(err).to.be.an.instanceOf(Error);
                        expect(err.message).to.contain('HTTP ERROR 404');
                        expect(api).to.be.null;
                        expect(metadata).to.satisfy(env.isMetadata);
                        done();
                    });
                }
            );

            it('should return an error if an HTTP 5XX error occurs',
                function(done) {
                    mockHttpResponse(500);

                    env.parser.parse(MOCK_URL, function(err, api, metadata) {
                        expect(err).to.be.an.instanceOf(Error);
                        expect(err.message).to.contain('HTTP ERROR 500');
                        expect(api).to.be.null;
                        expect(metadata).to.satisfy(env.isMetadata);
                        done();
                    });
                }
            );

            it('should return an error if the response is invalid JSON or YAML',
                function(done) {
                    mockHttpResponse(200, ':');

                    env.parser.parse(MOCK_URL, function(err, api, metadata) {
                        expect(err).to.be.an.instanceOf(SyntaxError);
                        expect(err.message).to.contain('Error parsing file');
                        expect(api).to.be.null;
                        expect(metadata).to.satisfy(env.isMetadata);
                        done();
                    });
                }
            );
        }
    });

});
