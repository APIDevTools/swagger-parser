import type { OpenAPIV2Doc } from "../../..";
import SwaggerParser from "../../../lib/index.js";
import helper from "../../utils/helper";
import path from "../../utils/path";
import parsedAPI from "./parsed";
import dereferencedAPI from "./dereferenced";
import bundledAPI from "./bundled";
import validatedAPI from "./validated";
import { expect, it, describe } from "vitest";

describe("API with circular (recursive) $refs", () => {
  it("should parse successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.parse(path.rel("test/specs/circular/circular.yaml"));
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
    const parser = new SwaggerParser<OpenAPIV2Doc>();
    const api = await parser.dereference(path.rel("test/specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(dereferencedAPI);
    // Reference equality
    expect(api.definitions!.person.properties!.spouse).to.equal(api.definitions!.person);
    expect(api.definitions!.parent.properties!.children.items).to.equal(api.definitions!.child);
    expect(api.definitions!.child.properties!.parents.items).to.equal(api.definitions!.parent);
  });

  it("should validate successfully", async () => {
    const parser = new SwaggerParser<OpenAPIV2Doc>();
    const api = await parser.validate(path.rel("test/specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(validatedAPI.fullyDereferenced);
    // Reference equality
    expect(api.definitions!.person.properties!.spouse).to.equal(api.definitions!.person);
    expect(api.definitions!.parent.properties!.children.items).to.equal(api.definitions!.child);
    expect(api.definitions!.child.properties!.parents.items).to.equal(api.definitions!.parent);
  });

  it('should not dereference circular $refs if "options.dereference.circular" is "ignore"', async () => {
    const parser = new SwaggerParser<OpenAPIV2Doc>();
    const api = await parser.validate(path.rel("test/specs/circular/circular.yaml"), {
      dereference: { circular: "ignore" },
    });
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(validatedAPI.ignoreCircular$Refs);
    const responseEntry = api.paths["/pet"]!.get!.responses["200"];
    // Reference equality
    if (responseEntry && "schema" in responseEntry) {
      expect(responseEntry!.schema).to.equal(api.definitions!.pet);
    }
  });

  it('should fail validation if "options.dereference.circular" is false', async () => {
    const parser = new SwaggerParser();

    try {
      await parser.validate(path.rel("test/specs/circular/circular.yaml"), { dereference: { circular: false } });
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(ReferenceError);
      expect(err.message).to.equal("The API contains circular references");
    }
  });

  it("should bundle successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.bundle(path.rel("test/specs/circular/circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(bundledAPI);
  });
});
