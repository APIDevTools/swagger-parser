require('../test-environment.js');

describe('Dereferencing tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should not dereference shorthand pointers if "dereferencePointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), {dereferencePointers: false}, function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.shorthandRefs);
          done();
        });
      }
    );

    it('should dereference shorthand "definition" references',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.dereferenced.shorthandRefs);

          done();
        });
      }
    );

    it('should not dereference external pointers if "dereferenceExternalPointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), {dereferenceExternalPointers: false}, function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.externalRefs);
          done();
        });
      }
    );

    it('should dereference external pointers',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.dereferenced.externalRefs);
          done();
        });
      }
    );

    it('should not dereference anything if "dereferencePointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), {dereferencePointers: false}, function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.parsed.refs);
          done();
        });
      }
    );

    it('should dereference all types of references',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.dereferenced.refs);
          done();
        });
      }
    );

    it('should dereference nested references',
      function(done) {
        env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger) {
          if (err) return done(err);
          expect(swagger).to.deep.equal(env.files.dereferenced.nestedRefs);
          done();
        });
      }
    );

    it('should dereference non-object references',
      function(done) {
        env.parser.parse(env.files.getPath('non-object-refs.yaml'), function(err, swagger) {
          if (err) return done(err);
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
          expect(swagger.definitions.pet).to.deep.equal(env.files.dereferenced.pet);

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
          expect(petParameter).to.deep.equal(env.files.dereferenced.pet);

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

          // $ref pointer to "pet.yaml"
          var petError = swagger.paths['/pets'].post.responses.default.schema.properties.pet;

          // All pointers should point to the swagger.definitions.pet object
          expect(petParameter).to.equal(swagger.definitions.pet);
          expect(petResponse).to.equal(swagger.definitions.pet);
          expect(petError).to.equal(swagger.definitions.pet);
          expect(swagger.definitions.pet).to.deep.equal(env.files.dereferenced.pet);

          done();
        });
      }
    );

    it('different external references with the same value should resolve to different object instances',
      function(done) {
        env.parser.parse(env.files.getPath('different-file-ext.yaml'), function(err, swagger) {
          // $ref pointer to "pet.yaml"
          var petParameter = swagger.paths['/pets'].post.parameters[0].schema;

          // $ref pointer to "pet.json"
          var pet200 = swagger.paths['/pets'].post.responses['200'].schema;

          // $ref pointer to "pet.yml"
          var petDefault = swagger.paths['/pets'].post.responses.default.schema;

          // All pointers should have the same value
          expect(petParameter).to.deep.equal(env.files.dereferenced.pet);
          expect(pet200).to.deep.equal(env.files.dereferenced.pet);
          expect(petDefault).to.deep.equal(env.files.dereferenced.pet);

          // But they should all reference different object instances
          expect(petParameter).not.to.equal(pet200);
          expect(petParameter).not.to.equal(petDefault);
          expect(pet200).not.to.equal(petDefault);

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
          expect(swagger.definitions.pet).to.deep.equal(env.files.dereferenced.pet);

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

          expect(enumPointer1).to.be.an('array');
          expect(enumPointer2).to.be.an('array');

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
        env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);

          if (env.isBrowser) {
            expect(metadata.files).to.have.lengthOf(0);
            expect(metadata.urls).to.have.lengthOf(3);
            expect(metadata.urls[0].href).to.equal(env.files.getAbsolutePath('refs.yaml'));
            expect(metadata.urls[1].href).to.equal(env.files.getAbsolutePath('pet.yaml'));
            expect(metadata.urls[2].href).to.equal(env.files.getAbsolutePath('error.json'));
          }
          else {
            expect(metadata.urls).to.have.lengthOf(0);
            expect(metadata.files).to.have.lengthOf(3);
            expect(metadata.files[0]).to.equal(env.files.getAbsolutePath('refs.yaml'));
            expect(metadata.files[1]).to.equal(env.files.getAbsolutePath('pet.yaml'));
            expect(metadata.files[2]).to.equal(env.files.getAbsolutePath('error.json'));
          }

          done();
        });
      }
    );

    it('multiple references to an external file should only parse the file once',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);

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

    it('should return resolved external pointers in metadata',
      function(done) {
        env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);
          var pointers = metadata.resolvedPointers;

          // "pet.yaml" is referenced several different ways.
          // There should be a pointer for each one, plus one with the absolute path.
          var pet1 = pointers['pet.yaml'];
          var pet2 = pointers['./pet.yaml'];
          var pet3 = pointers['../files/pet.yaml'];
          var pet4 = pointers[env.files.getAbsolutePath('pet.yaml')];

          // All of them should be references to the same object instance
          expect(pet1).to.equal(pet2);
          expect(pet2).to.equal(pet3);
          expect(pet3).to.equal(pet4);

          // And all of them should be fully dereferenced
          expect(pet1).to.deep.equal(env.files.dereferenced.pet);

          // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
          var error1 = pointers['error.json'];
          var error2 = pointers[env.files.getAbsolutePath('error.json')];

          // All of them should be references to the same object instance
          expect(error1).to.equal(error2);

          // And all of them should be fully dereferenced
          expect(error1).to.deep.equal(env.files.dereferenced.error);

          // And there shouldn't be any other pointers
          expect(Object.keys(pointers)).to.have.lengthOf(6);

          done();
        });
      }
    );

    it('should return resolved internal and external pointers in metadata',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger, metadata) {
          if (err) return done(err);
          var pointers = metadata.resolvedPointers;

          // "pet.yaml" is referenced several different ways.
          // There should be a pointer for each one, plus one with the absolute path.
          var pet1 = pointers.pet;
          var pet2 = pointers['#/definitions/pet'];
          var pet3 = pointers['pet.yaml'];
          var pet4 = pointers['../files/pet.yaml'];
          var pet5 = pointers[env.files.getAbsolutePath('pet.yaml')];

          // All of them should be references to the same object instance
          expect(pet1).to.equal(pet2);
          expect(pet2).to.equal(pet3);
          expect(pet3).to.equal(pet4);
          expect(pet4).to.equal(pet5);

          // And all of them should be fully dereferenced
          expect(pet1).to.deep.equal(env.files.dereferenced.pet);

          // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
          var error1 = pointers['./error.json'];
          var error2 = pointers[env.files.getAbsolutePath('error.json')];

          // All of them should be references to the same object instance
          expect(error1).to.equal(error2);

          // And all of them should be fully dereferenced
          expect(error1).to.deep.equal(env.files.dereferenced.error);

          // And there shouldn't be any other pointers
          expect(Object.keys(pointers)).to.have.lengthOf(7);

          done();
        });
      }
    );

    it('should return resolved non-external pointers in metadata when "dereferenceExternalPointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), {dereferenceExternalPointers: false}, function(err, swagger, metadata) {
          if (err) return done(err);
          var pointers = metadata.resolvedPointers;

          // "pet" is referenced several different ways, but only two of them are internal.
          // The external references should not get resolved, and thus should not be in the metadata.
          // There should also NOT be a reference for the absolute path to "pet.yaml", since that's also external.
          var pet1 = pointers.pet;
          var pet2 = pointers['#/definitions/pet'];

          // All of them should be references to the same object instance
          expect(pet1).to.equal(pet2);

          // And all of them should be fully dereferenced
          expect(pet1).to.deep.equal(env.files.parsed.pet);

          // "error.yaml" is only referenced externally, so it doesn't get resolved and is not in the metadata.
          expect(Object.keys(pointers)).to.have.lengthOf(2);

          done();
        });
      }
    );

    it('should not return resolved pointers in metadata when "dereferencePointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('refs.yaml'), {dereferencePointers: false}, function(err, swagger, metadata) {
          if (err) return done(err);

          // there shouldn't be any resolved pointers
          expect(Object.keys(metadata.resolvedPointers)).to.have.lengthOf(0);

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
