require('../../test-environment.js');

env.resolved.circularRefsChild =
{
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
};
