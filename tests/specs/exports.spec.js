'use strict';

describe('Exports', function() {
  it('should export the SwaggerParser class', function() {
    expect(SwaggerParser).to.be.a('function');
  });

  it('should export the YAML object', function() {
    expect(SwaggerParser.YAML).to.be.an('object');
    expect(SwaggerParser.YAML.parse).to.be.a('function');
    expect(SwaggerParser.YAML.stringify).to.be.a('function');
  });

  it('should export all the static methods of SwaggerParser', function() {
    expect(SwaggerParser.parse).to.be.a('function');
    expect(SwaggerParser.resolve).to.be.a('function');
    expect(SwaggerParser.bundle).to.be.a('function');
    expect(SwaggerParser.dereference).to.be.a('function');
  });

  it('should export the validate method', function() {
    expect(SwaggerParser.validate).to.be.a('function');
  });
});
