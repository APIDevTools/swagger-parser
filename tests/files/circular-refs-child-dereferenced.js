require('../test-environment.js');

env.dereferenced.circularRefsChild =
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
