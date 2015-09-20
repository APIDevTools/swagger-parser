'use strict';

describe('API with circular (recursive) $refs', function() {
  it('should parse successfully', function(done) {
    var parser = new SwaggerParser();
    parser
      .parse(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.parsed.circularExternal.api);
        expect(parser.$refs.paths()).to.deep.equal([path.abs('specs/circular/circular.yaml')]);
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('should resolve successfully', helper.testResolve(
    'specs/circular/circular.yaml', helper.parsed.circularExternal.api,
    'specs/circular/definitions/child.yaml', helper.parsed.circularExternal.child,
    'specs/circular/definitions/parent.yaml', helper.parsed.circularExternal.parent,
    'specs/circular/definitions/person.yaml', helper.parsed.circularExternal.person
  ));

  it('should dereference successfully', function(done) {
    var parser = new SwaggerParser();
    parser
      .dereference(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.dereferenced.circularExternal);

        // Reference equality
        expect(api.definitions.person.properties.spouse).to.equal(api.definitions.person);
        expect(api.definitions.parent.properties.children.items).to.equal(api.definitions.child);
        expect(api.definitions.child.properties.parents.items).to.equal(api.definitions.parent);

        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('should validate successfully', function(done) {
    var parser = new SwaggerParser();
    parser
      .validate(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.validated.circularExternal);

        // Reference equality
        expect(api.definitions.person.properties.spouse).to.equal(api.definitions.person);
        expect(api.definitions.parent.properties.children.items).to.equal(api.definitions.child);
        expect(api.definitions.child.properties.parents.items).to.equal(api.definitions.parent);

        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });

  it('should bundle successfully', function(done) {
    var parser = new SwaggerParser();
    parser
      .bundle(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.bundled.circularExternal);
        done();
      })
      .catch(helper.shouldNotGetCalled(done));
  });
});
