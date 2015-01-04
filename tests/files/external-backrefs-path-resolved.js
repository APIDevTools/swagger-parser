require('../test-environment.js');

env.resolved.externalBackRefsPath =
{
  "post": {
    "responses": {
      "200": {
        "description": "a document-relative $ref pointer to an external definition",
        "schema": {
          "$ref": "#/definitions/pet"
        }
      },
      "default": {
        "description": "a shorthand $ref pointer to an external definition that contains more backrefs",
        "schema": {
          "$ref": "error"
        }
      }
    },
    "parameters": [
      {
        "required": true,
        "in": "body",
        "description": "a shorthand $ref pointer to an external definition",
        "name": "pet",
        "schema": {
          "$ref": "pet"
        }
      }
    ]
  }
};
