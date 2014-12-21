require('../test-environment.js');

env.files.parsed.pet =
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
