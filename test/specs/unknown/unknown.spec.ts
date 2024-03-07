import { expect, it, describe } from "vitest";
import SwaggerParser from "../../../lib/index.js";
import helper from "../../utils/helper";
import path from "../../utils/path";
import parsedAPI from "./parsed";
import dereferencedAPI from "./dereferenced";

describe("API with $refs to unknown file types", () => {
  it("should parse successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.parse(path.rel("test/specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);
    expect(api).to.deep.equal(parsedAPI.api);
    expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/unknown/unknown.yaml")]);
  });

  it(
    "should resolve successfully",
    helper.testResolve(
      "specs/unknown/unknown.yaml",
      parsedAPI.api,
      "specs/unknown/files/blank",
      parsedAPI.blank,
      "specs/unknown/files/text.txt",
      parsedAPI.text,
      "specs/unknown/files/page.html",
      parsedAPI.html,
      "specs/unknown/files/binary.png",
      parsedAPI.binary,
    ),
  );

  it("should dereference successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.dereference(path.rel("test/specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);

    api.paths["/files/text"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/text"].get.responses["200"].default,
    );

    api.paths["/files/html"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/html"].get.responses["200"].default,
    );

    api.paths["/files/blank"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/blank"].get.responses["200"].default,
    );

    api.paths["/files/binary"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/binary"].get.responses["200"].default,
    );
  });

  it("should validate successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.validate(path.rel("test/specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);

    api.paths["/files/text"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/text"].get.responses["200"].default,
    );

    api.paths["/files/html"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/html"].get.responses["200"].default,
    );

    api.paths["/files/blank"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/blank"].get.responses["200"].default,
    );

    api.paths["/files/binary"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/binary"].get.responses["200"].default,
    );
  });

  it("should bundle successfully", async () => {
    const parser = new SwaggerParser();
    const api = await parser.bundle(path.rel("test/specs/unknown/unknown.yaml"));

    expect(api).to.equal(parser.api);

    api.paths["/files/text"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/text"].get.responses["200"].default,
    );

    api.paths["/files/html"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/html"].get.responses["200"].default,
    );

    api.paths["/files/blank"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/blank"].get.responses["200"].default,
    );

    api.paths["/files/binary"].get.responses["200"].default = helper.convertNodeBuffersToPOJOs(
      dereferencedAPI.paths["/files/binary"].get.responses["200"].default,
    );
  });
});
