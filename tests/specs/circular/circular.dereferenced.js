helper.dereferenced.circularExternal =
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "description": "This API contains circular (recursive) JSON references",
    "title": "Circular $Refs"
  },
  "paths": {
    "/thing": {
      "get": {
        "responses": {
          "200": {
            "description": "Returns a thing",
            "schema": null
          }
        }
      }
    },
    "/person": {
      "get": {
        "responses": {
          "200": {
            "description": "Returns a person",
            "schema": null
          }
        }
      }
    },
    "/parent": {
      "get": {
        "responses": {
          "200": {
            "description": "Returns a parent",
            "schema": null
          }
        }
      }
    }
  },
  "definitions": {
    "thing": {
      "$ref": "circular.yaml#/definitions/thing"
    },
    "person": {
      "title": "person",
      "type": "object",
      "properties": {
        "spouse": {
          "type": null
        },
        "name": {
          "type": "string"
        }
      }
    },
    "parent": {
      "title": "parent",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "children": {
          "items": null,
          "type": "array"
        }
      }
    },
    "child": {
      "title": "child",
      "type": "object",
      "properties": {
        "parents": {
          "items": null,
          "type": "array"
        },
        "name": {
          "type": "string"
        }
      }
    }
  }
};

helper.dereferenced.circularExternal.paths['/thing'].get.responses['200'].schema =
  helper.dereferenced.circularExternal.definitions.thing;

helper.dereferenced.circularExternal.paths['/person'].get.responses['200'].schema =
  helper.dereferenced.circularExternal.definitions.person.properties.spouse.type =
  helper.dereferenced.circularExternal.definitions.person;

helper.dereferenced.circularExternal.definitions.parent.properties.children.items =
  helper.dereferenced.circularExternal.definitions.child;

helper.dereferenced.circularExternal.paths['/parent'].get.responses['200'].schema =
  helper.dereferenced.circularExternal.definitions.child.properties.parents.items =
  helper.dereferenced.circularExternal.definitions.parent;
