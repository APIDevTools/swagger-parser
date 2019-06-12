"use strict";

const dereferencedSchema = module.exports =
{
  swagger: "2.0",
  info: {
    version: "1.0.0",
    description: "This API contains circular (recursive) JSON references",
    title: "Circular $Refs"
  },
  paths: {
    "/pet": {
      get: {
        responses: {
          200: {
            description: "Returns a pet",
            schema: null
          }
        }
      }
    },
    "/thing": {
      get: {
        responses: {
          200: {
            description: "Returns a thing",
            schema: null
          }
        }
      }
    },
    "/person": {
      get: {
        responses: {
          200: {
            description: "Returns a person",
            schema: null
          }
        }
      }
    },
    "/parent": {
      get: {
        responses: {
          200: {
            description: "Returns a parent",
            schema: null
          }
        }
      }
    }
  },
  definitions: {
    pet: {
      type: "object",
      properties: {
        age: {
          type: "number"
        },
        name: {
          type: "string"
        },
        species: {
          enum: [
            "cat",
            "dog",
            "bird",
            "fish"
          ],
          type: "string"
        }
      },
      title: "pet"
    },
    thing: {
      $ref: "#/definitions/thing"
    },
    person: {
      title: "person",
      type: "object",
      properties: {
        spouse: null,
        name: {
          type: "string"
        }
      }
    },
    parent: {
      title: "parent",
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        children: {
          items: null,
          type: "array"
        }
      }
    },
    child: {
      title: "child",
      type: "object",
      properties: {
        parents: {
          items: null,
          type: "array"
        },
        name: {
          type: "string"
        }
      }
    }
  }
};

dereferencedSchema.paths["/pet"].get.responses["200"].schema =
  dereferencedSchema.definitions.pet;

dereferencedSchema.paths["/thing"].get.responses["200"].schema =
  dereferencedSchema.definitions.thing;

dereferencedSchema.paths["/person"].get.responses["200"].schema =
  dereferencedSchema.definitions.person.properties.spouse =
    dereferencedSchema.definitions.person;

dereferencedSchema.definitions.parent.properties.children.items =
  dereferencedSchema.definitions.child;

dereferencedSchema.paths["/parent"].get.responses["200"].schema =
  dereferencedSchema.definitions.child.properties.parents.items =
    dereferencedSchema.definitions.parent;
