require('../../test-environment.js');

env.dereferenced.mockUrl =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'This file includes $refs to a mock HTTP server',
    'title': 'mock url'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          'default': {
            'description': 'references the mock HTTP server',
            'schema': {
              type: 'object'
            }
          }
        }
      }
    }
  }
};
