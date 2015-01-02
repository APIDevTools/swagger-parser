require('../test-environment.js');

describe('Dereferencing tests', function() {
    'use strict';

    describe('Success tests', function() {
        it('should not dereference shorthand pointers if "resolve$Refs" is false',
            function(done) {
                env.parser.parse(env.files.getPath('shorthand-refs.yaml'), {resolve$Refs: false}, function(err, swagger) {
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

        it('should not dereference external pointers if "resolveExternal$Refs" is false',
            function(done) {
                env.parser.parse(env.files.getPath('external-refs.yaml'), {resolveExternal$Refs: false}, function(err, swagger) {
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

        it('should not dereference anything if "resolve$Refs" is false',
            function(done) {
                env.parser.parse(env.files.getPath('refs.yaml'), {resolve$Refs: false}, function(err, swagger) {
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

        it('should dereference internal references in external files',
            function(done) {
                env.parser.parse(env.files.getPath('external-backrefs.yaml'), function(err, swagger) {
                    if (err) return done(err);
                    expect(swagger).to.deep.equal(env.files.dereferenced.externalBackRefs);
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
                    var $ref1 = swagger.paths['/pets'].post.parameters[0].schema;
                    var $ref2 = swagger.paths['/pets'].post.responses['200'].schema;

                    // Both pointers should point to the swagger.definitions.pet object
                    expect($ref1).to.equal(swagger.definitions.pet);
                    expect($ref2).to.equal(swagger.definitions.pet);
                    expect(swagger.definitions.pet).to.deep.equal(env.files.dereferenced.pet);

                    done();
                });
            }
        );

        it('identical external references should resolve to the same object instance',
            function(done) {
                env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger) {
                    // Three $ref pointers to "./pet.yaml"
                    var $ref1 = swagger.paths['/pets'].post.parameters[0].schema;
                    var $ref2 = swagger.paths['/pets'].post.responses['200'].schema;
                    var $ref3 = swagger.paths['/pets'].post.responses.default.schema.properties.pet;

                    // The same object instance should be used to resolve all pointers
                    expect($ref1).to.equal($ref2);
                    expect($ref1).to.equal($ref3);
                    expect($ref1).to.deep.equal(env.files.dereferenced.pet);

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
                    var $ref1 = swagger.paths['/pets'].post.parameters[0].schema;

                    // $ref pointer to "pet"
                    var $ref2 = swagger.paths['/pets'].post.responses['200'].schema;

                    // $ref pointer to "pet.yaml"
                    var $ref3 = swagger.paths['/pets'].post.responses['500'].schema.properties.pet;

                    // $ref pointer to "#/paths//pets/post/responses/200/schema"
                    var $ref4 = swagger.paths['/pets'].post.responses.default.schema;

                    // All pointers should point to the swagger.definitions.pet object
                    expect($ref1).to.equal(swagger.definitions.pet);
                    expect($ref2).to.equal(swagger.definitions.pet);
                    expect($ref3).to.equal(swagger.definitions.pet);
                    expect($ref4).to.equal(swagger.definitions.pet);
                    expect(swagger.definitions.pet).to.deep.equal(env.files.dereferenced.pet);

                    done();
                });
            }
        );

        it('different external references with the same value should resolve to different object instances',
            function(done) {
                env.parser.parse(env.files.getPath('different-file-ext.yaml'), function(err, swagger) {
                    // $ref pointer to "pet.yaml"
                    var $ref1 = swagger.paths['/pets'].post.parameters[0].schema;

                    // $ref pointer to "pet.json"
                    var $ref2 = swagger.paths['/pets'].post.responses['200'].schema;

                    // $ref pointer to "pet.yml"
                    var $ref3 = swagger.paths['/pets'].post.responses.default.schema;

                    // All pointers should have the same value
                    expect($ref1).to.deep.equal(env.files.dereferenced.pet);
                    expect($ref2).to.deep.equal(env.files.dereferenced.pet);
                    expect($ref3).to.deep.equal(env.files.dereferenced.pet);

                    // But they should all reference different object instances
                    expect($ref1).not.to.equal($ref2);
                    expect($ref1).not.to.equal($ref3);
                    expect($ref2).not.to.equal($ref3);

                    done();
                });
            }
        );

        it('nested references to the same object should resolve to the same object instance',
            function(done) {
                env.parser.parse(env.files.getPath('nested-refs.yaml'), function(err, swagger) {
                    // $ref pointer to "pet"
                    var $ref1 = swagger.paths['/pets'].post.parameters[0].schema;

                    // $ref pointer to "#/definitions/pet"
                    var $ref2 = swagger.paths['/pets'].post.responses['200'].schema;

                    // nested $ref pointer to "pet" via "error"
                    var $ref3 = swagger.paths['/pets'].post.responses['404'].schema.properties.pet;

                    // nested $ref pointer to "pet" via "errorWrapper" and "#/definitions/error"
                    var $ref4 = swagger.paths['/pets'].post.responses['500'].schema.properties.error.properties.pet;

                    // nested $ref pointer to "pet" via "#/definitions/error"
                    var $ref5 = swagger.definitions.error.properties.pet;

                    // All pet pointers should point to the swagger.definitions.pet object
                    expect($ref1).to.equal(swagger.definitions.pet);
                    expect($ref2).to.equal(swagger.definitions.pet);
                    expect($ref3).to.equal(swagger.definitions.pet);
                    expect($ref4).to.equal(swagger.definitions.pet);
                    expect($ref5).to.equal(swagger.definitions.pet);
                    expect(swagger.definitions.pet).to.deep.equal(env.files.dereferenced.pet);

                    // $ref pointer to "error"
                    var $ref6 = swagger.paths['/pets'].post.responses['404'].schema;

                    // $ref pointer to "#/definitions/error" via "errorWrapper"
                    var $ref7 = swagger.paths['/pets'].post.responses['500'].schema.properties.error;

                    // $ref pointer to "#/definitions/error"
                    var $ref8 = swagger.definitions.errorWrapper.properties.error;

                    // All error pointers should point to the swagger.definitions.error object
                    expect($ref6).to.equal(swagger.definitions.error);
                    expect($ref7).to.equal(swagger.definitions.error);
                    expect($ref8).to.equal(swagger.definitions.error);

                    done();
                });
            }
        );

        it('references to the same non-object should resolve to the same instance',
            function(done) {
                env.parser.parse(env.files.getPath('non-object-refs.yaml'), function(err, swagger) {
                    // Two $ref pointers to "#/definitions/pet/properties/type/enum" (an array)
                    var $ref1 = swagger.paths['/pets'].post.parameters[0].schema.properties.type.enum;
                    var $ref2 = swagger.paths['/pets'].post.responses.default.schema.properties.message.enum;

                    expect($ref1).to.be.an('array');
                    expect($ref2).to.be.an('array');

                    // The same object instance should be used to resolve both pointers
                    expect($ref1).to.equal(swagger.definitions.pet.properties.type.enum);
                    expect($ref2).to.equal(swagger.definitions.pet.properties.type.enum);
                    expect(swagger.definitions.pet.properties.type.enum).to.have.members(['cat', 'dog', 'bird']);


                    done();
                });
            }
        );

        it('multiple references to an external $ref should only parse the file once',
            function(done) {
                env.parser.parse(env.files.getPath('refs.yaml'), function(err, swagger, metadata) {
                    if (err) return done(err);

                    var paths;
                    if (env.isBrowser) {
                        expect(metadata.files).to.have.lengthOf(0);
                        paths = metadata.urls.map(function(url) { return url.href; });
                    }
                    else {
                        expect(metadata.urls).to.have.lengthOf(0);
                        paths = metadata.files;
                    }

                    expect(paths).to.have.same.members([
                        env.files.getAbsolutePath('refs.yaml'),
                        env.files.getAbsolutePath('error.json'),
                        env.files.getAbsolutePath('pet.yaml')
                    ]);

                    done();
                });
            }
        );

        it('multiple references to an external file should only parse the file once',
            function(done) {
                env.parser.parse(env.files.getPath('external-refs.yaml'), function(err, swagger, metadata) {
                    if (err) return done(err);

                    var paths;
                    if (env.isBrowser) {
                        expect(metadata.files).to.have.lengthOf(0);
                        paths = metadata.urls.map(function(url) { return url.href; });
                    }
                    else {
                        expect(metadata.urls).to.have.lengthOf(0);
                        paths = metadata.files;
                    }

                    expect(paths).to.have.same.members([
                        env.files.getAbsolutePath('external-refs.yaml'),
                        env.files.getAbsolutePath('error.json'),
                        env.files.getAbsolutePath('pet.yaml')
                    ]);

                    done();
                });
            }
        );

        it('multiple references and back-references among external files should only parse each file once',
            function(done) {
                env.parser.parse(env.files.getPath('external-backrefs.yaml'), function(err, swagger, metadata) {
                    if (err) return done(err);

                    var paths;
                    if (env.isBrowser) {
                        expect(metadata.files).to.have.lengthOf(0);
                        paths = metadata.urls.map(function(url) { return url.href; });
                    }
                    else {
                        expect(metadata.urls).to.have.lengthOf(0);
                        paths = metadata.files;
                    }

                    expect(paths).to.have.same.members([
                        env.files.getAbsolutePath('external-backrefs.yaml'),
                        env.files.getAbsolutePath('external-backrefs-path.yml'),
                        env.files.getAbsolutePath('error-backref.yml')
                    ]);

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
                    expect(err.message).to.contain('"doesnotexist" could not be found');
                    expect(swagger).to.be.undefined;

                    done();
                });
            }
        );

        it('should return an error for an invalid document-relative reference',
            function(done) {
                env.parser.parse(env.files.getPath('bad/invalid-internal-refs.yaml'), function(err, swagger) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('"#/definitions/doesnotexist" could not be found');
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

        it('should return an error for an invalid nested reference',
            function(done) {
                env.parser.parse(env.files.getPath('bad/invalid-nested-ref.yaml'), function(err, swagger) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('"doesnotexist" could not be found');
                    expect(swagger).to.be.undefined;

                    done();
                });
            }
        );

        it('should return an error for an invalid nested object',
            function(done) {
                env.parser.parse(env.files.getPath('bad/invalid-nested-obj.yaml'), function(err, swagger) {
                    expect(err).to.be.an.instanceOf(SyntaxError);
                    expect(err.message).to.contain('"foobar" could not be found');
                    expect(swagger).to.be.undefined;

                    done();
                });
            }
        );

    });

});
