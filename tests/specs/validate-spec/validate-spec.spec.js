'use strict';

describe.only('Invalid APIs (Swagger 2.0 specification validation)', function() {
  var tests = [
    {name: 'invalid response code', file: 'specs/validate-spec/invalid-response-code.yaml', error: 'Validation failed. /paths/users/get/responses/888 has an invalid response code (888)'},
    {name: 'duplicate path parameters', file: 'specs/validate-spec/duplicate-path-params.yaml', error: 'Validation failed. /paths/users/{username} has duplicate parameters \nValidation failed. Found multiple header parameters named \"foo\"'},
    {name: 'duplicate operation parameters', file: 'specs/validate-spec/duplicate-operation-params.yaml', error: 'Validation failed. /paths/users/{username}/get has duplicate parameters \nValidation failed. Found multiple path parameters named \"username\"'},
    {name: 'multiple body parameters in path', file: 'specs/validate-spec/multiple-path-body-params.yaml', error: 'Validation failed. /paths/users/{username}/get has 2 body parameters. Only one is allowed.'},
    {name: 'multiple body parameters in operation', file: 'specs/validate-spec/multiple-operation-body-params.yaml', error: 'Validation failed. /paths/users/{username}/patch has 2 body parameters. Only one is allowed.'},
    {name: 'multiple body parameters in path & operation', file: 'specs/validate-spec/multiple-body-params.yaml', error: 'Validation failed. /paths/users/{username}/post has 2 body parameters. Only one is allowed.'},
    {name: 'body and formData parameters', file: 'specs/validate-spec/body-and-form-params.yaml', error: 'Validation failed. /paths/users/{username}/post has body parameters and formData parameters. Only one or the other is allowed.'},
    {name: 'path param with no placeholder', file: 'specs/validate-spec/path-param-no-placeholder.yaml', error: 'Validation failed. /paths/users/{username}/post has a path parameter named \"foo\", but there is no corresponding {foo} in the path string'},
    {name: 'path placeholder with no param', file: 'specs/validate-spec/path-placeholder-no-param.yaml', error: 'Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {foo}'},
    {name: 'no path parameters', file: 'specs/validate-spec/no-path-params.yaml', error: 'Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {username},{foo}'},
  ];

  it('should not validate if "options.validate.spec" is false', function(done) {
    SwaggerParser
      .validate(path.rel(tests[0].file), {validate: {spec: false}})
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
          expect(err.message).to.equal(test.error);
          done();
        })
        .catch(helper.shouldNotGetCalled(done));
    });
  });
});
