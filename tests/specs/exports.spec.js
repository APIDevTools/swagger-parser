'use strict';

describe('Exports', function() {
  it('should export the SwaggerParser class', function(done) {
    expect(SwaggerParser).to.be.a('function');
    done();
  });

  it('should export the YAML object', function(done) {
    expect(SwaggerParser.YAML).to.be.an('object');
    expect(SwaggerParser.YAML.parse).to.be.a('function');
    expect(SwaggerParser.YAML.stringify).to.be.a('function');
    done();
  });

  it('should export all the static methods of SwaggerParser', function(done) {
    expect(SwaggerParser.parse).to.be.a('function');
    expect(SwaggerParser.resolve).to.be.a('function');
    expect(SwaggerParser.bundle).to.be.a('function');
    expect(SwaggerParser.dereference).to.be.a('function');
    done();
  });

  it('should export the validate method', function(done) {
    expect(SwaggerParser.validate).to.be.a('function');
    done();
  });
});
