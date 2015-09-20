'use strict';

describe('Invalid APIs (Swagger 2.0 schema validation)', function() {
  var tests = [
    {name: 'invalid response code', file: 'specs/validate-schema/invalid-response-code.yaml'},
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
