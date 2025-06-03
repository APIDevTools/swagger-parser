"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const helper = require("../../utils/helper");
const path = require("../../utils/path");
const parsedAPI = require("./parsed");
const dereferencedAPI = require("./dereferenced");
const bundledAPI = require("./bundled");
const validatedAPI = require("./validated");

describe("API with circular (recursive) $refs", () => {
  it("should parse successfully", async () => {
    let parser = new SwaggerParser();
    const api = await parser.parse(path.rel("specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(parsedAPI.api);
    expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/circular/circular.yaml")]);
  });

  it(
    "should resolve successfully",
    helper.testResolve(
      "specs/circular/circular.yaml",
      parsedAPI.api,
      "specs/circular/definitions/pet.yaml",
      parsedAPI.pet,
      "specs/circular/definitions/child.yaml",
      parsedAPI.child,
      "specs/circular/definitions/parent.yaml",
      parsedAPI.parent,
      "specs/circular/definitions/person.yaml",
      parsedAPI.person,
    ),
  );

  it("should dereference successfully", async () => {
    let parser = new SwaggerParser();
    const api = await parser.dereference(path.rel("specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(dereferencedAPI);
    // Reference equality
    expect(api.definitions.person.properties.spouse).to.equal(api.definitions.person);
    expect(api.definitions.parent.properties.children.items).to.equal(api.definitions.child);
    expect(api.definitions.child.properties.parents.items).to.equal(api.definitions.parent);
  });

  it("should validate successfully", async () => {
    let parser = new SwaggerParser();
    const api = await parser.validate(path.rel("specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(validatedAPI.fullyDereferenced);
    // Reference equality
    expect(api.definitions.person.properties.spouse).to.equal(api.definitions.person);
    expect(api.definitions.parent.properties.children.items).to.equal(api.definitions.child);
    expect(api.definitions.child.properties.parents.items).to.equal(api.definitions.parent);
  });

  it('should not dereference circular $refs if "options.dereference.circular" is "ignore"', async () => {
    let parser = new SwaggerParser();
    const api = await parser.validate(path.rel("specs/circular/circular.yaml"), {
      dereference: { circular: "ignore" },
    });
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(validatedAPI.ignoreCircular$Refs);
    // Reference equality
    expect(api.paths["/pet"].get.responses["200"].schema).to.equal(api.definitions.pet);
  });

  it('should fail validation if "options.dereference.circular" is false', async () => {
    let parser = new SwaggerParser();

    try {
      await parser.validate(path.rel("specs/circular/circular.yaml"), {
        dereference: { circular: false },
      });
      helper.shouldNotGetCalled();
    } catch (err) {
      expect(err).to.be.an.instanceOf(ReferenceError);
      expect(err.message).to.equal("The API contains circular references");
    }
  });

  it("should bundle successfully", async () => {
    let parser = new SwaggerParser();
    const api = await parser.bundle(path.rel("specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(bundledAPI);
  });
});
