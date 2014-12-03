describe('parser.defaults tests', function() {
  'use strict';

  it('should be initialized with the default values',
    function() {
      expect(swagger.parser.defaults.supportedSwaggerVersions).to.have.members(['2.0']);
      expect(swagger.parser.defaults.parseYaml).to.equal(true);
      expect(swagger.parser.defaults.dereferencePointers).to.equal(true);
      expect(swagger.parser.defaults.dereferenceExternalPointers).to.equal(true);
      expect(swagger.parser.defaults.validateSpec).to.equal(true);
    }
  );


  it('should use modified defaults when parsing',
    function(done) {
      swagger.parser.parse(env.filePath('minimal.yaml'), function(err) {
        done(err);
      })
    }
  );

});
