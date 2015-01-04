require('../test-environment.js');

env.dereferenced.externalRefs =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'This file includes $refs to external files',
    'title': 'external refs'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          '200': {
            'description': 'references the "pet.yaml" file',
            'schema': {
              'properties': {
                'type': {
                  'enum': [
                    'cat',
                    'dog',
                    'bird'
                  ],
                  'type': 'string'
                },
                'name': {
                  'type': 'string'
                }
              }
            }
          },
          'default': {
            'description': 'references the "error.json" file',
            'schema': {
              'properties': {
                'message': {
                  'type': 'string'
                },
                'code': {
                  'type': 'integer'
                },
                'pet': {
                  'properties': {
                    'type': {
                      'enum': [
                        'cat',
                        'dog',
                        'bird'
                      ],
                      'type': 'string'
                    },
                    'name': {
                      'type': 'string'
                    }
                  }
                }
              }
            }
          }
        },
        'parameters': [
          {
            'required': true,
            'schema': {
              'properties': {
                'type': {
                  'enum': [
                    'cat',
                    'dog',
                    'bird'
                  ],
                  'type': 'string'
                },
                'name': {
                  'type': 'string'
                }
              }
            },
            'description': 'references the "pet.yaml" file',
            'in': 'body',
            'name': 'pet'
          }
        ]
      }
    }
  }
};
