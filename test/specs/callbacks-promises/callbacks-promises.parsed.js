helper.parsed.callbacksPromises =
{
  swagger: "2.0",
  info: {
    version: "1.0.0",
    description: "This is an intentionally over-complicated API that returns a person's name",
    title: "Name API"
  },
  paths: {
    "/people/{name}": {
      parameters: [
        {
          required: true,
          type: "string",
          name: "name",
          in: "path"
        }
      ],
      get: {
        responses: {
          200: {
            description: "Returns the requested name",
            schema: {
              $ref: "#/definitions/name"
            }
          }
        }
      }
    }
  },
  definitions: {
    requiredString: {
      minLength: 1,
      type: "string",
      title: "requiredString"
    },
    name: {
      required: [
        "first",
        "last"
      ],
      type: "object",
      properties: {
        middle: {
          type: "string",
          enum: [
            { $ref: "#/definitions/name/properties/first/type" },
            { $ref: "#/definitions/name/properties/last/title" }
          ]
        },
        prefix: {
          minLength: 3,
          $ref: "#/definitions/name/properties/last"
        },
        last: {
          $ref: "#/definitions/name/properties/first"
        },
        suffix: {
          $ref: "#/definitions/name/properties/prefix",
          type: "string",
          maxLength: 3
        },
        first: {
          $ref: "#/definitions/requiredString"
        }
      }
    }
  }
};
