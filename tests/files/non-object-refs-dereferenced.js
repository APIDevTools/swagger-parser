require('../test-environment.js');

env.files.dereferenced.nonObjectRefs =
{
  'info': {
    'version': '1.0.0',
    'description': 'This file has $ref pointers to things other than plain objects',
    'title': 'non-object refs'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          'default': {
            'description': 'references the "error" definition',
            'schema': {
              'properties': {
                'message': {
                  'enum': [
                    'cat',
                    'dog',
                    'bird'
                  ],
                  'type': 'string'
                },
                'code': {
                  'type': 'integer',
                  'minimum': 400
                }
              }
            }
          }
        },
        'parameters': [
          {
            'required': true,
            'in': 'body',
            'description': 'references the "pet" definition',
            'name': 'pet',
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
        ]
      }
    }
  },
  'swagger': '2.0',
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
    'error': {
      'properties': {
        'message': {
          'type': 'string'
        },
        'code': {
          'type': 'integer',
          'minimum': 400
        }
      }
    }
  }
};
