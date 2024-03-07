import SwaggerParser from "../../../lib/index.js";
import helper from "../../utils/helper";
import path from "../../utils/path";
import { expect, it, describe } from "vitest";
describe("Invalid APIs (can't be parsed)", () => {
  it("not a Swagger API", async () => {
    try {
      await SwaggerParser.parse(path.rel("test/specs/invalid/not-swagger.yaml"));
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.contain("not-swagger.yaml is not a valid Openapi API definition");
    }
  });

  it("not a valid OpenAPI 3.1 definition", async () => {
    try {
      await SwaggerParser.parse(path.rel("test/specs/invalid/no-paths-or-webhooks.yaml"));
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.contain("no-paths-or-webhooks.yaml is not a valid Openapi API definition");
    }
  });

  it("invalid Swagger version (1.2)", async () => {
    try {
      await SwaggerParser.dereference(path.rel("test/specs/invalid/old-version.yaml"));
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal("Unrecognized Swagger version: 1.2. Expected 2.0");
    }
  });

  it("invalid Swagger version (3.0)", async () => {
    try {
      await SwaggerParser.bundle(path.rel("test/specs/invalid/newer-version.yaml"));
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal("Unrecognized Swagger version: 3.0. Expected 2.0");
    }
  });

  it("numeric Swagger version (instead of a string)", async () => {
    try {
      await SwaggerParser.validate(path.rel("test/specs/invalid/numeric-version.yaml"));
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('Swagger version number must be a string (e.g. "2.0") not a number.');
    }
  });

  it("numeric API version (instead of a string)", async () => {
    try {
      await SwaggerParser.validate(path.rel("test/specs/invalid/numeric-info-version.yaml"));
      helper.shouldNotGetCalled();
    } catch (err: any) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('API version number must be a string (e.g. "1.0.0") not a number.');
    }
  });
});
