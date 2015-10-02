'use strict';

describe('Invalid APIs (Swagger 2.0 schema validation)', function() {
  var tests = [
    {
      name: 'invalid response code',
      valid: false,
      file: 'invalid-response-code.yaml'
    },
    {
      name: 'optional path param',
      valid: false,
      file: 'optional-path-param.yaml'
    },
    {
      name: 'non-required path param',
      valid: false,
      file: 'non-required-path-param.yaml'
    },
    {
      name: 'invalid schema type',
      valid: false,
      file: 'invalid-schema-type.yaml'
    },
    {
      name: 'invalid param type',
      valid: false,
      file: 'invalid-param-type.yaml'
    },
    {
      name: 'non-primitive param type',
      valid: false,
      file: 'non-primitive-param-type.yaml'
    },
    {
      name: 'invalid parameter location',
      valid: false,
      file: 'invalid-param-location.yaml'
    },
    {
      name: '"file" type used for non-formData param',
      valid: false,
      file: 'file-header-param.yaml'
    },
    {
      name: '"file" type used for body param',
      valid: false,
      file: 'file-body-param.yaml',
      error: 'Validation failed. /paths/users/{username}/profile/image/post/parameters/image has an invalid type (file)'
    },
    {
      name: '"multi" header param',
      valid: false,
      file: 'multi-header-param.yaml'
    },
    {
      name: '"multi" path param',
      valid: false,
      file: 'multi-path-param.yaml'
    },
    {
      name: 'invalid response header type',
      valid: false,
      file: 'invalid-response-header-type.yaml'
    },
    {
      name: 'non-primitive response header type',
      valid: false,
      file: 'non-primitive-response-header-type.yaml'
    },
    {
      name: 'invalid response schema type',
      valid: false,
      file: 'invalid-response-type.yaml'
    },
    {
      name: 'unknown JSON Schema format',
      valid: true,
      file: 'unknown-format.yaml'
    },
    {
      name: '$ref to invalid Path object',
      valid: false,
      file: 'ref-to-invalid-path.yaml'
    },
  ];

  it('should pass validation if "options.validate.schema" is false', function() {
    var invalid = tests[0];
    expect(invalid.valid).to.be.false;

    return SwaggerParser
      .validate(path.rel('specs/validate-schema/invalid/' + invalid.file), {validate: {schema: false}})
      .then(function(api) {
        expect(api).to.be.an('object').and.ok;
      });
  });

  tests.forEach(function(test) {
    if (test.valid) {
      it(test.name, function() {
        return SwaggerParser
          .validate(path.rel('specs/validate-schema/valid/' + test.file))
          .then(function(api) {
            expect(api).to.be.an('object').and.ok;
          })
          .catch(function(err) {
            done(new Error('Validation should have succeeded, but it failed!\n' + err.stack));
          });
      });
    }
    else {
      it(test.name, function() {
        return SwaggerParser
          .validate(path.rel('specs/validate-schema/invalid/' + test.file))
          .then(function(api) {
            done(new Error('Validation should have failed, but it succeeded!'));
          })
          .catch(function(err) {
            expect(err).to.be.an.instanceOf(SyntaxError);
            expect(err.message).to.match(/^Swagger schema validation failed. \n  \w+/);
            expect(err.details).to.be.an('array').with.length.above(0);

            // Make sure the ZSchema error details object is valid
            var details = err.details[0];
            expect(details.code).to.be.a('string').and.match(/[A-Z_]+/);
            expect(details.message).to.be.a('string').and.not.empty;
            expect(details.path).to.be.an('array').with.length.above(0);
            expect(details.params).to.be.an('array');
          });
      });
    }
  });
});
