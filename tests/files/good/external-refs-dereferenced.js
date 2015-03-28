require('../../test-environment.js');
require('./text-resolved.js');
require('./image-resolved.js');

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
          '300': {
            'description': 'references a file with no extension',
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
          '400': {
            'description': 'references a plain-text file',
            'schema': {
              'type': 'string',
              'example': env.resolved.text
            }
          },
          '500': {
            'description': 'references a binary file',
            'schema': {
              'type': 'file',
              'example': env.resolved.image
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
