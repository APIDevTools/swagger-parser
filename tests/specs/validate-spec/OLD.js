
describe.skip('Validation tests', function() {
  'use strict';

  describe('Parameter validation', function() {

    it('should return an error if a path template contains two {placeholders} with the same name',
      function(done) {
        petStore.paths['/pets/{petName}/photos/{id}/{petName}'] = petStore.paths['/pets/{petName}/photos/{id}'];

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/{id}/{petName}/get has multiple path placeholders named {petName}');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a path parameter is not required',
      function(done) {
        petStore.paths['/pets/{petName}/photos/{id}'].parameters[0].required = false;

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a path parameter\'s "required" property isn\'t set',
      function(done) {
        var param = petStore.paths['/pets/{petName}/photos/{id}'].parameters[0];
        delete param.required;

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: Path parameters cannot be optional. Set required=true for the "petName" parameter at /paths/pets/{petName}/photos/{id}/get');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a body parameter\'s type is an invalid type',
      function(done) {
        petStore.paths['/pets'].post.parameters[0].schema = {
          type: 'foobar'
        };

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/post has an invalid body parameter type (foobar)');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a body parameter\'s type is invalid for a body parameter',
      function(done) {
        petStore.paths['/pets'].post.parameters[0].schema = {
          type: 'file'
        };

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/post has an invalid body parameter type (file)');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a formData parameter\'s type is an invalid primitive type',
      function(done) {
        petStore.paths['/pets/{petName}/photos'].post.parameters.push({
          name: 'foo',
          in: 'formData',
          type: 'foobar'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should not return an error if a formData parameter\'s type is "file"',
      function(done) {
        petStore.paths['/pets/{petName}/photos'].post.parameters.push({
          name: 'foo',
          in: 'formData',
          type: 'file'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          // No error, because the "file" type is allowed for "formData" params
          if (err) {
            return done(err);
          }
          expect(metadata).to.satisfy(env.isMetadata);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should return an error if a query parameter\'s type is an invalid primitive type',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'query',
          type: 'foobar'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a query parameter\'s type is "file"',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'query',
          type: 'file'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a query parameter\'s type is not a primitive type',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'query',
          type: 'object'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a file parameter doesn\'t consume multipart/form-data or application/x-www-form-urlencoded',
      function(done) {
        delete petStore.paths['/pets/{petName}/photos'].post.consumes;

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should not return an error if a file parameter consumes application/x-www-form-urlencoded',
      function(done) {
        petStore.paths['/pets/{petName}/photos'].post.consumes = ['text/plain', 'application/x-www-form-urlencoded', 'application/json'];

        env.parser.parse(petStore, function(err, api, metadata) {
          // No error, because the "consumes" contains application/x-www-form-urlencoded
          if (err) {
            return done(err);
          }
          expect(metadata).to.satisfy(env.isMetadata);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should return an error if an array parameter does not have "items"',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'query',
          type: 'array'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: The "foo" query parameter at /paths/pets/get is an array, so it must include an "items" schema');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if an array body parameter does not have "items"',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'body',
          schema: {
            type: 'array'
          }
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: The "foo" body parameter at /paths/pets/get is an array, so it must include an "items" schema');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should not return an error if an array body parameter does have "items"',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'body',
          schema: {
            type: 'array',
            items: {}
          }
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          // No error, because the array has an "items" schema
          if (err) {
            return done(err);
          }
          expect(metadata).to.satisfy(env.isMetadata);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should return an error if a header parameter has a collectionFormat of "multi"',
      function(done) {
        petStore.paths['/pets'].get.parameters.push({
          name: 'foo',
          in: 'header',
          type: 'array',
          items: {},
          collectionFormat: 'multi'
        });

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );
  });

  describe('Response validation', function() {
    it('should return an error if a response header is an invalid type',
      function(done) {
        petStore.paths['/pets'].get.responses.default.headers['last-modified'].type = 'foobar';

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a response header is not a primitive type',
      function(done) {
        petStore.paths['/pets'].get.responses.default.headers['last-modified'].type = 'object';

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should return an error if a response schema is an invalid type',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {type: 'foobar'};

        env.parser.parse(petStore, function(err, api, metadata) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/get/responses/default has an invalid response schema type (foobar)');
          expect(api).to.be.null;
          expect(metadata).to.satisfy(env.isMetadata);
          done();
        });
      }
    );

    it('should not return an error if a response schema type is "file"',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {type: 'file'};

        env.parser.parse(petStore, function(err, api, metadata) {
          // No error, because the "file" type is allowed for JSON Schema responses
          if (err) {
            return done(err);
          }
          expect(metadata).to.satisfy(env.isMetadata);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should not return an error if a response schema type is null',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {type: 'null'};

        env.parser.parse(petStore, function(err, api, metadata) {
          // No error, because the "null" type is allowed for JSON Schemas
          if (err) {
            return done(err);
          }
          expect(metadata).to.satisfy(env.isMetadata);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should not return an error if a response schema is empty',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {};

        env.parser.parse(petStore, function(err, api, metadata) {
          // No error, because an undefined type is allowed for JSON Schemas
          if (err) {
            return done(err);
          }
          expect(metadata).to.satisfy(env.isMetadata);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );
  })
});
