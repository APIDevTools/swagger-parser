"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../..");

describe("Exports", () => {
  it("should export the SwaggerParser class", (done) => {
    expect(SwaggerParser).to.be.a("function");
    done();
  });

  it("should export the YAML object", (done) => {
    expect(SwaggerParser.YAML).to.be.an("object");
    expect(SwaggerParser.YAML.parse).to.be.a("function");
    expect(SwaggerParser.YAML.stringify).to.be.a("function");
    done();
  });

  it("should export all the static methods of SwaggerParser", (done) => {
    expect(SwaggerParser.parse).to.be.a("function");
    expect(SwaggerParser.resolve).to.be.a("function");
    expect(SwaggerParser.bundle).to.be.a("function");
    expect(SwaggerParser.dereference).to.be.a("function");
    done();
  });

  it("should export the validate method", (done) => {
    expect(SwaggerParser.validate).to.be.a("function");
    done();
  });
});
