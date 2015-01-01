require('../test-environment.js');

env.files.dereferenced.pet =
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
