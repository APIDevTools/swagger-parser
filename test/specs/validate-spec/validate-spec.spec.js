"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const path = require("../../utils/path");

describe("Invalid APIs (Swagger 2.0 specification validation)", () => {
  let tests = [
    {
      name: "invalid response code",
      valid: false,
      file: "invalid-response-code.yaml",
      error:
        "Validation failed. /paths/users/get/responses/888 has an invalid response code (888)",
    },
    {
      name: "duplicate path parameters",
      valid: false,
      file: "duplicate-path-params.yaml",
      error: "Validation failed",
    },
    {
      name: "duplicate operation parameters",
      valid: false,
      file: "duplicate-operation-params.yaml",
      error: "Validation failed",
    },
    {
      name: "multiple body parameters in path",
      valid: false,
      file: "multiple-path-body-params.yaml",
      error:
        "Validation failed. /paths/users/{username}/get has 2 body parameters. Only one is allowed.",
    },
    {
      name: "multiple body parameters in operation",
      valid: false,
      file: "multiple-operation-body-params.yaml",
      error:
        "Validation failed. /paths/users/{username}/patch has 2 body parameters. Only one is allowed.",
    },
    {
      name: "multiple body parameters in path & operation",
      valid: false,
      file: "multiple-body-params.yaml",
      error:
        "Validation failed. /paths/users/{username}/post has 2 body parameters. Only one is allowed.",
    },
    {
      name: "body and formData parameters",
      valid: false,
      file: "body-and-form-params.yaml",
      error:
        "Validation failed. /paths/users/{username}/post has body parameters and formData parameters. Only one or the other is allowed.",
    },
    {
      name: "path param with no placeholder",
      valid: false,
      file: "path-param-no-placeholder.yaml",
      error:
        'Validation failed. /paths/users/{username}/post has a path parameter named \"foo\", but there is no corresponding {foo} in the path string',
    },
    {
      name: "path placeholder with no param",
      valid: false,
      file: "path-placeholder-no-param.yaml",
      error:
        "Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {foo}",
    },
    {
      name: "duplicate path placeholders",
      valid: false,
      file: "duplicate-path-placeholders.yaml",
      error:
        "Validation failed. /paths/users/{username}/profile/{username}/image/{img_id}/get has multiple path placeholders named {username}",
    },
    {
      name: "no path parameters",
      valid: false,
      file: "no-path-params.yaml",
      error:
        "Validation failed. /paths/users/{username}/{foo}/get is missing path parameter(s) for {username},{foo}",
    },
    {
      name: "array param without items",
      valid: false,
      file: "array-no-items.yaml",
      error:
        'Validation failed. /paths/users/get/parameters/tags is an array, so it must include an \"items\" schema',
    },
    {
      name: "array body param without items",
      valid: false,
      file: "array-body-no-items.yaml",
      error:
        'Validation failed. /paths/users/post/parameters/people is an array, so it must include an \"items\" schema',
    },
    {
      name: "array response header without items",
      valid: false,
      file: "array-response-header-no-items.yaml",
      error:
        'Validation failed. /paths/users/get/responses/default/headers/Last-Modified is an array, so it must include an \"items\" schema',
    },
    {
      name: '"file" param without "consumes"',
      valid: false,
      file: "file-no-consumes.yaml",
      error:
        "Validation failed. /paths/users/{username}/profile/image/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",
    },
    {
      name: '"file" param with invalid "consumes"',
      valid: false,
      file: "file-invalid-consumes.yaml",
      error:
        "Validation failed. /paths/users/{username}/profile/image/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",
    },
    {
      name: '"file" param with vendor specific form-data "consumes"',
      valid: true,
      file: "file-vendor-specific-consumes-formdata.yaml",
    },
    {
      name: '"file" param with vendor specific urlencoded "consumes"',
      valid: true,
      file: "file-vendor-specific-consumes-urlencoded.yaml",
    },
    {
      name: "required property in input does not exist",
      valid: false,
      file: "required-property-not-defined-input.yaml",
      error:
        "Validation failed. Property 'notExists' listed as required but does not exist in '/paths/pets/post/parameters/pet'",
    },
    {
      name: "required property in definition does not exist",
      valid: false,
      file: "required-property-not-defined-definitions.yaml",
      error:
        "Validation failed. Property 'photoUrls' listed as required but does not exist in '/definitions/Pet'",
    },
    {
      name: "schema declares required properties which are inherited (allOf)",
      valid: true,
      file: "inherited-required-properties.yaml",
    },
    {
      name: "duplicate operation IDs",
      valid: false,
      file: "duplicate-operation-ids.yaml",
      error: "Validation failed. Duplicate operation id 'users'",
    },
    {
      name: "array response body without items",
      valid: false,
      file: "array-response-body-no-items.yaml",
      error:
        'Validation failed. /paths/users/get/responses/200/schema is an array, so it must include an \"items\" schema',
    },
    {
      name: "only validate required properties on objects",
      valid: true,
      file: "only-validate-required-properties-on-objects.yaml",
    },
  ];

  it('should pass validation if "options.validate.spec" is false', async () => {
    let invalid = tests[0];
    expect(invalid.valid).to.equal(false);

    const api = await SwaggerParser.validate(
      path.rel("specs/validate-spec/invalid/" + invalid.file),
      { validate: { spec: false } },
    );
    expect(api).to.be.an("object");
  });

  for (let test of tests) {
    if (test.valid) {
      it(test.name, async () => {
        try {
          const api = await SwaggerParser.validate(
            path.rel("specs/validate-spec/valid/" + test.file),
          );
          expect(api).to.be.an("object");
        } catch (err) {
          throw new Error(
            "Validation should have succeeded, but it failed!\n" + err.stack,
          );
        }
      });
    } else {
      it(test.name, async () => {
        try {
          await SwaggerParser.validate(
            path.rel("specs/validate-spec/invalid/" + test.file),
          );
          throw new Error("Validation should have failed, but it succeeded!");
        } catch (err) {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(err.message).to.include(test.error);
          expect(err.message).to.match(/Validation failed. \S+/);
        }
      });
    }
  }
});
