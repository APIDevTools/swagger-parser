describe('Package exports tests', function() {
  'use strict';

  it('should export swagger.parser',
    function() {
      expect(env).to.have.property('parser').that.is.an('object');
    }
  );

  it('should export the parse function',
    function() {
      expect(parser).to.have.property('parse').that.is.a('function');
    }
  );

  it('should export the defaults object',
    function() {
      expect(parser).to.have.property('defaults').that.is.an('object');
    }
  );

});
