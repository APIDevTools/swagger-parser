require('../test-environment.js');

env.resolved.circularRefs =
{
  "info": {
    "version": "1.0.0",
    "description": "This file contains circular $ref pointers",
    "title": "circular refs"
  },
  "paths": {
    "/pets": {
      "post": {
        "responses": {
          "200": {
            "description": "references the \"person\" definition",
            "schema": {
              "$ref": "person"
            }
          },
          "default": {
            "description": "references the \"parent\" definition",
            "schema": {
              "$ref": "parent"
            }
          }
        }
      }
    }
  },
  "swagger": "2.0",
  "definitions": {
    "person": {
      "properties": {
        "spouse": {
          "type": {
            "$ref": "person"
          }
        },
        "name": {
          "type": "string"
        }
      }
    },
    "parent": {
      "properties": {
        "name": {
          "type": "string"
        },
        "children": {
          "items": {
            "$ref": "child"
          },
          "type": "array"
        }
      }
    },
    "child": {
      "properties": {
        "parents": {
          "items": {
            "$ref": "parent"
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
