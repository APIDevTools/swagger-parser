"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const helper = require("../../utils/helper");
const path = require("../../utils/path");
const parsedSchema = require("./parsed");
const dereferencedSchema = require("./dereferenced");
const bundledSchema = require("./bundled");

describe("Callback & Promise syntax", function () {
  ["parse", "resolve", "dereference", "bundle", "validate"].forEach(function (method) {
    describe(method + " method", function () {
      it("should call the callback function upon success", testCallbackSuccess(method));
      it("should call the callback function upon failure", testCallbackError(method));
      it("should resolve the Promise upon success", testPromiseSuccess(method));
      it("should reject the Promise upon failure", testPromiseError(method));
    });
  });

  function testCallbackSuccess (method) {
    return function (done) {
      let parser = new SwaggerParser();
      parser[method](path.rel("specs/callbacks-promises/callbacks-promises.yaml"), function (err, result) {
        try {
          expect(err).to.be.null;
          expect(result).to.be.an("object").and.ok;
          expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/callbacks-promises/callbacks-promises.yaml")]);

          if (method === "resolve") {
            expect(result).to.equal(parser.$refs);
          }
          else {
            expect(result).to.equal(parser.schema);

            // Make sure the API was parsed correctly
            let expected = getSchema(method);
            expect(result).to.deep.equal(expected);
          }
          done();
        }
        catch (e) {
          done(e);
        }
      });
    };
  }

  function testCallbackError (method) {
    return function (done) {
      SwaggerParser[method](path.rel("specs/callbacks-promises/callbacks-promises-error.yaml"), function (err, result) {
        try {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(result).to.be.undefined;
          done();
        }
        catch (e) {
          done(e);
        }
      });
    };
  }

  function testPromiseSuccess (method) {
    return function () {
      let parser = new SwaggerParser();
      return parser[method](path.rel("specs/callbacks-promises/callbacks-promises.yaml"))
        .then(function (result) {
          expect(result).to.be.an("object").and.ok;
          expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/callbacks-promises/callbacks-promises.yaml")]);

          if (method === "resolve") {
            expect(result).to.equal(parser.$refs);
          }
          else {
            expect(result).to.equal(parser.schema);

            // Make sure the API was parsed correctly
            let expected = getSchema(method);
            expect(result).to.deep.equal(expected);
          }
        });
    };
  }

  function testPromiseError (method) {
    return function () {
      return SwaggerParser[method](path.rel("specs/callbacks-promises/callbacks-promises-error.yaml"))
        .then(helper.shouldNotGetCalled)
        .catch(function (err) {
          expect(err).to.be.an.instanceOf(SyntaxError);
        });
    };
  }

  function getSchema (method) {
    switch (method) {
      case "parse":
        return parsedSchema;
      case "dereference":
      case "validate":
        return dereferencedSchema;
      case "bundle":
        return bundledSchema;
    }
  }

});
