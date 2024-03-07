import SwaggerParser from "../../lib/index.js";
import { validate } from "../../lib/index.js";
import path from "../utils/path";
import { expect, it, describe } from "vitest";

describe("Exports", () => {
  it("should export the SwaggerParser class", async () => {
    expect(SwaggerParser).to.be.a("function");
  });

  it("should export all the static methods of SwaggerParser", async () => {
    expect(SwaggerParser.parse).to.be.a("function");
    expect(SwaggerParser.resolve).to.be.a("function");
    expect(SwaggerParser.bundle).to.be.a("function");
    expect(SwaggerParser.dereference).to.be.a("function");
  });

  it("should export the validate method", async () => {
    expect(SwaggerParser.validate).to.be.a("function");
  });

  it("Using named import should work correctly", async () => {
    await validate(path.rel("test/specs/validate-spec/valid/file-vendor-specific-consumes-formdata.yaml"));
  });
});
