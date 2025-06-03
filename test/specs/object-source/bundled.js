"use strict";

module.exports = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    description:
      "This is an intentionally over-complicated API that returns a person's name",
    title: "Name API",
  },
  paths: {
    "/people/{name}": {
      parameters: [
        {
          required: true,
          type: "string",
          name: "name",
          in: "path",
        },
      ],
      get: {
        responses: {
          200: {
            description: "Returns the requested name",
            schema: {
              $ref: "#/definitions/name",
            },
          },
        },
      },
    },
  },
  definitions: {
    requiredString: {
      title: "requiredString",
      type: "string",
      minLength: 1,
    },
    string: {
      $ref: "#/definitions/requiredString/type",
    },
    name: {
      title: "name",
      type: "object",
      required: ["first", "last"],
      properties: {
        first: {
          $ref: "#/definitions/requiredString",
        },
        last: {
          $ref: "#/definitions/requiredString",
        },
        middle: {
          type: {
            $ref: "#/definitions/requiredString/type",
          },
          minLength: {
            $ref: "#/definitions/requiredString/minLength",
          },
        },
        prefix: {
          $ref: "#/definitions/requiredString",
          minLength: 3,
        },
        suffix: {
          $ref: "#/definitions/name/properties/prefix",
          type: "string",
          maxLength: 3,
        },
      },
    },
  },
};
