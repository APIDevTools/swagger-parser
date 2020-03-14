"use strict";

const { host } = require("@jsdevtools/host-environment");
const { expect } = require("chai");
const SwaggerParser = require("../../..");
const helper = require("../../utils/helper");
const path = require("../../utils/path");
const parsedAPI = require("./parsed");
const dereferencedAPI = require("./dereferenced");

describe("API with $refs to unknown file types", () => {
  let windowOnError, testDone;

  beforeEach(() => {
    // Some old Webkit browsers throw an error when downloading zero-byte files.
    windowOnError = host.global.onerror;
    host.global.onerror = function () {
      testDone();
      return true;
    };
  });

  afterEach(() => {
    host.global.onerror = windowOnError;
  });

  it("should parse successfully", async () => {
    let parser = new SwaggerParser();
    let api = await parser.parse(path.rel("specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(parsedAPI.api);
    expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/unknown/unknown.yaml")]);
  });

  it("should resolve successfully", helper.testResolve(
    "specs/unknown/unknown.yaml", parsedAPI.api,
    "specs/unknown/files/blank", parsedAPI.blank,
    "specs/unknown/files/text.txt", parsedAPI.text,
    "specs/unknown/files/page.html", parsedAPI.html,
    "specs/unknown/files/binary.png", parsedAPI.binary
  ));

  it("should dereference successfully", async () => {
    let parser = new SwaggerParser();
    let api = await parser.dereference(path.rel("specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);

    api.paths["/files/text"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/text"].get.responses["200"].default);

    api.paths["/files/html"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/html"].get.responses["200"].default);

    api.paths["/files/blank"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/blank"].get.responses["200"].default);

    api.paths["/files/binary"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/binary"].get.responses["200"].default);
  });

  it("should validate successfully", async () => {
    let parser = new SwaggerParser();
    let api = await parser.validate(path.rel("specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);

    api.paths["/files/text"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/text"].get.responses["200"].default);

    api.paths["/files/html"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/html"].get.responses["200"].default);

    api.paths["/files/blank"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/blank"].get.responses["200"].default);

    api.paths["/files/binary"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/binary"].get.responses["200"].default);
  });

  it("should bundle successfully", async () => {
    let parser = new SwaggerParser();
    let api = await parser.bundle(path.rel("specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);

    api.paths["/files/text"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/text"].get.responses["200"].default);

    api.paths["/files/html"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/html"].get.responses["200"].default);

    api.paths["/files/blank"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/blank"].get.responses["200"].default);

    api.paths["/files/binary"].get.responses["200"].default =
      helper.convertNodeBuffersToPOJOs(dereferencedAPI.paths["/files/binary"].get.responses["200"].default);
  });
});
