import { SwaggerParser } from "../..";
import { expect } from "vitest";
import path from "./path";
const isDom = typeof window !== "undefined" && typeof window.document !== "undefined";

const helper = {
  /**
   * Throws an error if called.
   */
  shouldNotGetCalled() {
    throw new Error("This function should not have gotten called.");
  },

  /**
   * Tests the {@link SwaggerParser.resolve} method,
   * and asserts that the given file paths resolve to the given values.
   *
   * @param {...*} [params] - Additional file paths and resolved values
   * @returns {Function}
   */
  testResolve(...params: any[]) {
    // eslint-disable-line no-unused-vars
    const schemaFile = path.rel(arguments[0]);
    const parsedAPI = arguments[1];
    const expectedFiles: any[] = [];
    const expectedValues: any[] = [];
    for (let i = 0; i < arguments.length; i++) {
      expectedFiles.push(path.abs(arguments[i]));
      expectedValues.push(arguments[++i]);
    }

    return async () => {
      const parser = new SwaggerParser();
      const $refs = await parser.resolve(schemaFile);

      expect(parser.api).to.deep.equal(parsedAPI);
      expect(parser.$refs).to.equal($refs);

      // Resolved file paths
      expect($refs.paths()).to.have.same.members(expectedFiles);
      if (!isDom) {
        expect($refs.paths("file")).to.have.same.members(expectedFiles);
        expect($refs.paths("http")).to.be.an("array").with.lengthOf(0);
      } else {
        expect($refs.paths("http", "https")).to.have.same.members(expectedFiles);
        expect($refs.paths("fs")).to.be.an("array").with.lengthOf(0);
      }

      // Resolved values
      const values = $refs.values();
      expect(values).to.have.keys(expectedFiles);
      for (const [i, file] of expectedFiles.entries()) {
        // @ts-ignore
        const actual = helper.convertNodeBuffersToPOJOs(values[file]);
        const expected = expectedValues[i];
        expect(actual).to.deep.equal(expected, file);
      }
    };
  },

  /**
   * Converts Buffer objects to POJOs, so they can be compared using Chai
   */
  convertNodeBuffersToPOJOs(value: any) {
    if (value && (value._isBuffer || (value.constructor && value.constructor.name === "Buffer"))) {
      // Convert Buffers to POJOs for comparison
      value = value.toJSON();
    }
    return value;
  },

  /**
   * Creates a deep clone of the given value.
   */
  cloneDeep(value: any) {
    let clone = value;
    if (value && typeof value === "object") {
      clone = value instanceof Array ? [] : {};
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        clone[keys[i]] = helper.cloneDeep(value[keys[i]]);
      }
    }
    return clone;
  },
};
export default helper;
