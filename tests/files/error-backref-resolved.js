require('../test-environment.js');

env.resolved.errorBackref =
{
  "properties": {
    "pet": {
      "$ref": "pet"
    },
    "message": {
      "enum": {
        "$ref": "#/definitions/pet/properties/type/enum"
      },
      "type": "string"
    },
    "code": {
      "type": "integer"
    }
  }
};
