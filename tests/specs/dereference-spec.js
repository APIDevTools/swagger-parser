require('../test-environment.js');

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

    it('should dereference non-object references',
      function(done) {
        env.parser.parse(env.files.getPath('non-object-refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.nonObjectRefs);

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
          expect(swagger.definitions.pet).to.deep.equal(env.files.parsed.pet);

          done();
        });
      }
    );

    it('identical external references should resolve to the same object instance',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger) {
          // Three $ref pointers to "./pet.yaml"
          var petParameter = swagger.paths['/pets'].post.parameters[0].schema;
          var petResponse = swagger.paths['/pets'].post.responses['200'].schema;
          var petError = swagger.paths['/pets'].post.responses.default.schema.properties.pet;

          // The same object instance should be used to resolve both pointers
          expect(petParameter).to.equal(petResponse);
          expect(petParameter).to.equal(petError);
          expect(petParameter).to.deep.equal(env.files.parsed.pet);

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

          // $ref pointer to "./pet.yaml"
          var petError = swagger.paths['/pets'].post.responses.default.schema.properties.pet;

          // Both pointers should point to the swagger.definitions.pet object
          expect(petParameter).to.equal(swagger.definitions.pet);
          expect(petResponse).to.equal(swagger.definitions.pet);
          expect(petError).to.equal(swagger.definitions.pet);
          expect(swagger.definitions.pet).to.deep.equal(env.files.parsed.pet);

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
          expect(swagger.definitions.pet).to.deep.equal(env.files.parsed.pet);

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

    it('references to the same non-object should resolve to the same instance',
      function(done) {
        env.parser.parse(env.files.getPath('non-object-refs.yaml'), function(err, swagger) {
          // Two $ref pointers to "#/definitions/pet/properties/type/enum" (an array)
          var enumPointer1 = swagger.paths['/pets'].post.parameters[0].schema.properties.type.enum;
          var enumPointer2 = swagger.paths['/pets'].post.responses.default.schema.properties.message.enum;

          // The same object instance should be used to resolve both pointers
          expect(enumPointer1).to.equal(swagger.definitions.pet.properties.type.enum);
          expect(enumPointer2).to.equal(swagger.definitions.pet.properties.type.enum);
          expect(swagger.definitions.pet.properties.type.enum).to.have.members(['cat', 'dog', 'bird']);


          done();
        });
      }
    );

    it('multiple references to an external $ref should only parse the file once',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger, state) {
          expect(err).to.be.null;

          if (env.isBrowser) {
            expect(state.files).to.have.lengthOf(0);
            expect(state.urls).to.have.lengthOf(3);
            expect(state.urls[0].pathname).to.contain('refs.yaml');
            expect(state.urls[1].pathname).to.contain('pet.yaml');
            expect(state.urls[2].pathname).to.contain('error.yaml');
          }
          else {
            expect(state.urls).to.have.lengthOf(0);
            expect(state.files).to.have.lengthOf(3);
            expect(state.files[0]).to.contain('refs.yaml');
            expect(state.files[1]).to.contain('pet.yaml');
            expect(state.files[2]).to.contain('error.yaml');
          }

          done();
        });
      }
    );

    it('multiple references to an external file should only parse the file once',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, state) {
          expect(err).to.be.null;

          if (env.isBrowser) {
            expect(state.files).to.have.lengthOf(0);
            expect(state.urls).to.have.lengthOf(3);
            expect(state.urls[0].pathname).to.contain('refs.yaml');
            expect(state.urls[1].pathname).to.contain('error.yaml');
            expect(state.urls[2].pathname).to.contain('pet.yaml');
          }
          else {
            expect(state.urls).to.have.lengthOf(0);
            expect(state.files).to.have.lengthOf(3);
            expect(state.files[0]).to.contain('refs.yaml');
            expect(state.files[1]).to.contain('error.yaml');
            expect(state.files[2]).to.contain('pet.yaml');
          }

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
          expect(err.message).to.match(/ENOENT|Error downloading file ".*doesnotexist\.yaml"/);
          expect(swagger).to.be.undefined;

          done();
        });
      }
    );

    it('should return an error for an empty reference',
      function(done) {
        env.parser.parse(env.files.getPath('bad/empty-refs.yaml'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Empty $ref pointer');
          expect(swagger).to.be.undefined;

          done();
        });
      }
    );

  });

});
