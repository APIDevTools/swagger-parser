env.files.parsed.invalid =
{
  swagger: '2.0',
  info: {
    version: '1.0.0',
    description: 'This file is invalid because there is an invalid HTTP response',
    title: 'invalid'
  },
  paths: {
    '/users': {
      'get': {
        responses: {
          default: {
            description: 'default response'
          },
          '200': {
            description: 'success!'
          },
          '404': {
            description: 'not found!'
          },
          helloworld: {
            description: 'invalid response code'
          }
        }
      }
    }
  }
};
