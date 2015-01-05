require('../test-environment.js');

// NOTE: These results are dependent on the order of objects in the Swagger API
env.dereferenced.circularRefs =
{
  "info": {
    "version": "1.0.0",
    "description": "This file contains circular $ref pointers",
    "title": "circular refs"
  },
  "paths": {
    "/circular": {
      "post": {
        "responses": {
          "200": {
            "description": "references the \"person\" definition",
            "schema": {
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
            }
          },
          "default": {
            "description": "references the \"parent\" definition",
            "schema": {
              "properties": {
                "name": {
                  "type": "string"
                },
                "children": {
                  "items": {
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
                  },
                  "type": "array"
                }
              }
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
