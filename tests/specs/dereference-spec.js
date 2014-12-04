describe('Dereferencing tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should not dereference if "dereferencePointers" is false',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), {dereferencePointers: false}, function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.parsed.shorthandRefs);
          done();
        });
      }
    );

    it('should dereference shorthand "definition" references',
      function(done) {
        env.parser.parse(env.files.getPath('shorthand-refs.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(env.files.dereferenced.shorthandRefs);
          done();
        });
      }
    );
  });


  describe('Failure tests', function() {

  });

});
