require('../test-environment.js');

env.files.parsed.error =
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
