'use strict';

describe('Invalid APIs (can\'t be parsed)', function() {
  it('not a Swagger API', function(done) {
    SwaggerParser
      .parse(path.rel('specs/invalid/not-swagger.yaml'))
      .then(helper.shouldNotGetCalled(done))
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('specs/invalid/not-swagger.yaml is not a valid Swagger API definition');
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('invalid Swagger version (1.2)', function(done) {
    SwaggerParser
      .parse(path.rel('specs/invalid/old-version.yaml'))
      .then(helper.shouldNotGetCalled(done))
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('Unsupported Swagger version: 1.2. Swagger Parser only supports version 2.0');
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('invalid Swagger version (3.0)', function(done) {
    SwaggerParser
      .parse(path.rel('specs/invalid/newer-version.yaml'))
      .then(helper.shouldNotGetCalled(done))
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('Unsupported Swagger version: 3. Swagger Parser only supports version 2.0');
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('numeric Swagger version (instead of a string)', function(done) {
    SwaggerParser
      .parse(path.rel('specs/invalid/numeric-version.yaml'))
      .then(helper.shouldNotGetCalled(done))
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('Swagger version number must be a string (e.g. \"2.0\") not a number.');
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('numeric API version (instead of a string)', function(done) {
    SwaggerParser
      .parse(path.rel('specs/invalid/numeric-info-version.yaml'))
      .then(helper.shouldNotGetCalled(done))
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(SyntaxError);
        expect(err.message).to.equal('API version number must be a string (e.g. \"1.0.0\") not a number.');
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });
});
