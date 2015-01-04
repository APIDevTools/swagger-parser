require('../test-environment.js');

env.resolved.nonObjectRefs =
{
  "info": {
    "version": "1.0.0",
    "description": "This file has $ref pointers to things other than plain objects",
    "title": "non-object refs"
  },
  "definitions": {
    "pet": {
      "properties": {
        "type": {
          "enum": [
            "cat",
            "dog",
            "bird"
          ],
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      }
    },
    "error": {
      "properties": {
        "message": {
          "type": "string"
        },
        "code": {
          "minimum": 400,
          "type": "integer"
        }
      }
    }
  },
  "swagger": "2.0",
  "paths": {
    "/pets": {
      "post": {
        "responses": {
          "default": {
            "description": "references the \"error\" definition",
            "schema": {
              "properties": {
                "message": {
                  "enum": {
                    "$ref": "#/definitions/pet/properties/type/enum"
                  },
                  "type": "string"
                },
                "code": {
                  "minimum": {
                    "$ref": "#/definitions/error/properties/code/minimum"
                  },
                  "type": "integer"
                }
              }
            }
          }
        },
        "parameters": [
          {
            "required": true,
            "in": "body",
            "description": "references the \"pet\" definition",
            "name": "pet",
            "schema": {
              "properties": {
                "type": {
                  "enum": {
                    "$ref": "#/definitions/pet/properties/type/enum"
                  },
                  "type": "string"
                },
                "name": {
                  "type": {
                    "$ref": "#/definitions/pet/properties/name/type"
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
};
