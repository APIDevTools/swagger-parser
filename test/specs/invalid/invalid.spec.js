"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const helper = require("../../utils/helper");
const path = require("../../utils/path");

describe("Invalid APIs (can't be parsed)", () => {
  it("not a Swagger API", async () => {
    try {
      await SwaggerParser.parse(path.rel("specs/invalid/not-swagger.yaml"));
      helper.shouldNotGetCalled();
    }
    catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.contain("Unsupported OpenAPI version: undefined. Swagger Parser only supports versions 3.0.0, 3.0.1, 3.0.2");
    }
  });

  it("invalid Swagger version (1.2)", async () => {
    try {
      await SwaggerParser.dereference(path.rel("specs/invalid/old-version.yaml"));
      helper.shouldNotGetCalled();
    }
    catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal("Unrecognized Swagger version: 1.2. Expected 2.0");
    }
  });

  it("invalid Swagger version (3.0)", async () => {
    try {
      await SwaggerParser.bundle(path.rel("specs/invalid/newer-version.yaml"));
      helper.shouldNotGetCalled();
    }
    catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal("Unrecognized Swagger version: 3.0. Expected 2.0");
    }
  });

  it("numeric Swagger version (instead of a string)", async () => {
    try {
      await SwaggerParser.validate(path.rel("specs/invalid/numeric-version.yaml"));
      helper.shouldNotGetCalled();
    }
    catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('Swagger version number must be a string (e.g. \"2.0\") not a number.');
    }
  });

  it("numeric API version (instead of a string)", async () => {
    try {
      await SwaggerParser.validate(path.rel("specs/invalid/numeric-info-version.yaml"));
      helper.shouldNotGetCalled();
    }
    catch (err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.equal('API version number must be a string (e.g. \"1.0.0\") not a number.');
    }
  });
});
