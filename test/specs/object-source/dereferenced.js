"use strict";

module.exports =
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
              title: "name",
              type: "object",
              required: [
                "first",
                "last"
              ],
              properties: {
                first: {
                  title: "requiredString",
                  type: "string",
                  minLength: 1
                },
                last: {
                  title: "requiredString",
                  type: "string",
                  minLength: 1
                },
                middle: {
                  type: "string",
                  minLength: 1
                },
                prefix: {
                  title: "requiredString",
                  type: "string",
                  minLength: 3
                },
                suffix: {
                  title: "requiredString",
                  type: "string",
                  minLength: 3,
                  maxLength: 3
                }
              }
            },
          }
        }
      }
    }
  },
  definitions: {
    requiredString: {
      title: "requiredString",
      type: "string",
      minLength: 1
    },
    string: "string",
    name: {
      title: "name",
      type: "object",
      required: [
        "first",
        "last"
      ],
      properties: {
        first: {
          title: "requiredString",
          type: "string",
          minLength: 1
        },
        last: {
          title: "requiredString",
          type: "string",
          minLength: 1
        },
        middle: {
          type: "string",
          minLength: 1
        },
        prefix: {
          title: "requiredString",
          type: "string",
          minLength: 3
        },
        suffix: {
          title: "requiredString",
          type: "string",
          minLength: 3,
          maxLength: 3
        }
      }
    }
  }
};
