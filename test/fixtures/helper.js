(function() {
  'use strict';

  global.helper = {};

  /**
   * Parsed JSON schemas
   */
  helper.parsed = {};

  /**
   * Dereferenced JSON schemas
   */
  helper.dereferenced = {};

  /**
   * Validated JSON schemas
   */
  helper.validated = {};

  /**
   * Bundled JSON schemas
   */
  helper.bundled = {};

  /**
   * Throws an error if called.
   */
  helper.shouldNotGetCalled = function shouldNotGetCalled(done) {
    var err = new Error('This function should not have gotten called.');
    if (typeof done === 'function') {
      return function(err2) {
        if (err2 instanceof Error) {
          done(err2);
        }
        else {
          done(err);
        }
      };
    }
    else {
      throw err;
    }
  };

  /**
   * Tests the {@link SwaggerParser.resolve} method,
   * and asserts that the given file paths resolve to the given values.
   *
   * @param {string} filePath - The file path that should be resolved
   * @param {*} resolvedValue - The resolved value of the file
   * @param {...*} [params] - Additional file paths and resolved values
   * @returns {Function}
   */
  helper.testResolve = function testResolve(filePath, resolvedValue, params) {
    var schemaFile = path.rel(arguments[0]);
    var parsedSchema = arguments[1];
    var expectedFiles = [], expectedValues = [];
    for (var i = 0; i < arguments.length; i++) {
      expectedFiles.push(path.abs(arguments[i]));
      expectedValues.push(arguments[++i]);
    }

    return function(done) {
      var parser = new SwaggerParser();
      parser
        .resolve(schemaFile)
        .then(function($refs) {
          expect(parser.api).to.deep.equal(parsedSchema);
          expect(parser.$refs).to.equal($refs);

          // Resolved file paths
          expect($refs.paths()).to.have.same.members(expectedFiles);
          if (userAgent.isNode) {
            expect($refs.paths(['file'])).to.have.same.members(expectedFiles);
            expect($refs.paths('http')).to.be.an('array').with.lengthOf(0);
          }
          else {
            expect($refs.paths(['http', 'https'])).to.have.same.members(expectedFiles);
            expect($refs.paths('fs')).to.be.an('array').with.lengthOf(0);
          }

          // Resolved values
          var values = $refs.values();
          expect(values).to.have.keys(expectedFiles);
          expectedFiles.forEach(function(file, i) {
            var actual = helper.convertNodeBuffersToPOJOs(values[file]);
            var expected = expectedValues[i];
            expect(actual).to.deep.equal(expected, file);
          });

          done();
        })
        .catch(helper.shouldNotGetCalled(done));
    };
  };

  /**
   * Converts Buffer objects to POJOs, so they can be compared using Chai
   */
  helper.convertNodeBuffersToPOJOs = function convertNodeBuffersToPOJOs(value) {
    if (value && (value._isBuffer || (value.constructor && value.constructor.name === 'Buffer'))) {
      // Convert Buffers to POJOs for comparison
      value = value.toJSON();

      if (userAgent.isNode && /v0\.10/.test(process.version)) {
        // Node v0.10 serializes buffers differently
        value = {type: 'Buffer', data: value};
      }
    }
    return value;
  };

  /**
   * Creates a deep clone of the given value.
   */
  helper.cloneDeep = function cloneDeep(value) {
    var clone = value;
    if (value && typeof value === 'object') {
      clone = value instanceof Array ? [] : {};
      var keys = Object.keys(value);
      for (var i = 0; i < keys.length; i++) {
        clone[keys[i]] = helper.cloneDeep(value[keys[i]]);
      }
    }
    return clone;
  };

}());
