"use strict";

module.exports = {
  api: {
    info: {
      version: "1.0.0",
      description: "This API contains circular (recursive) JSON references",
      title: "Circular $Refs",
    },
    paths: {
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
    },
    swagger: "2.0",
    definitions: {
      pet: {
        $ref: "definitions/pet.yaml",
      },
      thing: {
        $ref: "circular.yaml#/definitions/thing",
      },
      person: {
        $ref: "definitions/person.yaml",
      },
      parent: {
        $ref: "definitions/parent.yaml",
      },
      child: {
        $ref: "definitions/child.yaml",
      },
    },
  },

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

  child: {
    type: "object",
    properties: {
      parents: {
        items: {
          $ref: "parent.yaml",
        },
        type: "array",
      },
      name: {
        type: "string",
      },
    },
    title: "child",
  },

  parent: {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      children: {
        items: {
          $ref: "child.yaml",
        },
        type: "array",
      },
    },
    title: "parent",
  },

  person: {
    type: "object",
    properties: {
      spouse: {
        $ref: "person.yaml",
      },
      name: {
        type: "string",
      },
    },
    title: "person",
  },
};
