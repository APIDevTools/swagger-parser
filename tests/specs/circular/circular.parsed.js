helper.parsed.circularExternal =
{
  api: {
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
              "schema": {
                "$ref": "#/definitions/thing"
              }
            }
          }
        }
      },
      "/person": {
        "get": {
          "responses": {
            "200": {
              "description": "Returns a person",
              "schema": {
                "$ref": "#/definitions/person"
              }
            }
          }
        }
      },
      "/parent": {
        "get": {
          "responses": {
            "200": {
              "description": "Returns a parent",
              "schema": {
                "$ref": "#/definitions/parent"
              }
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
        "$ref": "definitions/person.yaml"
      },
      "parent": {
        "$ref": "definitions/parent.yaml"
      },
      "child": {
        "$ref": "definitions/child.yaml"
      }
    }
  },

  child: {
    "type": "object",
    "properties": {
      "parents": {
        "items": {
          "$ref": "parent.yaml"
        },
        "type": "array"
      },
      "name": {
        "type": "string"
      }
    },
    "title": "child"
  },

  parent: {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "children": {
        "items": {
          "$ref": "child.yaml"
        },
        "type": "array"
      }
    },
    "title": "parent"
  },

  person: {
    "type": "object",
    "properties": {
      "spouse": {
        "$ref": "person.yaml"
      },
      "name": {
        "type": "string"
      }
    },
    "title": "person"
  }
};
