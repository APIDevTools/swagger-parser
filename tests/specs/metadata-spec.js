require('../test-environment.js');

describe('Metadata tests', function() {
  'use strict';

  it('should return metadata as the third parameter to the callback',
    function(done) {
      env.parser.parse(env.getPath('good/external-refs.yaml'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        expect(metadata.baseDir).to.equal(env.getAbsolutePath('good/'));
        expect(metadata.$refs).to.be.an('object');

        if (env.isBrowser) {
          expect(metadata.files).to.have.lengthOf(0);
          expect(metadata.urls).to.have.lengthOf(6);
          expect(metadata.urls[0].href).to.equal(env.getAbsolutePath('good/external-refs.yaml'));
          expect(metadata.urls[1].href).to.equal(env.getAbsolutePath('good/error.json'));
          expect(metadata.urls[2].href).to.equal(env.getAbsolutePath('good/pet.yaml'));
          expect(metadata.urls[3].href).to.equal(env.getAbsolutePath('good/image.gif'));
          expect(metadata.urls[4].href).to.equal(env.getAbsolutePath('good/text.txt'));
          expect(metadata.urls[5].href).to.equal(env.getAbsolutePath('good/pet'));
        }
        else {
          expect(metadata.urls).to.have.lengthOf(0);
          expect(metadata.files).to.have.lengthOf(6);
          expect(metadata.files[0]).to.equal(env.getAbsolutePath('good/external-refs.yaml'));
          expect(metadata.files[1]).to.equal(env.getAbsolutePath('good/error.json'));
          expect(metadata.files[2]).to.equal(env.getAbsolutePath('good/pet.yaml'));
          expect(metadata.files[3]).to.equal(env.getAbsolutePath('good/image.gif'));
          expect(metadata.files[4]).to.equal(env.getAbsolutePath('good/text.txt'));
          expect(metadata.files[5]).to.equal(env.getAbsolutePath('good/pet'));
        }

        done();
      });
    }
  );

  it('should return different metadata objects when parsing multiple files simultaneously',
    function(done) {
      var metadatas = [];

      env.parser.parse(env.getPath('good/shorthand-refs.yaml'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);
        metadatas.push(metadata);
        compareStates();
      });

      env.parser.parse(env.getPath('good/minimal.json'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);
        metadatas.push(metadata);
        compareStates();
      });

      env.parser.parse(env.getPath('good/nested-refs.yaml'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);
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

  it('should return resolved external pointers in metadata',
    function(done) {
      env.parser.parse(env.getPath('good/external-refs.yaml'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // "pet.yaml" is referenced several different ways.
        // There should be a pointer for each one, plus one with the absolute path.
        var $ref1 = metadata.$refs['pet.yaml'];
        var $ref2 = metadata.$refs['./pet.yaml'];
        var $ref3 = metadata.$refs['../../files/good/pet.yaml'];
        var $ref4 = metadata.$refs[env.getAbsolutePath('good/pet.yaml')];

        // All of them should be references to the same object instance
        expect($ref1).to.equal($ref2);
        expect($ref2).to.equal($ref3);
        expect($ref3).to.equal($ref4);

        // And all of them should be fully dereferenced
        expect($ref1).to.deep.equal(env.dereferenced.pet);

        // "pet" (no file extension) is only referenced one way, but there should also be a pointer with the absolute path.
        var $ref5 = metadata.$refs['./pet'];
        var $ref6 = metadata.$refs[env.getAbsolutePath('good/pet')];

        // All of them should be references to the same object instance
        expect($ref5).to.equal($ref6);

        // And all of them should be fully dereferenced
        expect($ref5).to.deep.equal(env.dereferenced.pet);

        // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
        var $ref7 = metadata.$refs['error.json'];
        var $ref8 = metadata.$refs[env.getAbsolutePath('good/error.json')];

        // All of them should be references to the same object instance
        expect($ref7).to.equal($ref8);

        // And all of them should be fully dereferenced
        expect($ref7).to.deep.equal(env.dereferenced.error);

        // "text.txt" is only referenced one way, but there should also be a pointer with the absolute path.
        var $ref9 = metadata.$refs['text.txt'];
        var $ref10 = metadata.$refs[env.getAbsolutePath('good/text.txt')];

        // They should both be references to the same Buffer
        if (env.isNode) {
          expect($ref9).to.be.an.instanceOf(Buffer);
          expect($ref10).to.be.an.instanceOf(Buffer);
        }
        else {
          expect($ref9).to.be.a('string');
          expect($ref10).to.be.a('string');
        }
        expect($ref9).to.equal($ref10);

        // "image.gif" is only referenced one way, but there should also be a pointer with the absolute path.
        var $ref11 = metadata.$refs['image.gif'];
        var $ref12 = metadata.$refs[env.getAbsolutePath('good/image.gif')];

        // They should both be references to the same Buffer
        if (env.isNode) {
          expect($ref11).to.be.an.instanceOf(Buffer);
          expect($ref12).to.be.an.instanceOf(Buffer);
        }
        else {
          expect($ref11).to.be.a('string');
          expect($ref12).to.be.a('string');
        }
        expect($ref11).to.equal($ref12);

        // And there shouldn't be any other pointers
        expect(Object.keys(metadata.$refs)).to.have.lengthOf(12);

        done();
      });
    }
  );

  it('should return resolved internal and external pointers in metadata',
    function(done) {
      env.parser.parse(env.getPath('good/refs.yaml'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // "pet.yaml" is referenced several different ways.
        // There should be a pointer for each one, plus one with the absolute path.
        var $ref1 = metadata.$refs.pet;
        var $ref2 = metadata.$refs['#/definitions/pet'];
        var $ref3 = metadata.$refs['pet.yaml'];
        var $ref4 = metadata.$refs['../../files/good/pet.yaml'];
        var $ref5 = metadata.$refs['#/paths//pets/post/responses/200/schema'];
        var $ref6 = metadata.$refs[env.getAbsolutePath('good/pet.yaml')];

        // All of them should be references to the same object instance
        expect($ref1).to.equal($ref2);
        expect($ref2).to.equal($ref3);
        expect($ref3).to.equal($ref4);
        expect($ref4).to.equal($ref5);
        expect($ref5).to.equal($ref6);

        // And all of them should be fully dereferenced
        expect($ref1).to.deep.equal(env.dereferenced.pet);

        // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
        var $ref7 = metadata.$refs['./error.json'];
        var $ref8 = metadata.$refs[env.getAbsolutePath('good/error.json')];

        // Both of them should be references to the same object instance
        expect($ref7).to.equal($ref8);

        // And both of them should be fully dereferenced
        expect($ref7).to.deep.equal(env.dereferenced.error);

        // And there shouldn't be any other pointers
        expect(Object.keys(metadata.$refs)).to.have.lengthOf(8);

        done();
      });
    }
  );

  it('should return resolved but not dereferenced pointers when "dereference$Refs" is false',
    function(done) {
      env.parser.parse(env.getPath('good/refs.yaml'), {dereference$Refs: false}, function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // "pet.yaml" is referenced several different ways.
        // There should be a pointer for each one, plus one with the absolute path.
        var $ref1 = metadata.$refs.pet;
        var $ref2 = metadata.$refs['#/definitions/pet'];
        var $ref3 = metadata.$refs['pet.yaml'];
        var $ref4 = metadata.$refs['../../files/good/pet.yaml'];
        var $ref5 = metadata.$refs['#/paths//pets/post/responses/200/schema'];
        var $ref6 = metadata.$refs[env.getAbsolutePath('good/pet.yaml')];

        // All of them should be references to the same object instance
        expect($ref1).to.equal($ref2);
        expect($ref2).to.equal($ref3);
        expect($ref3).to.equal($ref4);
        expect($ref4).to.equal($ref5);
        expect($ref5).to.equal($ref6);

        // And all of them should be resolved but NOT dereferenced
        expect($ref1).to.deep.equal(env.dereferenced.pet); // pet.yaml has no $refs

        // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
        var $ref7 = metadata.$refs['./error.json'];
        var $ref8 = metadata.$refs[env.getAbsolutePath('good/error.json')];

        // Both of them should be references to the same object instance
        expect($ref7).to.equal($ref8);

        // And both of them should be resolved but NOT dereferenced
        expect($ref7).to.deep.equal(env.resolved.errorExternal);

        // And there shouldn't be any other pointers
        expect(Object.keys(metadata.$refs)).to.have.lengthOf(8);

        done();
      });
    }
  );

  it('should not return resolved pointers in metadata when "resolve$Refs" is false',
    function(done) {
      env.parser.parse(env.getPath('good/refs.yaml'), {resolve$Refs: false}, function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // there shouldn't be any resolved pointers
        expect(Object.keys(metadata.$refs)).to.have.lengthOf(0);

        done();
      });
    }
  );

  it('should return resolved backref pointers in metadata',
    function(done) {
      env.parser.parse(env.getPath('good/external-backrefs.yaml'), function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // "pet" is referenced via shorthand and document-relative pointers.
        // Both of them should be references to the same object instance, and should be fully dereferenced
        expect(metadata.$refs.pet).to.equal(metadata.$refs['#/definitions/pet']);
        expect(metadata.$refs.pet).to.deep.equal(env.dereferenced.pet);

        // "error" is only referenced via shorthand, but there should also be a pointer with the normalized path.
        expect(metadata.$refs.error).to.equal(metadata.$refs['#/definitions/error']);
        expect(metadata.$refs.error).to.deep.equal(env.dereferenced.errorBackref);

        // There's also a reference to the pet.enum array. It should be the same object instance.
        expect(metadata.$refs['#/definitions/pet/properties/type/enum']).to.equal(metadata.$refs.pet.properties.type.enum);

        // These should be all the pointers
        expect(Object.keys(metadata.$refs)).to.have.same.members([
          'pet',
          '#/definitions/pet',
          'error',
          '#/definitions/error',
          '#/definitions/pet/properties/type/enum',
          'error-backref.yml',
          'external-backrefs-path.yml',
          env.getAbsolutePath('good/error-backref.yml'),
          env.getAbsolutePath('good/external-backrefs-path.yml')
        ]);

        done();
      });
    }
  );

  it('should return resolved non-external pointers in metadata when "resolveExternal$Refs" is false',
    function(done) {
      env.parser.parse(env.getPath('good/refs.yaml'), {resolveExternal$Refs: false}, function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // "pet" is referenced several different ways, but only three of them are internal.
        // The external references should not get resolved, and thus should not be in the metadata.
        // There should also NOT be a reference for the absolute path to "pet.yaml", since that's also external.
        var $ref1 = metadata.$refs.pet;
        var $ref2 = metadata.$refs['#/definitions/pet'];
        var $ref3 = metadata.$refs['#/paths//pets/post/responses/200/schema'];

        // All of them should be references to the same object instance
        expect($ref1).to.equal($ref2);
        expect($ref2).to.equal($ref3);

        // They should all resolve to the same object, but the definition is external, so it's NOT dereferenced
        expect($ref1).to.deep.equal(env.resolved.petExternal);

        // "error.yaml" is only referenced externally, so it doesn't get resolved and is not in the metadata.
        expect(Object.keys(metadata.$refs)).to.have.lengthOf(3);

        done();
      });
    }
  );

  it('should return resolved internal and external pointers in metadata for an already-parsed object',
    function(done) {
      env.parser.parse(env.resolved.nestedRefs, function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // Since there was no Swagger file, the "files" and "urls" arrays should both be empty
        expect(metadata.files).to.have.lengthOf(0);
        expect(metadata.urls).to.have.lengthOf(0);

        // "pet" is referenced via shorthand and document-relative pointers.
        // Both of them should be references to the same object instance, and should be fully dereferenced
        expect(metadata.$refs.pet).to.equal(metadata.$refs['#/definitions/pet']);
        expect(metadata.$refs.pet).to.deep.equal(env.dereferenced.pet);

        // "error" is referenced via shorthand and document-relative pointers.
        // Both of them should be references to the same object instance, and should be fully dereferenced
        expect(metadata.$refs.error).to.equal(metadata.$refs['#/definitions/error']);
        expect(metadata.$refs.error).to.deep.equal(env.dereferenced.error);

        // "errorWrapper" is only referenced via shorthand, but there should also be a pointer with the normalized path.
        expect(metadata.$refs.errorWrapper).to.equal(metadata.$refs['#/definitions/errorWrapper']);
        expect(metadata.$refs.errorWrapper).to.deep.equal(env.dereferenced.errorWrapper);

        // These should be all the pointers
        expect(Object.keys(metadata.$refs)).to.have.same.members([
          'pet',
          '#/definitions/pet',
          'error',
          '#/definitions/error',
          'errorWrapper',
          '#/definitions/errorWrapper'
        ]);

        done();
      });
    }
  );

  it('should not return any resolved pointers in metadata for an already-dereferenced object',
    function(done) {
      env.parser.parse(env.dereferenced.refs, function(err, api, metadata) {
        if (err) {
          return done(err);
        }
        expect(metadata).to.satisfy(env.isMetadata);

        // Since there was no Swagger file, the "files" and "urls" arrays should both be empty
        expect(metadata.files).to.have.lengthOf(0);
        expect(metadata.urls).to.have.lengthOf(0);

        // Since the object was already dereferenced, there should be no resolved pointers
        expect(metadata.$refs).to.deep.equal({});

        done();
      });
    }
  );

});
