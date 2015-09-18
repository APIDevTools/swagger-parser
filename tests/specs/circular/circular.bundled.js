helper.bundled.circularExternal =
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
      "$ref": "#/definitions/thing"
    },
    "person": {
      "title": "person",
      "type": "object",
      "properties": {
        "spouse": {
          "type": {
            "$ref": "#/definitions/person"
          }
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
          "items": {
            "$ref": "#/definitions/child"
          },
          "type": "array"
        }
      }
    },
    "child": {
      "title": "child",
      "type": "object",
      "properties": {
        "parents": {
          "items": {
            "$ref": "#/definitions/parent"
          },
          "type": "array"
        },
        "name": {
          "type": "string"
        }
      }
    }
  }
};
