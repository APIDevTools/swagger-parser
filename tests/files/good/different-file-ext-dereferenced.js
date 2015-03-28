require('../../test-environment.js');

env.dereferenced.differentFileExt =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'This file has $refs to three different external "pet" objects',
    'title': 'different file extensions'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          '200': {
            'description': 'references the "pet.json" file',
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
            'description': 'references the "pet.yml" file',
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
