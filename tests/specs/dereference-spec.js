require('../test-environment.js');

describe('Dereferencing tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should not dereference shorthand pointers if "dereference$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/shorthand-refs.yaml'), {dereference$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.shorthandRefs);
          done();
        });
      }
    );

    it('should not dereference shorthand pointers if "dereferenceInternal$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/shorthand-refs.yaml'), {dereferenceInternal$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.shorthandRefs);
          done();
        });
      }
    );

    it('should dereference shorthand "definition" references',
      function(done) {
        SwaggerParser.parse(env.getPath('good/shorthand-refs.yaml'), function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.shorthandRefs);

          done();
        });
      }
    );

    it('should not dereference external pointers if "resolveExternal$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/external-refs.yaml'), {resolveExternal$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.externalRefs);
          done();
        });
      }
    );

    it('should dereference external pointers if "dereferenceInternal$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/external-refs.yaml'), {dereferenceInternal$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }

          if (env.isBrowser) {
            // Browsers differ in how they convert binary data to strings,
            // so we can't compare the exact data for the external image file
            var imageSchema = api.paths['/pets'].post.responses[500].schema;
            expect(imageSchema.example).to.be.a('string').and.not.empty;
            imageSchema.example = '';
          }

          expect(api).to.deep.equal(env.dereferenced.externalRefs);
          done();
        });
      }
    );

    it('should dereference external pointers',
      function(done) {
        SwaggerParser.dereference(env.getPath('good/external-refs.yaml'), function(err, api) {
          if (err) {
            return done(err);
          }

          if (env.isBrowser) {
            // Browsers differ in how they convert binary data to strings,
            // so we can't compare the exact data for the external image file
            var imageSchema = api.paths['/pets'].post.responses[500].schema;
            expect(imageSchema.example).to.be.a('string').and.not.empty;
            imageSchema.example = '';
          }

          expect(api).to.deep.equal(env.dereferenced.externalRefs);
          done();
        });
      }
    );

    it('should not dereference anything if "dereference$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/refs.yaml'), {dereference$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.resolved.refs);
          done();
        });
      }
    );

    it('should dereference all types of references',
      function(done) {
        SwaggerParser.parse(env.getPath('good/refs.yaml'), function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.refs);
          done();
        });
      }
    );

    it('should only dereference external references if "dereferenceInternal$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/refs.yaml'), {dereferenceInternal$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.external.refs);
          done();
        });
      }
    );

    it('should dereference nested references',
      function(done) {
        SwaggerParser.parse(env.getPath('good/nested-refs.yaml'), function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.nestedRefs);
          done();
        });
      }
    );

    it('should dereference internal references in external files',
      function(done) {
        SwaggerParser.parse(env.getPath('good/external-backrefs.yaml'), function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.externalBackRefs);
          done();
        });
      }
    );

    it('should not dereference internal references in external files if "dereferenceInternal$Refs" is false',
      function(done) {
        SwaggerParser.parse(env.getPath('good/external-backrefs.yaml'), {dereferenceInternal$Refs: false}, function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.external.externalBackRefs);
          done();
        });
      }
    );

    it('should dereference non-object references',
      function(done) {
        SwaggerParser.parse(env.getPath('good/non-object-refs.yaml'), function(err, api) {
          if (err) {
            return done(err);
          }
          expect(api).to.deep.equal(env.dereferenced.nonObjectRefs);

          done();
        });
      }
    );

    it('should partially-dereference circular references',
      function(done) {
        SwaggerParser.parse(env.getPath('good/circular-refs.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(ReferenceError);
          expect(err.message).to.equal('5 circular reference(s) detected');
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          // The API should be partially dereferenced
          // (only non-circular $refs are resolved)
          expect(api).to.deep.equal(env.dereferenced.circularRefs);

          // The metadata should contain the circular and non-circular $refs
          var $refs = {};
          $refs['person'] = $refs['#/definitions/person'] = env.dereferenced.circularRefsPerson;
          $refs['parent'] = $refs['#/definitions/parent'] = env.dereferenced.circularRefsParent;
          $refs['child'] = $refs['#/definitions/child'] = env.dereferenced.circularRefsChild;
          expect(parser.$refs).to.deep.equal($refs);

          done();
        });
      }
    );

    it('should ignore $refs that aren\'t strings',
      function(done) {
        SwaggerParser.parse(env.getPath('good/non-refs.yaml'), function(err, api, parser) {
          if (err) {
            return done(err);
          }

          expect(api).to.deep.equal(env.dereferenced.nonRefs);

          var $refs = {};
          $refs['$ref'] = $refs['#/definitions/$ref'] = env.dereferenced.nonRef;

          expect(parser).to.be.an.instanceOf(SwaggerParser);
          expect(parser.$refs).to.deep.equal($refs);

          done();
        });
      }
    );

    it('should dereference an already-parsed object',
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

    it('should have no effect on an already-dereferenced object',
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
  });

  describe('Reference-equality tests', function() {

    it('should resolve matching shorthand references to the same object instance',
      function(done) {
        SwaggerParser.parse(env.getPath('good/shorthand-refs.yaml'), function(err, api) {
          // Two $ref pointers to "pet"
          var $ref1 = api.paths['/pets'].post.parameters[0].schema;
          var $ref2 = api.paths['/pets'].post.responses['200'].schema;

          // The $refs should all point to the same object instance
          expect($ref1).to.equal(api.definitions.pet);
          expect($ref2).to.equal(api.definitions.pet);

          // The $refs should be fully dereferenced
          expect($ref1).to.deep.equal(env.dereferenced.pet);

          done();
        });
      }
    );

    it('should resolve different-but-matching references to the same object instance',
      function(done) {
        SwaggerParser.parse(env.getPath('good/refs.yaml'), function(err, api) {
          // $ref pointer to "pet"
          var $ref1 = api.paths['/pets'].post.responses['200'].schema;

          // $ref pointer to "#/definitions/pet"
          var $ref2 = api.paths['/pets'].post.parameters[0].schema;

          // $ref pointer to "pet" via "pet.yaml"
          var $ref3 = api.paths['/pets'].post.responses['500'].schema.properties.pet;

          // $ref pointer to "pet" via "#/paths//pets/post/responses/200/schema"
          var $ref4 = api.paths['/pets'].post.responses.default.schema;

          // The $refs should point to the same object instance
          expect($ref1).to.equal(api.definitions.pet);
          expect($ref2).to.equal(api.definitions.pet);
          expect($ref3).to.equal(api.definitions.pet);
          expect($ref4).to.equal(api.definitions.pet);

          // The $refs should be fully dereferenced
          expect(api.definitions.pet).to.deep.equal(env.dereferenced.pet);

          done();
        });
      }
    );

    it('should resolve matching external references to the same object instance',
      function(done) {
        SwaggerParser.parse(env.getPath('good/external-refs.yaml'), function(err, api) {
          // Three $ref pointers to "pet.yaml"
          var $ref1 = api.paths['/pets'].post.parameters[0].schema;
          var $ref2 = api.paths['/pets'].post.responses['200'].schema;
          var $ref3 = api.paths['/pets'].post.responses.default.schema.properties.pet;

          // The $refs should all point to the same object instance
          expect($ref1).to.equal($ref2);
          expect($ref3).to.equal($ref2);

          // The $refs should be fully dereferenced
          expect($ref1).to.deep.equal(env.dereferenced.pet);

          // There is no "definitions" object, because the definitions are external
          expect(api.definitions).to.be.undefined;

          done();
        });
      }
    );

    it('should resolve different external references to different object instances',
      function(done) {
        SwaggerParser.parse(env.getPath('good/different-file-ext.yaml'), function(err, api) {
          // $ref pointer to "pet.yaml"
          var $ref1 = api.paths['/pets'].post.parameters[0].schema;

          // $ref pointer to "pet.json"
          var $ref2 = api.paths['/pets'].post.responses['200'].schema;

          // $ref pointer to "pet.yml"
          var $ref3 = api.paths['/pets'].post.responses.default.schema;

          // The $refs should all reference different object instances
          expect($ref1).not.to.equal($ref2);
          expect($ref1).not.to.equal($ref3);
          expect($ref2).not.to.equal($ref3);

          // The $refs should all have the same value
          expect($ref1).to.deep.equal(env.dereferenced.pet);
          expect($ref2).to.deep.equal(env.dereferenced.pet);
          expect($ref3).to.deep.equal(env.dereferenced.pet);

          done();
        });
      }
    );

    it('should resolve matching nested references to the same object instance',
      function(done) {
        SwaggerParser.parse(env.getPath('good/nested-refs.yaml'), function(err, api) {
          // $ref pointer to "pet"
          var pet$Ref1 = api.paths['/pets'].post.parameters[0].schema;

          // $ref pointer to "#/definitions/pet"
          var pet$Ref2 = api.paths['/pets'].post.responses['200'].schema;

          // nested $ref pointer to "pet" via "error"
          var pet$Ref3 = api.paths['/pets'].post.responses['404'].schema.properties.pet;

          // nested $ref pointer to "pet" via "errorWrapper" and "#/definitions/error"
          var pet$Ref4 = api.paths['/pets'].post.responses['500'].schema.properties.error.properties.pet;

          // nested $ref pointer to "pet" via "#/definitions/error"
          var pet$Ref5 = api.definitions.error.properties.pet;

          // The "pet" $refs should all point to the same object instance
          expect(pet$Ref1).to.equal(api.definitions.pet);
          expect(pet$Ref2).to.equal(api.definitions.pet);
          expect(pet$Ref3).to.equal(api.definitions.pet);
          expect(pet$Ref4).to.equal(api.definitions.pet);
          expect(pet$Ref5).to.equal(api.definitions.pet);

          // $ref pointer to "error"
          var error$Ref1 = api.paths['/pets'].post.responses['404'].schema;

          // $ref pointer to "#/definitions/error" via "errorWrapper"
          var error$Ref2 = api.paths['/pets'].post.responses['500'].schema.properties.error;

          // $ref pointer to "#/definitions/error"
          var error$Ref3 = api.definitions.errorWrapper.properties.error;

          // The "error" $refs should all point to the same object instance
          expect(error$Ref1).to.equal(api.definitions.error);
          expect(error$Ref2).to.equal(api.definitions.error);
          expect(error$Ref3).to.equal(api.definitions.error);

          // The $refs should be fully dereferenced
          expect(api.definitions.pet).to.deep.equal(env.dereferenced.pet);
          expect(api.definitions.error).to.deep.equal(env.dereferenced.error);

          done();
        });
      }
    );

    it('should resolve array references to the same array instance',
      function(done) {
        SwaggerParser.parse(env.getPath('good/non-object-refs.yaml'), function(err, api) {
          // Two $ref pointers to "#/definitions/pet/properties/type/enum" (an array)
          var $ref1 = api.paths['/pets'].post.parameters[0].schema.properties.type.enum;
          var $ref2 = api.paths['/pets'].post.responses.default.schema.properties.message.enum;

          expect($ref1).to.be.an('array');
          expect($ref2).to.be.an('array');

          // The $refs should all point to the same object instance
          expect($ref1).to.equal(api.definitions.pet.properties.type.enum);
          expect($ref2).to.equal(api.definitions.pet.properties.type.enum);

          // The $refs should be fully dereferenced
          expect($ref1).to.have.members(['cat', 'dog', 'bird']);

          done();
        });
      }
    );
  });

  describe('Failure tests', function() {

    it('should return an error for an invalid shorthand "definition" reference',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/invalid-shorthand-refs.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('"doesnotexist" could not be found');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          done();
        });
      }
    );

    it('should return an error for an invalid document-relative reference',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/invalid-internal-refs.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('"#/definitions/doesnotexist" could not be found');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          done();
        });
      }
    );

    it('should return an error for an invalid external reference',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/invalid-external-refs.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.match(/ENOENT|Error downloading file ".*doesnotexist\.yaml"/);
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          done();
        });
      }
    );

    it('should return an error for an empty reference',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/empty-refs.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('Empty $ref pointer');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          done();
        });
      }
    );

    it('should return an error for an invalid nested reference',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/invalid-nested-ref.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('"doesnotexist" could not be found');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          done();
        });
      }
    );

    it('should return an error for an invalid nested object',
      function(done) {
        SwaggerParser.parse(env.getPath('bad/invalid-nested-obj.yaml'), function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.contain('"foobar" could not be found');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);

          done();
        });
      }
    );

  });

});
