'use strict';

describe('Invalid APIs (Swagger 2.0 schema validation)', function() {
  var tests = [
    {
      name: 'invalid response code',
      file: 'specs/validate-schema/invalid-response-code.yaml'
    },
    {
      name: 'optional path param',
      file: 'specs/validate-schema/optional-path-param.yaml'
    },
    {
      name: 'invalid schema type',
      file: 'specs/validate-schema/invalid-schema-type.yaml'
    },
    {
      name: 'invalid param type',
      file: 'specs/validate-schema/invalid-param-type.yaml'
    },
    {
      name: 'non-primitive param type',
      file: 'specs/validate-schema/non-primitive-param-type.yaml'
    },
    {
      name: 'invalid parameter location',
      file: 'specs/validate-schema/invalid-param-location.yaml'
    },
    {
      name: '"file" type used for non-formData param',
      file: 'specs/validate-schema/file-header-param.yaml'
    },
    {
      name: '"multi" header param',
      file: 'specs/validate-schema/multi-header-param.yaml'
    },
    {
      name: '"multi" path param',
      file: 'specs/validate-schema/multi-path-param.yaml'
    },
    {
      name: 'invalid response header type',
      file: 'specs/validate-schema/invalid-response-header-type.yaml'
    },
    {
      name: 'non-primitive response header type',
      file: 'specs/validate-schema/non-primitive-response-header-type.yaml'
    },
    {
      name: 'invalid response schema type',
      file: 'specs/validate-schema/invalid-response-type.yaml'
    }
  ];

  it('should not validate if "options.validate.schema" is false', function(done) {
    SwaggerParser
      .validate(path.rel(tests[0].file), {validate: {schema: false}})
      .then(function(api) {
        expect(api).to.be.an('object').and.ok;
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  tests.forEach(function(test) {
    it(test.name, function(done) {
      SwaggerParser
        .validate(path.rel(test.file))
        .then(function(api) {
          done(new Error('Validation should have failed, but it succeeded!'));
        })
        .catch(function(err) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.match(/^Swagger schema validation failed. \n  \w+/);
          done();
        })
        .catch(helper.shouldNotGetCalled(done));
    });
  });
});
