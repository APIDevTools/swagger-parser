var pathToTestsDirectory = global.__karma__ ? '/base/tests/' : '';

helper.parsed.objectSource =
{
  api: {
    "swagger": "2.0",
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
    "definitions": {
      "$ref": pathToTestsDirectory + "specs/object-source/definitions/definitions.json"
    }
  },

  definitions: {
    "requiredString": {
      "$ref": "required-string.yaml"
    },
    "string": {
      "$ref": "#/requiredString/type"
    },
    "name": {
      "$ref": "../definitions/name.yaml"
    }
  },

  name: {
    "required": [
      "first",
      "last"
    ],
    "type": "object",
    "properties": {
      "middle": {
        "minLength": {
          "$ref": "#/properties/first/minLength"
        },
        "type": {
          "$ref": "#/properties/first/type"
        }
      },
      "prefix": {
        "minLength": 3,
        "$ref": "#/properties/last"
      },
      "last": {
        "$ref": "./required-string.yaml"
      },
      "suffix": {
        "$ref": "#/properties/prefix",
        "type": "string",
        "maxLength": 3
      },
      "first": {
        "$ref": "../definitions/definitions.json#/requiredString"
      }
    },
    "title": "name"
  },

  requiredString: {
    "minLength": 1,
    "type": "string",
    "title": "requiredString"
  }
};
