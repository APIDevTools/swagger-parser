require('../test-environment.js');

env.dereferenced.errorBackref =
{
  'properties': {
    'message': {
      type: 'string',
      enum: ['cat', 'dog', 'bird']
    },
    'code': {
      'type': 'integer'
    },
    'pet': {
      properties: {
        name: {
          type: 'string'
        },
        type: {
          type: 'string',
          enum: ['cat', 'dog', 'bird']
        }
      }
    }
  }
};
