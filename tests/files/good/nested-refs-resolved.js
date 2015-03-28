require('../../test-environment.js');

env.resolved.nestedRefs =
{
  "info": {
    "version": "1.0.0",
    "description": "This file includes nested $ref pointers",
    "title": "nested refs"
  },
  "paths": {
    "/pets": {
      "post": {
        "responses": {
          "200": {
            "description": "A document-relative reference to \"pet\"",
            "schema": {
              "$ref": "#/definitions/pet"
            }
          },
          "404": {
            "description": "A nested reference to \"pet\"",
            "schema": {
              "$ref": "error"
            }
          },
          "500": {
            "description": "A nested reference to \"error\" and \"pet\"",
            "schema": {
              "$ref": "errorWrapper"
            }
          }
        },
        "parameters": [
          {
            "required": true,
            "in": "body",
            "description": "A shorthand reference to \"pet\"",
            "name": "pet",
            "schema": {
              "$ref": "pet"
            }
          }
        ]
      }
    }
  },
  "swagger": "2.0",
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
        "pet": {
          "$ref": "pet"
        },
        "message": {
          "type": "string"
        },
        "code": {
          "type": "integer"
        }
      }
    },
    "errorWrapper": {
      "properties": {
        "error": {
          "$ref": "#/definitions/error"
        }
      }
    }
  }
};
