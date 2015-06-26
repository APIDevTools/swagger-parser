require('../../test-environment.js');

env.dereferenced.external.externalBackRefs = {
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
              '$ref': '#/definitions/pet'
            }
          },
          'default': {
            'description': 'a shorthand $ref pointer to an external definition that contains more backrefs',
            'schema': {
              '$ref': 'error'
            }
          }
        },
        'parameters': [
          {
            'required': true,
            'description': 'a shorthand $ref pointer to an external definition',
            'in': 'body',
            'name': 'pet',
            'schema': {
              '$ref': 'pet'
            }
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
          'enum': {
            '$ref': '#/definitions/pet/properties/type/enum'
          },
          'type': 'string'
        },
        'code': {
          'type': 'integer'
        },
        'pet': {
          '$ref': 'pet'
        }
      }
    }
  }
};
