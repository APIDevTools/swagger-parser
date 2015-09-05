'use strict';

describe('Dereferencing', function() {
  it('should parse',
    function(done) {
      var parser = new SwaggerParser();
      parser.parse(helper.relPath('no-refs.yaml'))
        .then(function(schema) {
          expect(schema).to.be.an('object').and.not.empty;
          expect(schema).to.equal(parser.schema);
          expect(parser.$refs).to.be.an('object');
          done();
        })
        .catch(done);
    }
  );

  it('should resolve $refs',
    function(done) {
      var parser = new SwaggerParser();
      parser.resolve(helper.relPath('external-refs.yaml'))
        .then(function($refs) {
          expect($refs).to.be.an('object').and.not.empty;
          expect($refs).to.equal(parser.$refs);

          var all$Refs = $refs.paths();
          expect(all$Refs).to.satisfy(arrayOfStrings);
          if (userAgent.isBrowser) {
            expect($refs.paths('http', 'https')).to.deep.equal(all$Refs);
          }
          else {
            expect($refs.paths('fs')).to.deep.equal(all$Refs);
          }

          done();
        })
        .catch(function(e) {
          done(e);
        });
    }
  );

  it('should support circular $refs',
    function(done) {
      var parser = new SwaggerParser();
      parser.dereference(helper.relPath('circular-refs.yaml'))
        .then(function(schema) {
          expect(schema).to.be.an('object').and.not.empty;
          expect(schema).to.equal(parser.schema);
          expect(parser.$refs).to.be.an('object');

          var all$Refs = parser.$refs.paths();
          expect(all$Refs).to.satisfy(arrayOfStrings);
          if (userAgent.isBrowser) {
            expect(parser.$refs.paths('http', 'https')).to.deep.equal(all$Refs);
          }
          else {
            expect(parser.$refs.paths('fs')).to.deep.equal(all$Refs);
          }

          done();
        })
        .catch(done);
    }
  );
});

function arrayOfStrings(array) {
  expect(array).to.be.an('array').with.length.above(0);
  for (var i = 0; i < array.length; i++) {
    expect(array[i]).to.be.a('string');
  }
  return true;
}
