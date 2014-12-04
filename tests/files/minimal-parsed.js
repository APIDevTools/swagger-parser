env.files.parsed.minimal =
{
  swagger: '2.0',
  info: {
    version: '1.0.0',
    description: 'Example of the bare minimum Swagger spec',
    title: 'minimal'
  },
  paths: {
    '/users': {
      'get': {
        responses: {
          '200': {
            'description': 'hello world'
          }
        }
      }
    }
  }
};
