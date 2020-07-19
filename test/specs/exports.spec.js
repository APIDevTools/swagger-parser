/* eslint-disable require-await */
"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../..");

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
});
