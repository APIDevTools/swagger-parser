"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const helper = require("../../utils/helper");
const path = require("../../utils/path");
const parsedSchema = require("./parsed");
const dereferencedSchema = require("./dereferenced");
const bundledSchema = require("./bundled");

describe("API with deeply-nested circular $refs", () => {
  it("should parse successfully", () => {
    let parser = new SwaggerParser();
    return parser
      .parse(path.rel("specs/deep-circular/deep-circular.yaml"))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(parsedSchema.api);
        expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/deep-circular/deep-circular.yaml")]);
      });
  });

  it("should resolve successfully", helper.testResolve(
    "specs/deep-circular/deep-circular.yaml", parsedSchema.api,
    "specs/deep-circular/definitions/name.yaml", parsedSchema.name,
    "specs/deep-circular/definitions/required-string.yaml", parsedSchema.requiredString
  ));

  it("should dereference successfully", () => {
    let parser = new SwaggerParser();
    return parser
      .dereference(path.rel("specs/deep-circular/deep-circular.yaml"))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(dereferencedSchema);

        // Reference equality
        expect(api.paths["/family-tree"].get.responses["200"].schema.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.level2.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.level2.properties.level3.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.level2.properties.level3.properties.level4.properties.name.type);
      });
  });

  it("should validate successfully", () => {
    let parser = new SwaggerParser();
    return parser
      .validate(path.rel("specs/deep-circular/deep-circular.yaml"))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(dereferencedSchema);

        // Reference equality
        expect(api.paths["/family-tree"].get.responses["200"].schema.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.level2.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.level2.properties.level3.properties.name.type)
          .to.equal(api.paths["/family-tree"].get.responses["200"].schema.properties.level1.properties.level2.properties.level3.properties.level4.properties.name.type);
      });
  });

  it("should bundle successfully", () => {
    let parser = new SwaggerParser();
    return parser
      .bundle(path.rel("specs/deep-circular/deep-circular.yaml"))
      .then(function (api) {
        expect(api).to.equal(parser.api);
        expect(api).to.deep.equal(bundledSchema);
      });
  });
});
