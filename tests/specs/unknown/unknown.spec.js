'use strict';

describe('API with $refs to unknown file types', function() {
  var windowOnError, testDone;

  beforeEach(function() {
    // Some old Webkit browsers throw an error when downloading zero-byte files.
    windowOnError = global.onerror;
    global.onerror = function() {
      testDone();
      return true;
    }
  });

  afterEach(function() {
    global.onerror = windowOnError;
  });

  it('should parse successfully', function(done) {
    testDone = done;
    var parser = new SwaggerParser();
    parser
      .parse(path.rel('specs/unknown/unknown.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.parsed.unknown.api);
        expect(parser.$refs.paths()).to.deep.equal([path.abs('specs/unknown/unknown.yaml')]);
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('should resolve successfully', function(done) {
    testDone = done;
    helper.testResolve(
      'specs/unknown/unknown.yaml', helper.parsed.unknown.api,
      'specs/unknown/files/blank', helper.parsed.unknown.blank,
      'specs/unknown/files/text.txt', helper.parsed.unknown.text,
      'specs/unknown/files/page.html', helper.parsed.unknown.html,
      'specs/unknown/files/binary.png', helper.parsed.unknown.binary
    )(done);
  });

  it('should dereference successfully', function(done) {
    testDone = done;
    var parser = new SwaggerParser();
    parser
      .dereference(path.rel('specs/unknown/unknown.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);

        api.paths['/files/text'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/text'].get.responses['200'].default);

        api.paths['/files/html'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/html'].get.responses['200'].default);

        api.paths['/files/blank'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/blank'].get.responses['200'].default);

        api.paths['/files/binary'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/binary'].get.responses['200'].default);

        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('should validate successfully', function(done) {
    testDone = done;
    var parser = new SwaggerParser();
    parser
      .validate(path.rel('specs/unknown/unknown.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);

        api.paths['/files/text'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/text'].get.responses['200'].default);

        api.paths['/files/html'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/html'].get.responses['200'].default);

        api.paths['/files/blank'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/blank'].get.responses['200'].default);

        api.paths['/files/binary'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/binary'].get.responses['200'].default);

        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('should bundle successfully', function(done) {
    testDone = done;
    var parser = new SwaggerParser();
    parser
      .bundle(path.rel('specs/unknown/unknown.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);

        api.paths['/files/text'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/text'].get.responses['200'].default);

        api.paths['/files/html'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/html'].get.responses['200'].default);

        api.paths['/files/blank'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/blank'].get.responses['200'].default);

        api.paths['/files/binary'].get.responses['200'].default =
          helper.convertNodeBuffersToPOJOs(helper.dereferenced.unknown.paths['/files/binary'].get.responses['200'].default);

        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });
});
