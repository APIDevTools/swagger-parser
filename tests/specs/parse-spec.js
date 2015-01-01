require('../test-environment.js');

describe('env.parser.parse tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should parse a YAML file',
      function(done) {
        env.parser.parse(env.files.getPath('minimal.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.minimal);
          done();
        });
      }
    );

    it('should parse a JSON file',
      function(done) {
        env.parser.parse(env.files.getPath('minimal.json'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.minimal);
          done();
        });
      }
    );

    it('should ignore Swagger schema violations when "validateSpec" is false',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid.yaml'), {validateSpec: false}, function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.invalid);
          expect(swagger.paths['/users'].get.responses).to.have.property('helloworld').that.is.an('object');
          done();
        });
      }
    );

    it('should parse multiple files simultaneously',
      function(done) {
        var counter = 0;

        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.dereferenced.shorthandRefs);
          if (++counter === 3) done();
        });

        env.parser.parse(env.files.getPath('minimal.json'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.minimal);
          if (++counter === 3) done();
        });

        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.dereferenced.nestedRefs);
          if (++counter === 3) done();
        });
      }
    );

    it('should return metadata as the third parameter to the callback',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);
          expect(metadata).to.be.an('object');
          expect(metadata.baseDir).to.equal(env.files.getAbsolutePath(''));
          expect(metadata.resolvedPointers).to.be.an('object');
          expect(metadata).not.to.have.property('state');
          expect(metadata).not.to.have.property('swagger');

          if (env.isBrowser) {
            expect(metadata.files).to.have.lengthOf(0);
            expect(metadata.urls).to.have.lengthOf(3);
            expect(metadata.urls[0].href).to.equal(env.files.getAbsolutePath('external-refs.yaml'));
            expect(metadata.urls[1].href).to.equal(env.files.getAbsolutePath('error.json'));
            expect(metadata.urls[2].href).to.equal(env.files.getAbsolutePath('pet.yaml'));
          }
          else {
            expect(metadata.urls).to.have.lengthOf(0);
            expect(metadata.files).to.have.lengthOf(3);
            expect(metadata.files[0]).to.equal(env.files.getAbsolutePath('external-refs.yaml'));
            expect(metadata.files[1]).to.equal(env.files.getAbsolutePath('error.json'));
            expect(metadata.files[2]).to.equal(env.files.getAbsolutePath('pet.yaml'));
          }

          done();
        });
      }
    );

    it('should return different metadata objects when parsing multiple files simultaneously',
      function(done) {
        var metadatas = [];

        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);
          metadatas.push(metadata);
          compareStates();
        });

        env.parser.parse(env.files.getPath('minimal.json'), function(err, swagger, metadata) {
          if (err) return done(err);
          metadatas.push(metadata);
          compareStates();
        });

        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);
          metadatas.push(metadata);
          compareStates();
        });

        function compareStates() {
          if (metadatas.length === 3) {
            expect(metadatas[0]).not.to.equal(metadatas[1]);
            expect(metadatas[0]).not.to.equal(metadatas[2]);
            expect(metadatas[1]).not.to.equal(metadatas[2]);
            done();
          }
        }
      }
    );

  });


  describe('Failure tests', function() {
    it('should throw an error if called with no params',
      function() {
        expect(env.call(env.parser.parse)).to.throw(/A callback function must be provided/);
      }
    );

    it('should return an error if an invalid file is given',
      function(done) {
        env.parser.parse(env.files.getPath('nonexistent-file.json'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/Error opening file|Error downloading file/);
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if an invalid URL is given',
      function(done) {
        env.parser.parse('http://nonexistent-server.com/nonexistent-file.json', function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/Error downloading file|Error parsing file/);
          expect(swagger).to.be.undefined;

          done();
        });
      }
    );

    it('should return an error if a YAML file is given and YAML is disabled',
      function(done) {
        env.parser.parse(env.files.getPath('minimal.yaml'), {parseYaml: false}, function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the file is blank (YAML parser)',
      function(done) {
        env.parser.parse(env.files.getPath('bad/blank.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Parsed value is empty');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the file is blank (JSON parser)',
      function(done) {
        env.parser.parse(env.files.getPath('bad/blank.yaml'), {parseYaml: false}, function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the Swagger version is too old',
      function(done) {
        env.parser.parse(env.files.getPath('bad/old-version.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Unsupported Swagger version: 1.2');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the Swagger version is too new',
      function(done) {
        env.parser.parse(env.files.getPath('bad/newer-version.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Unsupported Swagger version: 3');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if a YAML file is malformed',
      function(done) {
        env.parser.parse(env.files.getPath('bad/malformed.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if a JSON file is malformed',
      function(done) {
        env.parser.parse(env.files.getPath('bad/malformed.json'), {parseYaml: false}, function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the file does not comply with the Swagger schema',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Additional properties not allowed');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if an external reference uses an invalid protocol',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid-external-protocol.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('The path "abc://google.com" could not be found in the Swagger file');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if an external reference uses an invalid host',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid-external-host.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('URI');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );


    // TODO: Find an XHR mock that works with Browserify's "http" module, so we can run these tests in browsers too
    if (env.isNode) {

      describe('Mock HTTP tests', function() {
        var MOCK_URL = 'http://mock/path/to/swagger.yaml';

        function mockHttpResponse(responseCode, response) {
          var nock = require('nock');
          nock('http://mock').get('/path/to/swagger.yaml').reply(responseCode, response);
        }

        it('should return an error if an HTTP 4XX error occurs',
          function(done) {
            mockHttpResponse(404);

            env.parser.parse(MOCK_URL, function(err, swagger) {
              expect(err).to.be.an.instanceOf(Error);
              expect(err.message).to.contain('HTTP ERROR 404');
              expect(swagger).to.be.undefined;
              done();
            });
          }
        );

        it('should return an error if an HTTP 5XX error occurs',
          function(done) {
            mockHttpResponse(500);

            env.parser.parse(MOCK_URL, function(err, swagger) {
              expect(err).to.be.an.instanceOf(Error);
              expect(err.message).to.contain('HTTP ERROR 500');
              expect(swagger).to.be.undefined;
              done();
            });
          }
        );

        it('should return an error if the response is invalid JSON or YAML',
          function(done) {
            mockHttpResponse(200, ':');

            env.parser.parse(MOCK_URL, function(err, swagger) {
              expect(err).to.be.an.instanceOf(SyntaxError);
              expect(err.message).to.contain('Error parsing file');
              expect(swagger).to.be.undefined;
              done();
            });
          }
        );
      });

    }

  });
});
