require('../test-environment.js');

describe('SwaggerParser.parse tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should parse a YAML file',
      function(done) {
        SwaggerParser.parse(env.getPath('good/minimal.yaml'), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.minimal);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should parse a JSON file',
      function(done) {
        SwaggerParser.parse(env.getPath('good/minimal.json'), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.minimal);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should parse a file with special characters in the path',
      function(done) {
        if (env.isGitHub) {
          // Skip this test when running on GitHub Pages.
          // The gh-pages server doesn't like these special characters and returns a 404
          done();
          return;
        }

        var swaggerFilePath = '__({[ ! % & $ # @ ` ~ ,)}]__/__({[ ! % & $ # @ ` ~ ,)}]__.yaml';
        if (env.isBrowser) {
          swaggerFilePath = '__({[ ! % & $ # @ ` ~ ,)}]__/__({[ ! % & $ # @ ` ~ ,)}]__-web.yaml';
        }

        SwaggerParser.parse(env.getPath(swaggerFilePath), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.specialCharacters);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('can be called with a String object',
      function(done) {
        //noinspection JSPrimitiveTypeWrapperUsage
        SwaggerParser.parse(new String(env.getPath('good/minimal.yaml')), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.minimal);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('can be called with an already-parsed object (without references)',
      function(done) {
        SwaggerParser.parse(env.dereferenced.petStore, function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.petStore);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('can be called with an already-parsed object (with references)',
      function(done) {
        SwaggerParser.parse(env.resolved.nestedRefs, function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.nestedRefs);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('can be called with an already-dereferenced object',
      function(done) {
        SwaggerParser.parse(env.dereferenced.refs, function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.refs);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('can parse multiple files simultaneously',
      function(done) {
        var counter = 0;

        SwaggerParser.parse(env.getPath('good/shorthand-refs.yaml'), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.shorthandRefs);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          if (++counter === 3) {
            done();
          }
        });

        SwaggerParser.parse(env.getPath('good/minimal.json'), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.minimal);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          if (++counter === 3) {
            done();
          }
        });

        SwaggerParser.parse(env.getPath('good/nested-refs.yaml'), function(err, api, parser) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.nestedRefs);
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          if (++counter === 3) {
            done();
          }
        });
      }
    );

  });

  describe('Failure tests', function() {
    it('should throw an error if called with no params',
      function() {
        expect(env.call(SwaggerParser.parse)).to.throw(/A callback function must be provided/);
      }
    );

    it('should throw an error if called with only a file path',
      function() {
        expect(env.call(SwaggerParser.parse, 'foo')).to.throw(/A callback function must be provided/);
      }
    );

    it('should throw an error if called with only an object',
      function() {
        expect(env.call(SwaggerParser.parse, env.resolved.minimal)).to.throw(/A callback function must be provided/);
      }
    );

    it('should throw an error if called with only a callback',
      function() {
        expect(env.call(SwaggerParser.parse, env.noop)).to.throw(/A callback function must be provided/);
      }
    );

    it('should throw an error if called with only a file path and an options object',
      function() {
        expect(env.call(SwaggerParser.parse, 'foo', {parseYaml: true})).to.throw(/A callback function must be provided/);
      }
    );

    it('should throw an error if the filename is blank',
      function() {
        expect(env.call(SwaggerParser.parse, '')).to.throw(/A callback function must be provided/);
      }
    );

    it('should throw an error if the filename is a blank String object',
      function() {
        //noinspection JSPrimitiveTypeWrapperUsage
        expect(env.call(SwaggerParser.parse, new String())).to.throw(/A callback function must be provided/);
      }
    );

    it('should return an error if called with only an options object and a callback',
      function(done) {
        SwaggerParser.parse({parseYaml: true}, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('[object Object] is not a Swagger API, or is malformed');
          expect(api).to.deep.equal({parseYaml: true});
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if an invalid file is given',
      function(done) {
        SwaggerParser.parse(env.getPath('good/nonexistent-file.json'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/Error opening file|Error downloading file/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if an invalid URL is given',
      function(done) {
        SwaggerParser.parse('http://nonexistent-server.com/nonexistent-file.json', function(err, api, parser) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/Error downloading file|Error parsing file|nonexistent-file.json is not a Swagger API/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if an already-parsed object contains external refs that cannot be resolved',
      function(done) {
        SwaggerParser.parse(env.resolved.refs, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.match(/Error opening file|Error downloading file/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a YAML file is given and YAML is disabled',
      function(done) {
        SwaggerParser.parse(env.getPath('good/minimal.yaml'), {parseYaml: false}, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a JSON file is given and JSON is disabled',
      function(done) {
        SwaggerParser.parse(env.getPath('good/minimal.json'), {parse: false}, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if the file is blank (YAML parser)',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/blank.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.match(/Parsed value is empty|HTTP 204: No Content/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if the file is blank (JSON parser)',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/blank.yaml'), {parseYaml: false}, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.match(/Error parsing file|HTTP 204: No Content/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if the Swagger version is too old',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/old-version.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Unsupported Swagger version: 1.2');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if the Swagger version is too new',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/newer-version.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Unsupported Swagger version: 3');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if the Swagger version is a number',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/numeric-version.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Swagger version number must be a string (e.g. "2.0") not a number');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if the API version is a number',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/numeric-info-version.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('API version number must be a string (e.g. "1.0.0") not a number');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a YAML file is malformed',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/malformed.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a JSON file is malformed',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/malformed.json'), {parseYaml: false}, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Error parsing file');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if an external reference uses an invalid host',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/invalid-external-host.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/Error downloading file|URI malformed|malformed URI|URI error|URIError/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

          SwaggerParser.parse(env.getPath('good/mock-url.yaml'), function(err, api, parser) {
            if (err) {
              return done(err);
            }
            expect(api).to.deep.equal(env.dereferenced.mockUrl);
            expect(parser).to.be.an.instanceOf(SwaggerParser);
            done();
          });
        }
      );

      it('should return an error if an HTTP 204 error occurs',
        function(done) {
          mockHttpResponse(204);

          SwaggerParser.parse(MOCK_URL, function(err, api, parser) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.contain('HTTP 204: No Content');
            expect(api).to.be.null;
            expect(parser).to.be.an.instanceOf(SwaggerParser);
            done();
          });
        }
      );

      it('should return an error if an HTTP 4XX error occurs',
        function(done) {
          mockHttpResponse(404);

          SwaggerParser.parse(MOCK_URL, function(err, api, parser) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.contain('HTTP ERROR 404');
            expect(api).to.be.null;
            expect(parser).to.be.an.instanceOf(SwaggerParser);
            done();
          });
        }
      );

      it('should return an error if an HTTP 5XX error occurs',
        function(done) {
          mockHttpResponse(500);

          SwaggerParser.parse(MOCK_URL, function(err, api, parser) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.contain('HTTP ERROR 500');
            expect(api).to.be.null;
            expect(parser).to.be.an.instanceOf(SwaggerParser);
            done();
          });
        }
      );

      it('should return an error if the response is invalid JSON or YAML',
        function(done) {
          mockHttpResponse(200, ':');

          SwaggerParser.parse(MOCK_URL, function(err, api, parser) {
            expect(err).to.be.an.instanceOf(SyntaxError);
            expect(err.message).to.contain('Error parsing file');
            expect(api).to.be.null;
            expect(parser).to.be.an.instanceOf(SwaggerParser);
            done();
          });
        }
      );
    }
  });

});
