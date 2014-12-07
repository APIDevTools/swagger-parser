describe('Dereferencing tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should not dereference shorthand pointers if "dereferencePointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), {dereferencePointers: false}, function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.shorthandRefs);
          done();
        });
      }
    );

    it('should dereference shorthand "definition" references',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.shorthandRefs);

          done();
        });
      }
    );

    it('should not dereference external pointers if "dereferenceExternalPointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), {dereferenceExternalPointers: false}, function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.externalRefs);
          done();
        });
      }
    );

    it('should dereference external pointers',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.externalRefs);
          done();
        });
      }
    );

    it('should not dereference anything if "dereferencePointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), {dereferencePointers: false}, function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.refs);
          done();
        });
      }
    );

    it('should dereference all types of references',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.refs);
          done();
        });
      }
    );

    it('should dereference nested references',
      function(done) {
        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.nestedRefs);
          done();
        });
      }
    );

    it('identical shorthand references should resolve to the same object instance',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger) {
          // Two $ref pointers to "pet"
          var petParameter = swagger.paths['/pets'].post.parameters[0].schema;
          var petResponse = swagger.paths['/pets'].post.responses['200'].schema;

          // Both pointers should point to the swagger.definitions.pet object
          expect(petParameter).to.equal(swagger.definitions.pet);
          expect(petResponse).to.equal(swagger.definitions.pet);

          done();
        });
      }
    );

    it('identical external references should resolve to the same object instance',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger) {
          // Two $ref pointers to "http://./pet.yaml"
          var petParameter = swagger.paths['/pets'].post.parameters[0].schema;
          var petResponse = swagger.paths['/pets'].post.responses['200'].schema;

          // The same object instance should be used to resolve both pointers
          expect(petParameter).to.equal(petResponse);

          // There is no "definitions" object, because the definitions are external
          expect(swagger.definitions).to.be.undefined;

          done();
        });
      }
    );

    it('different references to the same object should resolve to the same object instance',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger) {
          // $ref pointer to "#/definitions/pet"
          var petParameter = swagger.paths['/pets'].post.parameters[0].schema;

          // $ref pointer to "pet"
          var petResponse = swagger.paths['/pets'].post.responses['200'].schema;

          // Both pointers should point to the swagger.definitions.pet object
          expect(petParameter).to.equal(swagger.definitions.pet);
          expect(petResponse).to.equal(swagger.definitions.pet);

          done();
        });
      }
    );

    it('nested references to the same object should resolve to the same object instance',
      function(done) {
        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger) {
          // $ref pointer to "pet"
          var petParameter = swagger.paths['/pets'].post.parameters[0].schema;

          // $ref pointer to "#/definitions/pet"
          var petResponse = swagger.paths['/pets'].post.responses['200'].schema;

          // nested $ref pointer to "pet" via "error"
          var error404Pet = swagger.paths['/pets'].post.responses['404'].schema.properties.pet;

          // nested $ref pointer to "pet" via "errorWrapper" and "#/definitions/error"
          var error500Pet = swagger.paths['/pets'].post.responses['500'].schema.properties.error.properties.pet;

          // nested $ref pointer to "pet" via "#/definitions/error"
          var errorPet = swagger.definitions.error.properties.pet;

          // All pet pointers should point to the swagger.definitions.pet object
          expect(petParameter).to.equal(swagger.definitions.pet);
          expect(petResponse).to.equal(swagger.definitions.pet);
          expect(error404Pet).to.equal(swagger.definitions.pet);
          expect(error500Pet).to.equal(swagger.definitions.pet);
          expect(errorPet).to.equal(swagger.definitions.pet);

          // $ref pointer to "error"
          var error404 = swagger.paths['/pets'].post.responses['404'].schema;

          // $ref pointer to "#/definitions/error" via "errorWrapper"
          var error500 = swagger.paths['/pets'].post.responses['500'].schema.properties.error;

          // $ref pointer to "#/definitions/error"
          var error = swagger.definitions.errorWrapper.properties.error;

          // All error pointers should point to the swagger.definitions.error object
          expect(error404).to.equal(swagger.definitions.error);
          expect(error500).to.equal(swagger.definitions.error);
          expect(error).to.equal(swagger.definitions.error);

          done();
        });
      }
    );
  });


  describe('Failure tests', function() {
    it('should return an error for an invalid shorthand "definition" reference',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid-shorthand-refs.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('The path "doesnotexist" could not be found in the Swagger file');
          expect(swagger).to.be.undefined;

          done();
        });
      }
    );

    it('should return an error for an invalid document-relative reference',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid-internal-refs.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('The path "#/definitions/doesnotexist" could not be found in the Swagger file');
          expect(swagger).to.be.undefined;

          done();
        });
      }
    );

    it('should return an error for an invalid external reference',
      function(done) {
        env.parser.parse(env.files.getPath('bad/invalid-external-refs.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('An error occurred while downloading JSON data from http://../doesnotexist.yaml');
          expect(swagger).to.be.undefined;

          done();
        });
      }
    );
  });

});
