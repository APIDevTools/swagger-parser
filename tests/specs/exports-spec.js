describe('Package exports tests', function() {
  'use strict';

  it('should export swagger.parser',
    function() {
      expect(env.parser).to.be.an('object');
    }
  );

  it('should export the parse function',
    function() {
      expect(env.parser).to.have.property('parse').that.is.a('function');
    }
  );

  it('should export the defaults object',
    function() {
      expect(env.parser).to.have.property('defaults').that.is.an('object');
    }
  );

});
