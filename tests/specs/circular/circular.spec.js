'use strict';

describe('API with circular (recursive) $refs', function() {
  it('should parse successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .parse(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.parsed.circularExternal.api);
        expect(parser.$refs.paths()).to.deep.equal([path.abs('specs/circular/circular.yaml')]);
      });
  });

  it('should resolve successfully', helper.testResolve(
    'specs/circular/circular.yaml', helper.parsed.circularExternal.api,
    'specs/circular/definitions/pet.yaml', helper.parsed.circularExternal.pet,
    'specs/circular/definitions/child.yaml', helper.parsed.circularExternal.child,
    'specs/circular/definitions/parent.yaml', helper.parsed.circularExternal.parent,
    'specs/circular/definitions/person.yaml', helper.parsed.circularExternal.person
  ));

  it('should dereference successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .dereference(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.dereferenced.circularExternal);

        // Reference equality
        expect(api.definitions.person.properties.spouse).to.equal(api.definitions.person);
        expect(api.definitions.parent.properties.children.items).to.equal(api.definitions.child);
        expect(api.definitions.child.properties.parents.items).to.equal(api.definitions.parent);
      });
  });

  it('should validate successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .validate(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.validated.circularExternal.fullyDereferenced);

        // Reference equality
        expect(api.definitions.person.properties.spouse).to.equal(api.definitions.person);
        expect(api.definitions.parent.properties.children.items).to.equal(api.definitions.child);
        expect(api.definitions.child.properties.parents.items).to.equal(api.definitions.parent);
      });
  });

  it('should not dereference circular $refs if "options.$refs.circular" is "ignore"', function() {
    var parser = new SwaggerParser();
    return parser
      .validate(path.rel('specs/circular/circular.yaml'), {$refs: {circular: 'ignore'}})
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.validated.circularExternal.ignoreCircular$Refs);

        // Reference equality
        expect(api.paths['/pet'].get.responses['200'].schema).to.equal(api.definitions.pet);
      });
  });

  it('should fail validation if "options.$refs.circular" is false', function() {
    var parser = new SwaggerParser();
    return parser
      .validate(path.rel('specs/circular/circular.yaml'), {$refs: {circular: false}})
      .then(helper.shouldNotGetCalled)
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(ReferenceError);
        expect(err.message).to.equal('The API contains circular references');
      });
  });

  it('should bundle successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .bundle(path.rel('specs/circular/circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.bundled.circularExternal);
      });
  });
});
