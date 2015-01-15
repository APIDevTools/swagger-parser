require('../test-environment.js');

env.dereferenced.errorWrapper =
{
  'properties': {
    'error': {
      "properties": {
        "message": {
          "type": "string"
        },
        "code": {
          "type": "integer"
        },
        "pet": {
          "properties": {
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": ["cat", "dog", "bird"]
            }
          }
        }
      }
    }
  }
};
