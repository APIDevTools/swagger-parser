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
          expect(err.message).to.match(/Not Found/i);
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if an invalid URL is given',
      function(done) {
        env.parser.parse('http://nonexistent-server.com/nonexistent-file.json', function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('not a valid Swagger spec');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if a YAML file is given and YAML is disabled',
      function(done) {
        env.parser.parse(env.files.getPath('minimal.yaml'), {parseYaml: false}, function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(env.errorMessages.illegalCharacter);
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the file is blank (YAML parser)',
      function(done) {
        env.parser.parse(env.files.getPath('bad/blank.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('not a valid Swagger spec');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the file is blank (JSON parser)',
      function(done) {
        env.parser.parse(env.files.getPath('bad/blank.yaml'), {parseYaml: false}, function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/(Unexpected end of input|unexpected end of data|Unexpected EOF)/);
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the Swagger version is too old',
      function(done) {
        env.parser.parse(env.files.getPath('bad/old-version.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('Unsupported Swagger version: 1.2');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the Swagger version is too new',
      function(done) {
        env.parser.parse(env.files.getPath('bad/newer-version.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('Unsupported Swagger version: 3');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if a YAML file is malformed',
      function(done) {
        env.parser.parse(env.files.getPath('bad/malformed.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('JS-YAML');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if a JSON file is malformed',
      function(done) {
        env.parser.parse(env.files.getPath('bad/malformed.json'), {parseYaml: false}, function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(env.errorMessages.illegalCharacter);
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if the file does not comply with the Swagger schema',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('Additional properties not allowed');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );
  });

});
