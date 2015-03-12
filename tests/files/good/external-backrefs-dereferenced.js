require('../../test-environment.js');

env.dereferenced.externalBackRefs =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'This file includes $refs to external files.  Those files contain $refs back to definitions in this file.\n',
    'title': 'external back-refs'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          '200': {
            'description': 'a document-relative $ref pointer to an external definition',
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
            'description': 'a shorthand $ref pointer to an external definition that contains more backrefs',
            'schema': {
              'properties': {
                'message': {
                  'type': 'string',
                  'enum': [
                    'cat',
                    'dog',
                    'bird'
                  ]
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
            'description': 'a shorthand $ref pointer to an external definition',
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
          'type': 'string',
          'enum': [
            'cat',
            'dog',
            'bird'
          ]
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
