require('../test-environment.js');

env.files.dereferenced.refs =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'This file includes all three types of $ref pointers (relative, shorhand, and external)',
    'title': 'refs'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          '200': {
            'description': 'A shorthand $ref pointer',
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
            'description': 'An external $ref pointer',
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
            'description': 'A document-relative $ref pointer',
            'in': 'body',
            'name': 'pet'
          }
        ]
      }
    }
  },
  'definitions': {
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
};
