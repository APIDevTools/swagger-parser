"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const path = require("../../utils/path");

describe("Invalid APIs (OpenAPI v3.0 specification validation)", () => {
  let tests = [
    {
      name: "duplicate path parameters",
      valid: false,
      file: "duplicate-path-params.yaml",
      error: 'Validation failed. /paths/users/{username} has duplicate parameters\nValidation failed. Found multiple header parameters named \"foo\"'
    },
    {
      name: "duplicate operation parameters",
      valid: false,
      file: "duplicate-operation-params.yaml",
      error: 'Validation failed. /paths/users/{username}/get has duplicate parameters\nValidation failed. Found multiple path parameters named \"username\"'
    },
    {
      name: "multiple parameters in path",
      valid: false,
      file: "multiple-path-params.yaml",
      error: 'Validation failed. Found multiple path parameters named \"username\"'
    },
    {
      name: "multiple parameters in query",
      valid: false,
      file: "multiple-query-params.yaml",
      error: 'Validation failed. Found multiple query parameters named \"username\"'
    },
    {
      name: "multiple parameters in header",
      valid: false,
      file: "multiple-header-params.yaml",
      error: 'Validation failed. Found multiple header parameters named \"username\"'
    },
    {
      name: "multiple parameters in cookie",
      valid: false,
      file: "multiple-cookie-params.yaml",
      error: 'Validation failed. Found multiple cookie parameters named \"username\"'
    },
    {
      name: "path param with no placeholder",
      valid: false,
      file: "path-param-no-placeholder.yaml",
      error: 'Validation failed. /paths/users/{username}/post has a path parameter named \"foo\", but there is no corresponding {foo} in the path string'
    },
    {
      name: "path placeholder with no param",
      valid: false,
      file: "path-placeholder-no-param.yaml",
      error: "Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {foo}"
    },
    {
      name: "duplicate path placeholders",
      valid: false,
      file: "duplicate-path-placeholders.yaml",
      error: "Validation failed. /paths/users/{username}/profile/{username}/image/{img_id}/get has multiple path placeholders named {username}"
    },
    {
      name: "no path parameters",
      valid: false,
      file: "no-path-params.yaml",
      error: "Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {username},{foo}"
    },
    {
      name: "array param without items",
      valid: false,
      file: "param-array-no-items.yaml",
      error: 'Validation failed. /paths/users/get/parameters/tags is an array, so it must include an \"items\" schema'
    },
    {
      name: "response array without items",
      valid: false,
      file: "response-array-no-items.yaml",
      error: 'Validation failed. /paths/users/get/responses/default/content/application/json/schema is an array, so it must include an "items" schema'
    },
    {
      name: "response header array without items",
      valid: false,
      file: "response-header-array-no-items.yaml",
      error: 'Validation failed. /paths/users/get/responses/default/headers/Last-Modified is an array, so it must include an \"items\" schema'
    },
    {
      name: "required property in param does not exist",
      valid: false,
      file: "required-property-not-defined-param.yaml",
      error: "Validation failed. Property 'notExists' listed as required but does not exist in '/paths/pets/post/parameters/pet'"
    },
    {
      name: "required property in components/parameters does not exist",
      valid: false,
      file: "required-property-not-defined-components-parameters.yaml",
      error: "Validation failed. Property \'paramNotExists\' listed as required but does not exist"
    },
    {
      name: "required property in unused components/parameters does not exist",
      valid: false,
      file: "required-property-not-defined-components-parameters-unused.yaml",
      error: "Validation failed. Property \'paramUnusedNotExists\' listed as required but does not exist"
    },
    {
      name: "required property in components/requestBodies does not exist",
      valid: false,
      file: "required-property-not-defined-components-requestBodies.yaml",
      error: "Validation failed. Property \'reqBodyNotExists\' listed as required but does not exist"
    },
    {
      name: "required property in components/schemas does not exist",
      valid: false,
      file: "required-property-not-defined-components-schemas.yaml",
      error: "Validation failed. Property \'notExists\' listed as required but does not exist"
    },
    {
      name: "required property in components/schemas second-level does not exist",
      valid: false,
      file: "required-property-not-defined-components-schemas-recursive.yaml",
      error: "Validation failed. Property \'secondLevelNotExists\' listed as required but does not exist"
    },
    {
      name: "required property in components/responses does not exist",
      valid: false,
      file: "required-property-not-defined-components-responses.yaml",
      error: "Validation failed. Property \'photoUrls\' listed as required but does not exist"
    },
    {
      name: "required property in components/parameters does not exist",
      valid: false,
      file: "required-property-not-defined-components-parameters.yaml",
      error: "Validation failed. Property \'paramNotExists\' listed as required but does not exist"
    },
    {
      name: "schema declares required properties which are inherited (allOf)",
      valid: true,
      file: "inherited-required-properties.yaml"
    },
    {
      name: "duplicate operation IDs",
      valid: false,
      file: "duplicate-operation-ids.yaml",
      error: "Validation failed. Duplicate operation id 'users'"
    }
  ];

  it('should pass validation if "options.validate.spec" is false', async () => {
    let invalid = tests[0];
    expect(invalid.valid).to.equal(false);

    const api = await SwaggerParser
      .validate(path.rel("specs/validate-spec/invalid-v3/" + invalid.file), { validate: { spec: false }});
    expect(api).to.be.an("object");
    expect(api.openapi).to.match(/^3\.0/);
  });

  for (let test of tests) {
    if (test.valid) {
      it(test.name, async () => {
        try {
          const api = await SwaggerParser
            .validate(path.rel("specs/validate-spec/valid-v3/" + test.file));
          expect(api).to.be.an("object");
          expect(api.openapi).to.match(/^3\.0/);
        }
        catch (err) {
          throw new Error("Validation should have succeeded, but it failed!\n File:" + test.file + "\n" + err.stack);
        }
      });
    }
    else {
      it(test.name, async () => {
        try {
          await SwaggerParser.validate(path.rel("specs/validate-spec/invalid-v3/" + test.file));
          throw new Error("Validation should have failed, but it succeeded!\n File:" + test.file + "\n");
        }
        catch (err) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.include(test.error);
          expect(err.message).to.match(/^Specification check failed.\sValidation failed./);
        }
      });
    }
  }
});
