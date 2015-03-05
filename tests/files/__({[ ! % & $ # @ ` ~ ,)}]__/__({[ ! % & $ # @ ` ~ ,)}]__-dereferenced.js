require('../../test-environment.js');

env.dereferenced.specialCharacters =
{
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'description': 'Testing file/folder names with spaces and special characters',
    'title': 'special characters'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          'default': {
            'description': 'external reference with special characters',
            'schema': {
              "type": "object",
              "description": "Testing file/folder names with spaces and special characters"
            }
          }
        }
      }
    }
  }
};
