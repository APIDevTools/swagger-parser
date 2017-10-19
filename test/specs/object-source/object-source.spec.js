describe('Object sources (instead of file paths)', function () {
  'use strict';

  it('should dereference an object that references external files', function () {
    var parser = new SwaggerParser();
    return parser
      .dereference(helper.cloneDeep(helper.parsed.objectSource.api))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.dereferenced.objectSource);

        // The API path should be the current directory, and all other paths should be absolute
        var expectedPaths = [
          encodeURI(path.cwd()),
          path.abs('specs/object-source/definitions/definitions.json'),
          path.abs('specs/object-source/definitions/name.yaml'),
          path.abs('specs/object-source/definitions/required-string.yaml')
        ];
        expect(parser.$refs.paths()).to.have.same.members(expectedPaths);
        expect(parser.$refs.values()).to.have.keys(expectedPaths);

        // Reference equality
        expect(api.paths['/people/{name}'].get.responses['200'].schema)
          .to.equal(api.definitions.name);
        expect(api.definitions.requiredString)
          .to.equal(api.definitions.name.properties.first)
          .to.equal(api.definitions.name.properties.last)
          .to.equal(api.paths['/people/{name}'].get.responses['200'].schema.properties.first)
          .to.equal(api.paths['/people/{name}'].get.responses['200'].schema.properties.last);
      });
  });

  it('should bundle an object that references external files', function () {
    var parser = new SwaggerParser();
    return parser
      .bundle(helper.cloneDeep(helper.parsed.objectSource.api))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.bundled.objectSource);

        // The API path should be the current directory, and all other paths should be absolute
        var expectedPaths = [
          encodeURI(path.cwd()),
          path.abs('specs/object-source/definitions/definitions.json'),
          path.abs('specs/object-source/definitions/name.yaml'),
          path.abs('specs/object-source/definitions/required-string.yaml')
        ];
        expect(parser.$refs.paths()).to.have.same.members(expectedPaths);
        expect(parser.$refs.values()).to.have.keys(expectedPaths);
      });
  });

  it('should validate an object that references external files', function () {
    var parser = new SwaggerParser();
    return parser
      .dereference(helper.cloneDeep(helper.parsed.objectSource.api))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(helper.dereferenced.objectSource);

        // The API path should be the current directory, and all other paths should be absolute
        var expectedPaths = [
          encodeURI(path.cwd()),
          path.abs('specs/object-source/definitions/definitions.json'),
          path.abs('specs/object-source/definitions/name.yaml'),
          path.abs('specs/object-source/definitions/required-string.yaml')
        ];
        expect(parser.$refs.paths()).to.have.same.members(expectedPaths);
        expect(parser.$refs.values()).to.have.keys(expectedPaths);

        // Reference equality
        expect(api.paths['/people/{name}'].get.responses['200'].schema)
          .to.equal(api.definitions.name);
        expect(api.definitions.requiredString)
          .to.equal(api.definitions.name.properties.first)
          .to.equal(api.definitions.name.properties.last)
          .to.equal(api.paths['/people/{name}'].get.responses['200'].schema.properties.first)
          .to.equal(api.paths['/people/{name}'].get.responses['200'].schema.properties.last);
      });
  });
});
