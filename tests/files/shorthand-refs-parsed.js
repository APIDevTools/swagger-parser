require('../test-environment.js');

env.files.parsed.shorthandRefs =
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
              '$ref': 'pet'
            }
          },
          'default': {
            'description': 'references the "error" definition',
            'schema': {
              '$ref': 'error'
            }
          }
        },
        'parameters': [
          {
            'required': true,
            'schema': {
              '$ref': 'pet'
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
    'error': {
      'properties': {
        'message': {
          'type': 'string'
        },
        'code': {
          'type': 'integer'
        }
      }
    }
  }
};
