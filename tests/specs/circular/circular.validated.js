helper.validated.circularExternal =
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
      "$ref": "#/definitions/thing"
    },
    "person": {
      "title": "person",
      "type": "object",
      "properties": {
        "spouse": null,
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

helper.validated.circularExternal.paths['/thing'].get.responses['200'].schema =
  helper.validated.circularExternal.definitions.thing;

helper.validated.circularExternal.paths['/person'].get.responses['200'].schema =
  helper.validated.circularExternal.definitions.person.properties.spouse =
  helper.validated.circularExternal.definitions.person;

helper.validated.circularExternal.definitions.parent.properties.children.items =
  helper.validated.circularExternal.definitions.child;

helper.validated.circularExternal.paths['/parent'].get.responses['200'].schema =
  helper.validated.circularExternal.definitions.child.properties.parents.items =
  helper.validated.circularExternal.definitions.parent;
