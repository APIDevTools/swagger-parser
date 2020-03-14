"use strict";

const SwaggerParser = require("../..");
const { host } = require("@jsdevtools/host-environment");
const { expect } = require("chai");
const path = require("./path");

const helper = module.exports = {
  /**
   * Throws an error if called.
   */
  shouldNotGetCalled () {
    throw new Error("This function should not have gotten called.");
  },

  /**
   * Tests the {@link SwaggerParser.resolve} method,
   * and asserts that the given file paths resolve to the given values.
   *
   * @param {string} filePath - The file path that should be resolved
   * @param {*} resolvedValue - The resolved value of the file
   * @param {...*} [params] - Additional file paths and resolved values
   * @returns {Function}
   */
  testResolve (filePath, resolvedValue, params) {
    let schemaFile = path.rel(arguments[0]);
    let parsedAPI = arguments[1];
    let expectedFiles = [], expectedValues = [];
    for (let i = 0; i < arguments.length; i++) {
      expectedFiles.push(path.abs(arguments[i]));
      expectedValues.push(arguments[++i]);
    }

    return async () => {
      let parser = new SwaggerParser();
      let $refs = await parser.resolve(schemaFile);

      expect(parser.api).to.deep.equal(parsedAPI);
      expect(parser.$refs).to.equal($refs);

      // Resolved file paths
      expect($refs.paths()).to.have.same.members(expectedFiles);
      if (host.node) {
        expect($refs.paths(["file"])).to.have.same.members(expectedFiles);
        expect($refs.paths("http")).to.be.an("array").with.lengthOf(0);
      }
      else {
        expect($refs.paths(["http", "https"])).to.have.same.members(expectedFiles);
        expect($refs.paths("fs")).to.be.an("array").with.lengthOf(0);
      }

      // Resolved values
      let values = $refs.values();
      expect(values).to.have.keys(expectedFiles);
      for (let [i, file] of expectedFiles.entries()) {
        let actual = helper.convertNodeBuffersToPOJOs(values[file]);
        let expected = expectedValues[i];
        expect(actual).to.deep.equal(expected, file);
      }
    };
  },

  /**
   * Converts Buffer objects to POJOs, so they can be compared using Chai
   */
  convertNodeBuffersToPOJOs (value) {
    if (value && (value._isBuffer || (value.constructor && value.constructor.name === "Buffer"))) {
      // Convert Buffers to POJOs for comparison
      value = value.toJSON();

      if (host.node && host.node.version < 4) {
        // Node v0.10 serializes buffers differently
        value = { type: "Buffer", data: value };
      }
    }
    return value;
  },

  /**
   * Creates a deep clone of the given value.
   */
  cloneDeep (value) {
    let clone = value;
    if (value && typeof value === "object") {
      clone = value instanceof Array ? [] : {};
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        clone[keys[i]] = helper.cloneDeep(value[keys[i]]);
      }
    }
    return clone;
  },
};
