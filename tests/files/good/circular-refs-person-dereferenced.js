require('../../test-environment.js');

env.dereferenced.circularRefsPerson =
{
    "properties": {
        "name": {
            "type": "string"
        },
        "spouse": {
            "type": {
                "$ref": "person"
            }
        }
    }
};
