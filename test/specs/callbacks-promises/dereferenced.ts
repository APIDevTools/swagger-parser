export default {
  definitions: {
    requiredString: {
      minLength: 1,
      type: "string",
      title: "requiredString",
    },
    name: {
      required: ["first", "last"],
      type: "object",
      properties: {
        middle: {
          type: "string",
          enum: ["string", "requiredString"],
        },
        prefix: {
          minLength: 3,
          type: "string",
          title: "requiredString",
        },
        last: {
          minLength: 1,
          type: "string",
          title: "requiredString",
        },
        suffix: {
          minLength: 3,
          maxLength: 3,
          title: "requiredString",
          type: "string",
        },
        first: {
          minLength: 1,
          type: "string",
          title: "requiredString",
        },
      },
    },
  },
  info: {
    version: "1.0.0",
    description: "This is an intentionally over-complicated API that returns a person's name",
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
              required: ["first", "last"],
              type: "object",
              properties: {
                middle: {
                  type: "string",
                  enum: ["string", "requiredString"],
                },
                prefix: {
                  minLength: 3,
                  type: "string",
                  title: "requiredString",
                },
                last: {
                  minLength: 1,
                  type: "string",
                  title: "requiredString",
                },
                suffix: {
                  minLength: 3,
                  maxLength: 3,
                  title: "requiredString",
                  type: "string",
                },
                first: {
                  minLength: 1,
                  type: "string",
                  title: "requiredString",
                },
              },
            },
          },
        },
      },
    },
  },
  swagger: "2.0",
};
