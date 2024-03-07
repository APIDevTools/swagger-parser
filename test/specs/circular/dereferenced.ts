const dereferencedAPI = {
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
            schema: null,
          },
        },
      },
    },
    "/thing": {
      get: {
        responses: {
          200: {
            description: "Returns a thing",
            schema: null,
          },
        },
      },
    },
    "/person": {
      get: {
        responses: {
          200: {
            description: "Returns a person",
            schema: null,
          },
        },
      },
    },
    "/parent": {
      get: {
        responses: {
          200: {
            description: "Returns a parent",
            schema: null,
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
        spouse: null,
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
          items: null,
          type: "array",
        },
      },
    },
    child: {
      title: "child",
      type: "object",
      properties: {
        parents: {
          items: null,
          type: "array",
        },
        name: {
          type: "string",
        },
      },
    },
  },
};

// @ts-ignore
dereferencedAPI.paths["/pet"].get.responses["200"].schema = dereferencedAPI.definitions.pet;
// @ts-ignore
dereferencedAPI.paths["/thing"].get.responses["200"].schema = dereferencedAPI.definitions.thing;
// @ts-ignore
dereferencedAPI.paths["/person"].get.responses["200"].schema = dereferencedAPI.definitions.person.properties.spouse =
  dereferencedAPI.definitions.person;
// @ts-ignore
dereferencedAPI.definitions.parent.properties.children.items = dereferencedAPI.definitions.child;
// @ts-ignore
dereferencedAPI.paths["/parent"].get.responses["200"].schema =
  // @ts-ignore
  dereferencedAPI.definitions.child.properties.parents.items = dereferencedAPI.definitions.parent;

export default dereferencedAPI;
