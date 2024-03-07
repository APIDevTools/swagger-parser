import SwaggerParser from "../../../lib/index.js";
import helper from "../../utils/helper";
import path from "../../utils/path";
import parsedAPI from "./parsed";
import dereferencedAPI from "./dereferenced";
import bundledAPI from "./bundled";
import { expect, it, describe } from "vitest";

describe("Callback & Promise syntax", () => {
  const methods = ["parse", "resolve", "dereference", "bundle", "validate"] as const;
  type Method = (typeof methods)[number];
  for (const method of methods) {
    describe(`${method} method`, () => {
      it("should call the callback function upon success", testCallbackSuccess(method));
      it("should call the callback function upon failure", testCallbackError(method));
      it("should resolve the Promise upon success", testPromiseSuccess(method));
      it("should reject the Promise upon failure", testPromiseError(method));
    });
  }

  function testCallbackSuccess(method: Method) {
    return (done: (e?: unknown) => void) => {
      const parser = new SwaggerParser();
      parser[method](path.rel("test/specs/callbacks-promises/callbacks-promises.yaml"), (err, result) => {
        try {
          expect(err).to.equal(null);
          expect(result).to.be.an("object");
          expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/callbacks-promises/callbacks-promises.yaml")]);

          if (method === "resolve") {
            expect(result).to.equal(parser.$refs);
          } else {
            expect(result).to.equal(parser.schema);

            // Make sure the API was parsed correctly
            const expected = getSchema(method);
            expect(result).to.deep.equal(expected);
          }
          done();
        } catch (e: any) {
          done(e);
        }
      });
    };
  }

  function testCallbackError(method: Method) {
    return (done: (e?: unknown) => void) => {
      (SwaggerParser[method] as any)(
        path.rel("test/specs/callbacks-promises/callbacks-promises-error.yaml"),
        (err: any, result: any) => {
          try {
            expect(err).to.be.an.instanceOf(SyntaxError);
            expect(result).to.equal(undefined);
            done();
          } catch (e: any) {
            done(e);
          }
        },
      );
    };
  }

  function testPromiseSuccess(method: Method) {
    return () => {
      const parser = new SwaggerParser();
      return parser[method](path.rel("test/specs/callbacks-promises/callbacks-promises.yaml")).then((result) => {
        expect(result).to.be.an("object");
        expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/callbacks-promises/callbacks-promises.yaml")]);

        if (method === "resolve") {
          expect(result).to.equal(parser.$refs);
        } else {
          expect(result).to.equal(parser.schema);

          // Make sure the API was parsed correctly
          const expected = getSchema(method);
          expect(result).to.deep.equal(expected);
        }
      });
    };
  }

  function testPromiseError(method: Method) {
    return () =>
      (SwaggerParser[method] as any)(path.rel("test/specs/callbacks-promises/callbacks-promises-error.yaml"))
        .then(helper.shouldNotGetCalled)
        .catch((err: any) => {
          expect(err).to.be.an.instanceOf(SyntaxError);
        });
  }

  function getSchema(method: Method) {
    switch (method) {
      case "parse":
        return parsedAPI;
      case "dereference":
      case "validate":
        return dereferencedAPI;
      case "bundle":
        return bundledAPI;
    }
  }
});
