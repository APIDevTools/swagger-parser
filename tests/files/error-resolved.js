require('../test-environment.js');

env.resolved.error =
{
  'properties': {
    'message': {
      'type': 'string'
    },
    'code': {
      'type': 'integer'
    },
    'pet': {
      '$ref': 'pet'
    }
  }
};

env.resolved.errorExternal =
{
  'properties': {
    'message': {
      'type': 'string'
    },
    'code': {
      'type': 'integer'
    },
    'pet': {
      '$ref': '../files/pet.yaml'
    }
  }
};
