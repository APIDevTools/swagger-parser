"use strict";

module.exports = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    description: "This API contains circular (recursive) JSON references",
    title: "Circular $Refs",
  },
  paths: {
    "/pet": {
      get: {
        responses: {
          200: {
            description: "Returns a pet",
            schema: {
              $ref: "#/definitions/pet",
            },
          },
        },
      },
    },
    "/thing": {
      get: {
        responses: {
          200: {
            description: "Returns a thing",
            schema: {
              $ref: "#/definitions/thing",
            },
          },
        },
      },
    },
    "/person": {
      get: {
        responses: {
          200: {
            description: "Returns a person",
            schema: {
              $ref: "#/definitions/person",
            },
          },
        },
      },
    },
    "/parent": {
      get: {
        responses: {
          200: {
            description: "Returns a parent",
            schema: {
              $ref: "#/definitions/parent",
            },
          },
        },
      },
    },
  },
  definitions: {
    pet: {
      type: "object",
      properties: {
        age: {
          type: "number",
        },
        name: {
          type: "string",
        },
        species: {
          enum: ["cat", "dog", "bird", "fish"],
          type: "string",
        },
      },
      title: "pet",
    },
    thing: {
      $ref: "#/definitions/thing",
    },
    person: {
      title: "person",
      type: "object",
      properties: {
        spouse: {
          $ref: "#/definitions/person",
        },
        name: {
          type: "string",
        },
      },
    },
    parent: {
      title: "parent",
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        children: {
          items: {
            $ref: "#/definitions/child",
          },
          type: "array",
        },
      },
    },
    child: {
      title: "child",
      type: "object",
      properties: {
        parents: {
          items: {
            $ref: "#/definitions/parent",
          },
          type: "array",
        },
        name: {
          type: "string",
        },
      },
    },
  },
};
