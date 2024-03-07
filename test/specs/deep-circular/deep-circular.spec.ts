import type { OpenAPIV2Doc } from "../../..";
import SwaggerParser from "../../../lib/index.js";
import helper from "../../utils/helper";
import path from "../../utils/path";
import parsedAPI from "./parsed";
import dereferencedAPI from "./dereferenced";
import bundledAPI from "./bundled";
import { expect, it, describe } from "vitest";

describe("API with deeply-nested circular $refs", () => {
  it("should parse successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.parse(path.rel("test/specs/deep-circular/deep-circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(parsedAPI.api);
    expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/deep-circular/deep-circular.yaml")]);
  });

  it(
    "should resolve successfully",
    helper.testResolve(
      "specs/deep-circular/deep-circular.yaml",
      parsedAPI.api,
      "specs/deep-circular/definitions/name.yaml",
      parsedAPI.name,
      "specs/deep-circular/definitions/required-string.yaml",
      parsedAPI.requiredString,
    ),
  );

  it("should dereference successfully", async () => {
    const parser = new SwaggerParser<OpenAPIV2Doc>();

    const api = await parser.dereference(path.rel("test/specs/deep-circular/deep-circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(dereferencedAPI);
    // Reference equality
    const response = api.paths!["/family-tree"]!.get!.responses["200"];
    if (!response || !("schema" in response)) {
      throw new Error("Schema is not in response");
    }
    // @ts-ignore
    const properties1 = response.schema.properties;
    expect(properties1.name.type)
      .to.equal(properties1.level1.properties.name.type)
      .to.equal(properties1.level1.properties.level2.properties.name.type)
      .to.equal(properties1.level1.properties.level2.properties.level3.properties.name.type)
      .to.equal(properties1.level1.properties.level2.properties.level3.properties.level4.properties.name.type);
  });

  it("should validate successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.validate(path.rel("test/specs/deep-circular/deep-circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(dereferencedAPI);
    // Reference equality
    // @ts-ignore
    const properties = api.paths["/family-tree"].get.responses["200"].schema.properties;
    expect(properties.name.type)
      .to.equal(properties.level1.properties.name.type)
      .to.equal(properties.level1.properties.level2.properties.name.type)
      .to.equal(properties.level1.properties.level2.properties.level3.properties.name.type)
      .to.equal(properties.level1.properties.level2.properties.level3.properties.level4.properties.name.type);
  });

  it("should bundle successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.bundle(path.rel("test/specs/deep-circular/deep-circular.yaml"));
    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(bundledAPI);
  });
});
