describe('parser.parse tests', function() {
  'use strict';

  describe('Success tests', function() {
    it('should successfully parse a YAML file',
      function(done) {
        parser.parse(filePath('minimal.yaml'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(parsedFiles.minimal);
          done();
        });
      }
    );

    it('should successfully parse a JSON file',
      function(done) {
        parser.parse(filePath('minimal.json'), function(err, swagger) {
          expect(err).to.be.null;
          expect(swagger).to.deep.equal(parsedFiles.minimal);
          done();
        });
      }
    );
  });


  describe('Failure tests', function() {
    it('should throw an error if called with no params',
      function() {
        expect(call(parser.parse)).to.throw(/A callback function must be provided/);
      }
    );

    it('should return an error if an invalid file is given',
      function(done) {
        parser.parse(filePath('nonexistent-file.json'), function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.match(/Not Found/i);
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );

    it('should return an error if an invalid URL is given',
      function(done) {
        parser.parse('http://nonexistent-server.com/nonexistent-file.json', function(err, swagger) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.contain('not a valid Swagger spec');
          expect(swagger).to.be.undefined;
          done();
        });
      }
    );
  });

});
