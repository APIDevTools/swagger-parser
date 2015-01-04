require('../test-environment.js');

env.resolved.externalBackRefs =
{
  "info": {
    "version": "1.0.0",
    "description": "This file includes $refs to external files.  Those files contain $refs back to definitions in this file.\n",
    "title": "external back-refs"
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
      "$ref": "error-backref.yml"
    }
  },
  "swagger": "2.0",
  "paths": {
    "/pets": {
      "$ref": "external-backrefs-path.yml"
    }
  }
};
