require('../test-environment.js');

describe('env.parser.parse tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should parse a YAML file',
      function(done) {
        env.parser.parse(env.files.getPath('minimal.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.minimal);
          done();
        });
      }
    );

    it('should parse a JSON file',
      function(done) {
        env.parser.parse(env.files.getPath('minimal.json'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.minimal);
          done();
        });
      }
    );

    it('should ignore Swagger schema violations when "validateSpec" is false',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid.yaml'), {validateSpec: false}, function(err, swagger) {
          expect(err).to.be.null;
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
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.shorthandRefs);
          if (++counter === 3) done();
        });

        env.parser.parse(env.files.getPath('minimal.json'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.minimal);
          if (++counter === 3) done();
        });

        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.nestedRefs);
          if (++counter === 3) done();
        });
      }
    );

    it('should return the State object as the third parameter to the callback',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, state) {
          expect(err).to.be.null;
          expect(state).to.be.an('object');
          expect(state.options).to.deep.equal(env.parser.defaults);
          expect(state.swagger).to.deep.equal(env.files.dereferenced.externalRefs);

          if (env.isBrowser) {
            expect(state.files).to.have.lengthOf(0);
            expect(state.urls).to.have.lengthOf(3);
            expect(state.urls[0].pathname).to.contain('external-refs.yaml');
            expect(state.urls[1].pathname).to.contain('error.yaml');
            expect(state.urls[2].pathname).to.contain('pet.yaml');
          }
          else {
            expect(state.urls).to.have.lengthOf(0);
            expect(state.files).to.have.lengthOf(3);
            expect(state.files[0]).to.contain('external-refs.yaml');
            expect(state.files[1]).to.contain('error.yaml');
            expect(state.files[2]).to.contain('pet.yaml');
          }

          done();
        });
      }
    );

    it('should return different State objects when parsing multiple files simultaneously',
      function(done) {
        var states = [];

        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger, state) {
          expect(err).to.be.null;
          expect(state.swagger).to.deep.equal(env.files.dereferenced.shorthandRefs);
          states.push(state);
          compareStates();
        });

        env.parser.parse(env.files.getPath('minimal.json'), function(err, swagger, state) {
          expect(err).to.be.null;
          expect(state.swagger).to.deep.equal(env.files.parsed.minimal);
          states.push(state);
          compareStates();
        });

        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger, state) {
          expect(err).to.be.null;
          expect(state.swagger).to.deep.equal(env.files.dereferenced.nestedRefs);
          states.push(state);
          compareStates();
        });

        function compareStates() {
          if (states.length === 3) {
            expect(states[0]).not.to.equal(states[1]);
            expect(states[0]).not.to.equal(states[2]);
            expect(states[1]).not.to.equal(states[2]);
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
