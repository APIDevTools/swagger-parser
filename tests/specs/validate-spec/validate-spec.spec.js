'use strict';

describe('Invalid APIs (Swagger 2.0 specification validation)', function() {
  var tests = [
    {
      name: 'invalid response code',
      file: 'specs/validate-spec/invalid-response-code.yaml',
      error: 'Validation failed. /paths/users/get/responses/888 has an invalid response code (888)'
    },
    {
      name: 'duplicate path parameters',
      file: 'specs/validate-spec/duplicate-path-params.yaml',
      error: 'Validation failed. /paths/users/{username} has duplicate parameters \nValidation failed. Found multiple header parameters named \"foo\"'
    },
    {
      name: 'duplicate operation parameters',
      file: 'specs/validate-spec/duplicate-operation-params.yaml',
      error: 'Validation failed. /paths/users/{username}/get has duplicate parameters \nValidation failed. Found multiple path parameters named \"username\"'
    },
    {
      name: 'multiple body parameters in path',
      file: 'specs/validate-spec/multiple-path-body-params.yaml',
      error: 'Validation failed. /paths/users/{username}/get has 2 body parameters. Only one is allowed.'
    },
    {
      name: 'multiple body parameters in operation',
      file: 'specs/validate-spec/multiple-operation-body-params.yaml',
      error: 'Validation failed. /paths/users/{username}/patch has 2 body parameters. Only one is allowed.'
    },
    {
      name: 'multiple body parameters in path & operation',
      file: 'specs/validate-spec/multiple-body-params.yaml',
      error: 'Validation failed. /paths/users/{username}/post has 2 body parameters. Only one is allowed.'
    },
    {
      name: 'body and formData parameters',
      file: 'specs/validate-spec/body-and-form-params.yaml',
      error: 'Validation failed. /paths/users/{username}/post has body parameters and formData parameters. Only one or the other is allowed.'
    },
    {
      name: 'path param with no placeholder',
      file: 'specs/validate-spec/path-param-no-placeholder.yaml',
      error: 'Validation failed. /paths/users/{username}/post has a path parameter named \"foo\", but there is no corresponding {foo} in the path string'
    },
    {
      name: 'path placeholder with no param',
      file: 'specs/validate-spec/path-placeholder-no-param.yaml',
      error: 'Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {foo}'
    },
    {
      name: 'duplicate path placeholders',
      file: 'specs/validate-spec/duplicate-path-placeholders.yaml',
      error: 'Validation failed. /paths/users/{username}/profile/{username}/image/{img_id}/get has multiple path placeholders named {username}'
    },
    {
      name: 'no path parameters',
      file: 'specs/validate-spec/no-path-params.yaml',
      error: 'Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {username},{foo}'
    },
    {
      name: 'optional path parameters',
      file: 'specs/validate-spec/optional-path-params.yaml',
      error: 'Validation failed. Path parameters cannot be optional. Set required=true for the \"img_id\" parameter at /paths/users/{username}/profile/image/{img_id}/get'
    },
    {
      name: 'array param without items',
      file: 'specs/validate-spec/array-no-items.yaml',
      error: 'Validation failed. /paths/users/get/parameters/tags is an array, so it must include an \"items\" schema'
    },
    {
      name: 'array body param without items',
      file: 'specs/validate-spec/array-body-no-items.yaml',
      error: 'Validation failed. /paths/users/post/parameters/people is an array, so it must include an \"items\" schema'
    },
    {
      name: 'array response header without items',
      file: 'specs/validate-spec/array-response-header-no-items.yaml',
      error: 'Validation failed. /paths/users/get/responses/default/headers/Last-Modified is an array, so it must include an \"items\" schema'
    },
    {
      name: '"file" type used for body param',
      file: 'specs/validate-spec/file-body-param.yaml',
      error: 'Validation failed. /paths/users/{username}/profile/image/post/parameters/image has an invalid type (file)'
    },
    {
      name: '"file" param without "consumes"',
      file: 'specs/validate-spec/file-no-consumes.yaml',
      error: 'Validation failed. /paths/users/{username}/profile/image/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded'
    },
    {
      name: '"file" param with invalid "consumes"',
      file: 'specs/validate-spec/file-invalid-consumes.yaml',
      error: 'Validation failed. /paths/users/{username}/profile/image/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded'
    }
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
