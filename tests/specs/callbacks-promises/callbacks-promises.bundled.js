helper.bundled.callbacksPromises =
{
  "definitions": {
    "requiredString": {
      "minLength": 1,
      "type": "string",
      "title": "requiredString"
    },
    "name": {
      "required": [
        "first",
        "last"
      ],
      "type": "object",
      "properties": {
        "last": {
          "$ref": "#/definitions/requiredString"
        },
        "first": {
          "$ref": "#/definitions/requiredString"
        },
        "middle": {
          "minLength": {
            "$ref": "#/definitions/requiredString/minLength"
          },
          "type": {
            "$ref": "#/definitions/requiredString/type"
          }
        },
        "prefix": {
          "$ref": "#/definitions/requiredString",
          "minLength": 3
        },
        "suffix": {
          "$ref": "#/definitions/name/properties/prefix",
          "maxLength": 3,
          "type": "string"
        }
      }
    }
  },
  "info": {
    "version": "1.0.0",
    "description": "This is an intentionally over-complicated API that returns a person's name",
    "title": "Name API"
  },
  "paths": {
    "/people/{name}": {
      "parameters": [
        {
          "required": true,
          "type": "string",
          "name": "name",
          "in": "path"
        }
      ],
      "get": {
        "responses": {
          "200": {
            "description": "Returns the requested name",
            "schema": {
              "$ref": "#/definitions/name"
            }
          }
        }
      }
    }
  },
  "swagger": "2.0"
};
