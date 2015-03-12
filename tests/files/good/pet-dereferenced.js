require('../../test-environment.js');

env.resolved.pet = env.dereferenced.pet =
{
  properties: {
    name: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['cat', 'dog', 'bird']
    }
  }
};
