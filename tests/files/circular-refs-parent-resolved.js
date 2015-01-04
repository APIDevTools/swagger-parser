require('../test-environment.js');

env.resolved.circularRefsParent =
{
    "properties": {
        "children": {
            "items": {
                "$ref": "child"
            },
            "type": "array"
        },
        "name": {
            "type": "string"
        }
    }
};
