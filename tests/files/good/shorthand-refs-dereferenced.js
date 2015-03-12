require('../../test-environment.js');

env.dereferenced.shorthandRefs =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'Swagger allows a shorthand notation for $ref pointers that reference the root "definitions" object',
    'title': 'shorthand refs'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          '200': {
            'description': 'references the "pet" definition',
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
            'description': 'references the "error" definition',
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
            'description': 'references the "pet" definition',
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
    },
    "error": {
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
};
