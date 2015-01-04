require('../test-environment.js');

env.resolved.circularRefsPerson =
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
