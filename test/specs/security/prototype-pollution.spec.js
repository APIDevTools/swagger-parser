"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");

describe("Security", () => {
  it("should reject unsafe JSON Pointer assignment tokens", async () => {
    const pollutionKey = "swaggerParserPolluted";
    const $refs = await SwaggerParser.resolve({
      openapi: "3.0.0",
      info: { title: "Security test", version: "1.0.0" },
      paths: {},
    });

    const unsafePointers = [
      `#/__proto__/${pollutionKey}`,
      `#/constructor/prototype/${pollutionKey}`,
      `#/prototype/${pollutionKey}`,
    ];

    try {
      for (const pointer of unsafePointers) {
        expect(() => $refs.set(pointer, true)).to.throw("Unsafe JSON Pointer token");
      }
      expect({}[pollutionKey]).to.equal(undefined);
    } finally {
      delete Object.prototype[pollutionKey];
    }
  });
});
