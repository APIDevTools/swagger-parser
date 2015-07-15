require('../test-environment.js');

describe('Package exports tests', function() {
  'use strict';

  it('should export the SwaggerParser class',
    function() {
      expect(SwaggerParser).to.be.a('function');
      expect(SwaggerParser.prototype.parse).to.be.a('function');
      expect(SwaggerParser.prototype.resolve).to.be.a('function');
      expect(SwaggerParser.prototype.dereference).to.be.a('function');
      expect(SwaggerParser.prototype.validate).to.be.a('function');
    }
  );

  if (env.isBrowser) {
    it('should export the SwaggerParser class as swagger.parser (backward compatibility)',
      function() {
        expect(swagger.parser).to.equal(SwaggerParser);
      }
    );
  }

  it('should export the parse function',
    function() {
      expect(SwaggerParser).to.have.property('parse').that.is.a('function');
    }
  );

  it('should export the defaults object',
    function() {
      expect(SwaggerParser).to.have.property('defaults').that.is.an('object');
    }
  );

});
