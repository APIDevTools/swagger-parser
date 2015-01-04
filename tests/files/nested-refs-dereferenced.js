require('../test-environment.js');

env.dereferenced.nestedRefs =
{
  'info': {
    'version': '1.0.0',
    'description': 'This file includes nested $ref pointers',
    'title': 'nested refs'
  },
  'paths': {
    '/pets': {
      'post': {
        'responses': {
          '200': {
            'description': 'A document-relative reference to "pet"',
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
          '404': {
            'description': 'A nested reference to "pet"',
            'schema': {
              'properties': {
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
                'message': {
                  'type': 'string'
                },
                'code': {
                  'type': 'integer'
                }
              }
            }
          },
          '500': {
            'description': 'A nested reference to "error" and "pet"',
            'schema': {
              'properties': {
                "error": {
                  'properties': {
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
                    'message': {
                      'type': 'string'
                    },
                    'code': {
                      'type': 'integer'
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
            'in': 'body',
            'description': 'A shorthand reference to "pet"',
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
    "error": {
      'properties': {
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
        'message': {
          'type': 'string'
        },
        'code': {
          'type': 'integer'
        }
      }
    },
    'errorWrapper': {
      'properties': {
        "error": {
          'properties': {
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
            'message': {
              'type': 'string'
            },
            'code': {
              'type': 'integer'
            }
          }
        }
      }
    }
  }
};
