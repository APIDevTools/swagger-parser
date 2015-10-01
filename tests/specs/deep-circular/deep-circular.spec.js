'use strict';

describe('API with deeply-nested circular $refs', function() {
  it('should parse successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .parse(path.rel('specs/deep-circular/deep-circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.parsed.deepCircular.api);
        expect(parser.$refs.paths()).to.deep.equal([path.abs('specs/deep-circular/deep-circular.yaml')]);
      });
  });

  it('should resolve successfully', helper.testResolve(
    'specs/deep-circular/deep-circular.yaml', helper.parsed.deepCircular.api,
    'specs/deep-circular/definitions/name.yaml', helper.parsed.deepCircular.name,
    'specs/deep-circular/definitions/required-string.yaml', helper.parsed.deepCircular.requiredString
  ));

  it('should dereference successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .dereference(path.rel('specs/deep-circular/deep-circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.dereferenced.deepCircular);

        // Reference equality
        expect(api.paths['/family-tree'].get.responses['200'].schema.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3.properties.level4.properties.name.type);
      });
  });

  it('should validate successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .validate(path.rel('specs/deep-circular/deep-circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.dereferenced.deepCircular);

        // Reference equality
        expect(api.paths['/family-tree'].get.responses['200'].schema.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3.properties.name.type)
          .to.equal(api.paths['/family-tree'].get.responses['200'].schema.properties.level1.properties.level2.properties.level3.properties.level4.properties.name.type);
      });
  });

  it('should bundle successfully', function() {
    var parser = new SwaggerParser();
    return parser
      .bundle(path.rel('specs/deep-circular/deep-circular.yaml'))
      .then(function(api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.bundled.deepCircular);
      });
  });
});
