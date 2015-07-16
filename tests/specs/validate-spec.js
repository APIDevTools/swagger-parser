require('../test-environment.js');

describe('Validation tests', function() {
  'use strict';

  var petStore;
  beforeEach(function() {
    petStore = env.cloneDeep(env.dereferenced.petStore);
  });

  it('should ignore Swagger schema violations when "validateSchema" is false',
    function(done) {
      // Add an invalid response code
      petStore.paths['/pets'].get.responses['foobar'] = petStore.paths['/pets'].get.responses['default'];

      SwaggerParser.parse(petStore, {validateSchema: false}, function(err, api, parser) {
        if (err) {
          return done(err);
        }
        expect(parser).to.be.an.instanceOf(SwaggerParser);
        expect(api).to.deep.equal(petStore);
        expect(api.paths['/pets'].get.responses).to.have.property('foobar').that.is.an('object');
        done();
      });
    }
  );

  it('should ignore strict validation violations when "strictValidation" is false',
    function(done) {
      // Duplicate parameters
      var param1 = petStore.paths['/pets'].get.parameters[0];
      petStore.paths['/pets'].get.parameters.splice(1, 0, {
        name: param1.name,
        in: param1.in,
        type: 'string',
        required: true
      });

      SwaggerParser.parse(petStore, {strictValidation: false}, function(err, api, parser) {
        if (err) {
          return done(err);
        }
        expect(parser).to.be.an.instanceOf(SwaggerParser);
        expect(api).to.deep.equal(petStore);
        expect(api.paths['/pets'].get.parameters[0]).to.have.property('name', param1.name);
        expect(api.paths['/pets'].get.parameters[1]).to.have.property('name', param1.name);
        expect(api.paths['/pets'].get.parameters[0]).to.have.property('in', param1.in);
        expect(api.paths['/pets'].get.parameters[1]).to.have.property('in', param1.in);
        done();
      });
    }
  );

  it('should return an error if an operation has an invalid response code',
    function(done) {
      petStore.paths['/pets'].get.responses['foobar'] = petStore.paths['/pets'].get.responses['default'];

      SwaggerParser.validate(petStore, function(err, api) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.contain('Additional properties not allowed');
        expect(api).to.be.null;
        done();
      });
    }
  );

  describe('Parameter validation', function() {
    it('should return an error if a path has duplicate parameters',
      function(done) {
        var param1 = petStore.paths['/pets/{petName}'].parameters[0];
        petStore.paths['/pets/{petName}'].parameters.push({
          name: param1.name,
          in: param1.in,
          type: 'string',
          required: true
        });

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName} has duplicate parameters \nSyntaxError: Found multiple path parameters named "petName"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if an operation has duplicate parameters',
      function(done) {
        var param1 = petStore.paths['/pets'].get.parameters[0];
        petStore.paths['/pets'].get.parameters.push({
          name: param1.name,
          in: param1.in,
          type: 'string',
          required: true
        });

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/get has duplicate parameters \nSyntaxError: Found multiple query parameters named "tags"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should not return an error if a path and an operation have duplicate parameters',
      function(done) {
        var pathParam = petStore.paths['/pets/{petName}'].parameters[0];
        petStore.paths['/pets/{petName}'].get.parameters = [
          {
            name: pathParam.name,
            in: pathParam.in,
            type: 'string',
            required: true
          }
        ];

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because the operation parameter just overrides the path parameter
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should return an error if an operation has multiple body parameters',
      function(done) {
        petStore.paths['/pets'].post.parameters.push({
          name: 'bodyParam2',
          in: 'body',
          schema: {}
        });

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/post has 2 body parameters. Only one is allowed.');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if an operation has body and formData params',
      function(done) {
        petStore.paths['/pets'].post.parameters.push({
          name: 'FormParam',
          in: 'formData',
          type: 'string'
        });

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/post has body parameters and formData parameters. Only one or the other is allowed.');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should not return an error if a body parameter\'s type is null',
      function(done) {
        petStore.paths['/pets'].post.parameters[0].schema = {
          type: 'null'
        };

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error because "null" is a valid JSON Schema type
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should return an error if there\'s no {placeholder} for a path parameter',
      function(done) {
        petStore.paths['/pets/{petName}/photos/{id}'].parameters.push({
          name: 'petAge',
          in: 'path',
          required: true,
          type: 'integer'
        });

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/{id}/get has a path parameter named "petAge", but there is no corresponding {petAge} in the path string');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if there\'s no path parameter for a {placeholder} in the path string',
      function(done) {
        petStore.paths['/pets/{petName}/photos/{id}'].parameters.splice(1, 1);

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/{id}/get is missing path parameter(s) for {id}');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if there\'s no path parameters for any {placeholders} in the path string',
      function(done) {
        var path = petStore.paths['/pets/{petName}/photos/{id}'];
        delete path.parameters;

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/{id}/get is missing path parameter(s) for {petName},{id}');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a path template contains two {placeholders} with the same name',
      function(done) {
        petStore.paths['/pets/{petName}/photos/{id}/{petName}'] = petStore.paths['/pets/{petName}/photos/{id}'];

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/{id}/{petName}/get has multiple path placeholders named {petName}');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a path parameter is not required',
      function(done) {
        petStore.paths['/pets/{petName}/photos/{id}'].parameters[0].required = false;

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a path parameter\'s "required" property isn\'t set',
      function(done) {
        var param = petStore.paths['/pets/{petName}/photos/{id}'].parameters[0];
        delete param.required;

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: Path parameters cannot be optional. Set required=true for the "petName" parameter at /paths/pets/{petName}/photos/{id}/get');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a body parameter\'s type is an invalid type',
      function(done) {
        petStore.paths['/pets'].post.parameters[0].schema = {
          type: 'foobar'
        };

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/post has an invalid body parameter type (foobar)');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a body parameter\'s type is invalid for a body parameter',
      function(done) {
        petStore.paths['/pets'].post.parameters[0].schema = {
          type: 'file'
        };

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/post has an invalid body parameter type (file)');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because the "file" type is allowed for "formData" params
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a file parameter doesn\'t consume multipart/form-data or application/x-www-form-urlencoded',
      function(done) {
        delete petStore.paths['/pets/{petName}/photos'].post.consumes;

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/{petName}/photos/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should not return an error if a file parameter consumes application/x-www-form-urlencoded',
      function(done) {
        petStore.paths['/pets/{petName}/photos'].post.consumes = ['text/plain', 'application/x-www-form-urlencoded', 'application/json'];

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because the "consumes" contains application/x-www-form-urlencoded
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: The "foo" query parameter at /paths/pets/get is an array, so it must include an "items" schema');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: The "foo" body parameter at /paths/pets/get is an array, so it must include an "items" schema');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because the array has an "items" schema
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
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

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );
  });

  describe('Response validation', function() {
    it('should return an error if a response header is an invalid type',
      function(done) {
        petStore.paths['/pets'].get.responses.default.headers['last-modified'].type = 'foobar';

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a response header is not a primitive type',
      function(done) {
        petStore.paths['/pets'].get.responses.default.headers['last-modified'].type = 'object';

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          // This error message comes from the JSON Schema validator
          expect(err.message).to.contain('Data does not match any schemas from "oneOf"');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should return an error if a response schema is an invalid type',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {type: 'foobar'};

        SwaggerParser.parse(petStore, function(err, api, parser) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.equal('Error in Swagger definition \nSyntaxError: /paths/pets/get/responses/default has an invalid response schema type (foobar)');
          expect(api).to.be.null;
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          done();
        });
      }
    );

    it('should not return an error if a response schema type is "file"',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {type: 'file'};

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because the "file" type is allowed for JSON Schema responses
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should not return an error if a response schema type is null',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {type: 'null'};

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because the "null" type is allowed for JSON Schemas
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );

    it('should not return an error if a response schema is empty',
      function(done) {
        petStore.paths['/pets'].get.responses.default.schema = {};

        SwaggerParser.parse(petStore, function(err, api, parser) {
          // No error, because an undefined type is allowed for JSON Schemas
          if (err) {
            return done(err);
          }
          expect(parser).to.be.an.instanceOf(SwaggerParser);
          expect(api).to.deep.equal(petStore);
          done();
        });
      }
    );
  })
});
