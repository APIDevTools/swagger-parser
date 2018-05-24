describe('Invalid APIs (can\'t be parsed)', function () {
  'use strict';

  it('not a Swagger API', function () {
    return SwaggerParser
      .parse(path.rel('specs/invalid/not-swagger.yaml'))
      .then(helper.shouldNotGetCalled)
      .catch(function (err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.contain('not-swagger.yaml is not a valid Openapi API definition');
      });
  });

  it('invalid Swagger version (1.2)', function () {
    return SwaggerParser
      .dereference(path.rel('specs/invalid/old-version.yaml'))
      .then(helper.shouldNotGetCalled)
      .catch(function (err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('Unsupported Swagger version: 1.2. Swagger Parser only supports version 2.0');
      });
  });

  it('invalid Swagger version (3.0)', function () {
    return SwaggerParser
      .bundle(path.rel('specs/invalid/newer-version.yaml'))
      .then(helper.shouldNotGetCalled)
      .catch(function (err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('Unsupported Swagger version: 3. Swagger Parser only supports version 2.0');
      });
  });

  it('numeric Swagger version (instead of a string)', function () {
    return SwaggerParser
      .validate(path.rel('specs/invalid/numeric-version.yaml'))
      .then(helper.shouldNotGetCalled)
      .catch(function (err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('Swagger version number must be a string (e.g. \"2.0\") not a number.');
      });
  });

  it('numeric API version (instead of a string)', function () {
    return SwaggerParser
      .validate(path.rel('specs/invalid/numeric-info-version.yaml'))
      .then(helper.shouldNotGetCalled)
      .catch(function (err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('API version number must be a string (e.g. \"1.0.0\") not a number.');
      });
  });
});
