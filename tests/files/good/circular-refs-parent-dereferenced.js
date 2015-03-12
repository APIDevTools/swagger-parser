require('../../test-environment.js');

env.dereferenced.circularRefsParent =
{
    "properties": {
        "children": {
            "items": {
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "parents": {
                        "items": {
                            "$ref": "parent"
                        },
                        "type": "array"
                    }
                }
            },
            "type": "array"
        },
        "name": {
            "type": "string"
        }
    }
};
