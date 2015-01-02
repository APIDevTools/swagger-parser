require('../test-environment.js');

describe('Metadata tests', function() {
    'use strict';

    it('should return metadata as the third parameter to the callback',
        function(done) {
            env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, metadata) {
                if (err) return done(err);
                expect(metadata).to.be.an('object');
                expect(Object.keys(metadata)).to.have.same.members(['baseDir', 'files', 'urls', '$refs']);

                expect(metadata.baseDir).to.equal(env.files.getAbsolutePath(''));
                expect(metadata.$refs).to.be.an('object');

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

    it('should return resolved external pointers in metadata',
        function(done) {
            env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, metadata) {
                if (err) return done(err);

                // "pet.yaml" is referenced several different ways.
                // There should be a pointer for each one, plus one with the absolute path.
                var $ref1 = metadata.$refs['pet.yaml'];
                var $ref2 = metadata.$refs['./pet.yaml'];
                var $ref3 = metadata.$refs['../files/pet.yaml'];
                var $ref4 = metadata.$refs[env.files.getAbsolutePath('pet.yaml')];

                // All of them should be references to the same object instance
                expect($ref1).to.equal($ref2);
                expect($ref2).to.equal($ref3);
                expect($ref3).to.equal($ref4);

                // And all of them should be fully dereferenced
                expect($ref1).to.deep.equal(env.files.dereferenced.pet);

                // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
                var $ref5 = metadata.$refs['error.json'];
                var $ref6 = metadata.$refs[env.files.getAbsolutePath('error.json')];

                // All of them should be references to the same object instance
                expect($ref5).to.equal($ref6);

                // And all of them should be fully dereferenced
                expect($ref5).to.deep.equal(env.files.dereferenced.error);

                // And there shouldn't be any other pointers
                expect(Object.keys(metadata.$refs)).to.have.lengthOf(6);

                done();
            });
        }
    );

    it('should return resolved internal and external pointers in metadata',
        function(done) {
            env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger, metadata) {
                if (err) return done(err);

                // "pet.yaml" is referenced several different ways.
                // There should be a pointer for each one, plus one with the absolute path.
                var $ref1 = metadata.$refs.pet;
                var $ref2 = metadata.$refs['#/definitions/pet'];
                var $ref3 = metadata.$refs['pet.yaml'];
                var $ref4 = metadata.$refs['../files/pet.yaml'];
                var $ref5 = metadata.$refs['#/paths//pets/post/responses/200/schema'];
                var $ref6 = metadata.$refs[env.files.getAbsolutePath('pet.yaml')];

                // All of them should be references to the same object instance
                expect($ref1).to.equal($ref2);
                expect($ref2).to.equal($ref3);
                expect($ref3).to.equal($ref4);
                expect($ref4).to.equal($ref5);
                expect($ref5).to.equal($ref6);

                // And all of them should be fully dereferenced
                expect($ref1).to.deep.equal(env.files.dereferenced.pet);

                // "error.yaml" is only referenced one way, but there should also be a pointer with the absolute path.
                var $ref7 = metadata.$refs['./error.json'];
                var $ref8 = metadata.$refs[env.files.getAbsolutePath('error.json')];

                // All of them should be references to the same object instance
                expect($ref7).to.equal($ref8);

                // And all of them should be fully dereferenced
                expect($ref7).to.deep.equal(env.files.dereferenced.error);

                // And there shouldn't be any other pointers
                expect(Object.keys(metadata.$refs)).to.have.lengthOf(8);

                done();
            });
        }
    );

    it('should return resolved backref pointers in metadata',
        function(done) {
            env.parser.parse(env.files.getPath('external-backrefs.yaml'), function(err, swagger, metadata) {
                if (err) return done(err);

                // "pet" is referenced via shorthand and document-relative pointers.
                // Both of them should be references to the same object instance, and should be fully dereferenced
                expect(metadata.$refs.pet).to.equal(metadata.$refs['#/definitions/pet']);
                expect(metadata.$refs.pet).to.deep.equal(env.files.dereferenced.pet);

                // "error" is only referenced via shorthand, but there should also be a pointer with the normalized path.
                expect(metadata.$refs.error).to.equal(metadata.$refs['#/definitions/error']);
                expect(metadata.$refs.error).to.deep.equal(env.files.dereferenced.errorBackref);

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
                    env.files.getAbsolutePath('error-backref.yml'),
                    env.files.getAbsolutePath('external-backrefs-path.yml')
                ]);

                done();
            });
        }
    );

    it('should return resolved non-external pointers in metadata when "resolveExternal$Refs" is false',
        function(done) {
            env.parser.parse(env.files.getPath('refs.yaml'), {resolveExternal$Refs: false}, function(err, swagger, metadata) {
                if (err) return done(err);

                // "pet" is referenced several different ways, but only three of them are internal.
                // The external references should not get resolved, and thus should not be in the metadata.
                // There should also NOT be a reference for the absolute path to "pet.yaml", since that's also external.
                var $ref1 = metadata.$refs.pet;
                var $ref2 = metadata.$refs['#/definitions/pet'];
                var $ref3 = metadata.$refs['#/paths//pets/post/responses/200/schema'];

                // All of them should be references to the same object instance
                expect($ref1).to.equal($ref2);
                expect($ref2).to.equal($ref3);

                // And all of them should be fully dereferenced
                expect($ref1).to.deep.equal(env.files.parsed.pet);

                // "error.yaml" is only referenced externally, so it doesn't get resolved and is not in the metadata.
                expect(Object.keys(metadata.$refs)).to.have.lengthOf(3);

                done();
            });
        }
    );

    it('should not return resolved pointers in metadata when "resolve$Refs" is false',
        function(done) {
            env.parser.parse(env.files.getPath('refs.yaml'), {resolve$Refs: false}, function(err, swagger, metadata) {
                if (err) return done(err);

                // there shouldn't be any resolved pointers
                expect(Object.keys(metadata.$refs)).to.have.lengthOf(0);

                done();
            });
        }
    );

});
