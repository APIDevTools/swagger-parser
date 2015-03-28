require('../../test-environment.js');

env.resolved.noRefs =
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore",
    "description": "A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification",
    "termsOfService": "http://helloreverb.com/terms/",
    "contact": {
      "name": "Wordnik API Team",
      "email": "foo@example.com",
      "url": "http://madskristensen.net"
    },
    "license": {
      "name": "MIT",
      "url": "http://github.com/gruntjs/grunt/blob/master/LICENSE-MIT"
    }
  },
  "host": "company.com",
  "basePath": "/api",
  "schemes": [
    "http",
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "security": [
    {
      "petStoreBasic": [],
      "petStoreApiKey": []
    },
    {
      "petStoreOAuth": [
        "view"
      ]
    }
  ],
  "securityDefinitions": {
    "petStoreBasic": {
      "type": "basic",
      "description": "basic HTTP auth"
    },
    "petStoreApiKey": {
      "type": "apiKey",
      "name": "petStoreKey",
      "in": "header",
      "description": "requires an API key header"
    },
    "petStoreOAuth": {
      "type": "oauth2",
      "flow": "password",
      "tokenUrl": "http://company.com/authorize",
      "scopes": {
        "view": "read only",
        "edit": "can edit pets",
        "create": "can create new pets",
        "delete": "can delete pets"
      },
      "description": "OAuth2 security"
    }
  },
  "definitions": {
    "pet": {
      "type": "object",
      "required": [
        "Name",
        "Type"
      ],
      "properties": {
        "Name": {
          "type": "string",
          "minLength": 2,
          "pattern": "^[a-zA-Z0-9- ]+$"
        },
        "Age": {
          "type": "integer"
        },
        "DOB": {
          "type": "string",
          "format": "date"
        },
        "Type": {
          "type": "string",
          "enum": [
            "cat",
            "dog",
            "bird"
          ]
        },
        "Address": {
          "type": "object",
          "required": [
            "Street",
            "City",
            "State",
            "ZipCode"
          ],
          "properties": {
            "Street": {
              "type": "string",
              "minLength": 1
            },
            "City": {
              "type": "string",
              "minLength": 1
            },
            "State": {
              "type": "string",
              "minLength": 2,
              "maxLength": 2,
              "pattern": "^[A-Z]+$"
            },
            "ZipCode": {
              "type": "integer",
              "mininum": 10000,
              "maximum": 99999
            }
          }
        },
        "Vet": {
          "type": "object",
          "required": [
            "Name"
          ],
          "properties": {
            "Name": {
              "type": "string",
              "minLength": 1
            },
            "Address": {
              "type": "object",
              "required": [
                "Street",
                "City",
                "State",
                "ZipCode"
              ],
              "properties": {
                "Street": {
                  "type": "string",
                  "minLength": 1
                },
                "City": {
                  "type": "string",
                  "minLength": 1
                },
                "State": {
                  "type": "string",
                  "minLength": 2,
                  "maxLength": 2,
                  "pattern": "^[A-Z]+$"
                },
                "ZipCode": {
                  "type": "integer",
                  "mininum": 10000,
                  "maximum": 99999
                }
              }
            }
          }
        },
        "Tags": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "veterinarian": {
      "type": "object",
      "required": [
        "Name"
      ],
      "properties": {
        "Name": {
          "type": "string",
          "minLength": 1
        },
        "Address": {
          "type": "object",
          "required": [
            "Street",
            "City",
            "State",
            "ZipCode"
          ],
          "properties": {
            "Street": {
              "type": "string",
              "minLength": 1
            },
            "City": {
              "type": "string",
              "minLength": 1
            },
            "State": {
              "type": "string",
              "minLength": 2,
              "maxLength": 2,
              "pattern": "^[A-Z]+$"
            },
            "ZipCode": {
              "type": "integer",
              "mininum": 10000,
              "maximum": 99999
            }
          }
        }
      }
    },
    "address": {
      "type": "object",
      "required": [
        "Street",
        "City",
        "State",
        "ZipCode"
      ],
      "properties": {
        "Street": {
          "type": "string",
          "minLength": 1
        },
        "City": {
          "type": "string",
          "minLength": 1
        },
        "State": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2,
          "pattern": "^[A-Z]+$"
        },
        "ZipCode": {
          "type": "integer",
          "mininum": 10000,
          "maximum": 99999
        }
      }
    },
    "error": {
      "type": "object",
      "required": [
        "Code",
        "Message"
      ],
      "properties": {
        "Code": {
          "type": "integer",
          "format": "int32"
        },
        "Message": {
          "type": "string"
        },
        "Pet": {
          "type": "object",
          "required": [
            "Name",
            "Type"
          ],
          "properties": {
            "Name": {
              "type": "string",
              "minLength": 2,
              "pattern": "^[a-zA-Z0-9- ]+$"
            },
            "Age": {
              "type": "integer"
            },
            "DOB": {
              "type": "string",
              "format": "date"
            },
            "Type": {
              "type": "string",
              "enum": [
                "cat",
                "dog",
                "bird"
              ]
            },
            "Address": {
              "type": "object",
              "required": [
                "Street",
                "City",
                "State",
                "ZipCode"
              ],
              "properties": {
                "Street": {
                  "type": "string",
                  "minLength": 1
                },
                "City": {
                  "type": "string",
                  "minLength": 1
                },
                "State": {
                  "type": "string",
                  "minLength": 2,
                  "maxLength": 2,
                  "pattern": "^[A-Z]+$"
                },
                "ZipCode": {
                  "type": "integer",
                  "mininum": 10000,
                  "maximum": 99999
                }
              }
            },
            "Vet": {
              "type": "object",
              "required": [
                "Name"
              ],
              "properties": {
                "Name": {
                  "type": "string",
                  "minLength": 1
                },
                "Address": {
                  "type": "object",
                  "required": [
                    "Street",
                    "City",
                    "State",
                    "ZipCode"
                  ],
                  "properties": {
                    "Street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "City": {
                      "type": "string",
                      "minLength": 1
                    },
                    "State": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "ZipCode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                }
              }
            },
            "Tags": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              }
            }
          }
        }
      }
    }
  },
  "parameters": {
    "petName": {
      "name": "PetName",
      "in": "path",
      "description": "name of the pet",
      "required": true,
      "type": "string"
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "description": "Returns all pets, optionally filtered by one or more criteria",
        "operationId": "findPets",
        "security": [],
        "produces": [
          "application/json",
          "application/xml",
          "text/xml",
          "text/html"
        ],
        "parameters": [
          {
            "name": "Tags",
            "in": "query",
            "description": "Filters pets by one or more tags",
            "required": false,
            "type": "array",
            "items": {
              "type": "string"
            },
            "collectionFormat": "csv"
          },
          {
            "name": "Type",
            "in": "query",
            "description": "Filters pets by type (dog, cat, or bird)",
            "required": false,
            "type": "string"
          },
          {
            "name": "Age",
            "in": "query",
            "description": "Filters pets by age",
            "required": false,
            "type": "integer"
          },
          {
            "name": "DOB",
            "in": "query",
            "description": "Filters pets by date of birth",
            "required": false,
            "type": "string",
            "format": "date"
          },
          {
            "name": "Address.City",
            "in": "query",
            "description": "Filters pets by city",
            "required": false,
            "type": "string"
          },
          {
            "name": "Address.State",
            "in": "query",
            "description": "Filters pets by state",
            "required": false,
            "type": "string"
          },
          {
            "name": "Address.ZipCode",
            "in": "query",
            "description": "Filters pets by zip code",
            "required": false,
            "type": "integer"
          },
          {
            "name": "Vet.Name",
            "in": "query",
            "description": "Filters pets by veterinarian name",
            "required": false,
            "type": "string"
          },
          {
            "name": "Vet.Address.City",
            "in": "query",
            "description": "Filters pets by veterinarian city",
            "required": false,
            "type": "string"
          },
          {
            "name": "Vet.Address.State",
            "in": "query",
            "description": "Filters pets by veterinarian state",
            "required": false,
            "type": "string"
          },
          {
            "name": "Vet.Address.ZipCode",
            "in": "query",
            "description": "Filters pets by veterinarian zip code",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "pet response",
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "required": [
                  "Name",
                  "Type"
                ],
                "properties": {
                  "Name": {
                    "type": "string",
                    "minLength": 2,
                    "pattern": "^[a-zA-Z0-9- ]+$"
                  },
                  "Age": {
                    "type": "integer"
                  },
                  "DOB": {
                    "type": "string",
                    "format": "date"
                  },
                  "Type": {
                    "type": "string",
                    "enum": [
                      "cat",
                      "dog",
                      "bird"
                    ]
                  },
                  "Address": {
                    "type": "object",
                    "required": [
                      "Street",
                      "City",
                      "State",
                      "ZipCode"
                    ],
                    "properties": {
                      "Street": {
                        "type": "string",
                        "minLength": 1
                      },
                      "City": {
                        "type": "string",
                        "minLength": 1
                      },
                      "State": {
                        "type": "string",
                        "minLength": 2,
                        "maxLength": 2,
                        "pattern": "^[A-Z]+$"
                      },
                      "ZipCode": {
                        "type": "integer",
                        "mininum": 10000,
                        "maximum": 99999
                      }
                    }
                  },
                  "Vet": {
                    "type": "object",
                    "required": [
                      "Name"
                    ],
                    "properties": {
                      "Name": {
                        "type": "string",
                        "minLength": 1
                      },
                      "Address": {
                        "type": "object",
                        "required": [
                          "Street",
                          "City",
                          "State",
                          "ZipCode"
                        ],
                        "properties": {
                          "Street": {
                            "type": "string",
                            "minLength": 1
                          },
                          "City": {
                            "type": "string",
                            "minLength": 1
                          },
                          "State": {
                            "type": "string",
                            "minLength": 2,
                            "maxLength": 2,
                            "pattern": "^[A-Z]+$"
                          },
                          "ZipCode": {
                            "type": "integer",
                            "mininum": 10000,
                            "maximum": 99999
                          }
                        }
                      }
                    }
                  },
                  "Tags": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1
                    }
                  }
                }
              }
            }
          },
          "default": {
            "description": "unexpected error",
            "schema": {
              "type": "object",
              "required": [
                "Code",
                "Message"
              ],
              "properties": {
                "Code": {
                  "type": "integer",
                  "format": "int32"
                },
                "Message": {
                  "type": "string"
                },
                "Pet": {
                  "type": "object",
                  "required": [
                    "Name",
                    "Type"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 2,
                      "pattern": "^[a-zA-Z0-9- ]+$"
                    },
                    "Age": {
                      "type": "integer"
                    },
                    "DOB": {
                      "type": "string",
                      "format": "date"
                    },
                    "Type": {
                      "type": "string",
                      "enum": [
                        "cat",
                        "dog",
                        "bird"
                      ]
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    },
                    "Vet": {
                      "type": "object",
                      "required": [
                        "Name"
                      ],
                      "properties": {
                        "Name": {
                          "type": "string",
                          "minLength": 1
                        },
                        "Address": {
                          "type": "object",
                          "required": [
                            "Street",
                            "City",
                            "State",
                            "ZipCode"
                          ],
                          "properties": {
                            "Street": {
                              "type": "string",
                              "minLength": 1
                            },
                            "City": {
                              "type": "string",
                              "minLength": 1
                            },
                            "State": {
                              "type": "string",
                              "minLength": 2,
                              "maxLength": 2,
                              "pattern": "^[A-Z]+$"
                            },
                            "ZipCode": {
                              "type": "integer",
                              "mininum": 10000,
                              "maximum": 99999
                            }
                          }
                        }
                      }
                    },
                    "Tags": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "description": "Creates a new pet in the store.",
        "operationId": "addPet",
        "security": [
          {
            "petStoreBasic": [],
            "petStoreApiKey": []
          },
          {
            "petStoreOAuth": [
              "view",
              "edit",
              "create"
            ]
          }
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "PetData",
            "in": "body",
            "description": "Pet to add to the store",
            "required": true,
            "schema": {
              "type": "object",
              "required": [
                "Name",
                "Type"
              ],
              "properties": {
                "Name": {
                  "type": "string",
                  "minLength": 2,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "Age": {
                  "type": "integer"
                },
                "DOB": {
                  "type": "string",
                  "format": "date"
                },
                "Type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "Address": {
                  "type": "object",
                  "required": [
                    "Street",
                    "City",
                    "State",
                    "ZipCode"
                  ],
                  "properties": {
                    "Street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "City": {
                      "type": "string",
                      "minLength": 1
                    },
                    "State": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "ZipCode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "Vet": {
                  "type": "object",
                  "required": [
                    "Name"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "Tags": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  }
                }
              }
            }
          }
        ],
        "responses": {
          "201": {
            "description": "pet response",
            "headers": {
              "Location": {
                "type": "string",
                "description": "Swagger-Express-Middleware will automatically set this header appropriately"
              }
            }
          },
          "409": {
            "description": "new pet conflicts with an existing pet (i.e. they have the same name)"
          },
          "default": {
            "description": "unexpected error",
            "schema": {
              "type": "object",
              "required": [
                "Code",
                "Message"
              ],
              "properties": {
                "Code": {
                  "type": "integer",
                  "format": "int32"
                },
                "Message": {
                  "type": "string"
                },
                "Pet": {
                  "type": "object",
                  "required": [
                    "Name",
                    "Type"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 2,
                      "pattern": "^[a-zA-Z0-9- ]+$"
                    },
                    "Age": {
                      "type": "integer"
                    },
                    "DOB": {
                      "type": "string",
                      "format": "date"
                    },
                    "Type": {
                      "type": "string",
                      "enum": [
                        "cat",
                        "dog",
                        "bird"
                      ]
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    },
                    "Vet": {
                      "type": "object",
                      "required": [
                        "Name"
                      ],
                      "properties": {
                        "Name": {
                          "type": "string",
                          "minLength": 1
                        },
                        "Address": {
                          "type": "object",
                          "required": [
                            "Street",
                            "City",
                            "State",
                            "ZipCode"
                          ],
                          "properties": {
                            "Street": {
                              "type": "string",
                              "minLength": 1
                            },
                            "City": {
                              "type": "string",
                              "minLength": 1
                            },
                            "State": {
                              "type": "string",
                              "minLength": 2,
                              "maxLength": 2,
                              "pattern": "^[A-Z]+$"
                            },
                            "ZipCode": {
                              "type": "integer",
                              "mininum": 10000,
                              "maximum": 99999
                            }
                          }
                        }
                      }
                    },
                    "Tags": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/pets/{PetName}": {
      "parameters": [
        {
          "name": "PetName",
          "in": "path",
          "description": "name of the pet",
          "required": true,
          "type": "string"
        }
      ],
      "get": {
        "description": "Returns a pet by name",
        "operationId": "findPetByName",
        "produces": [
          "application/json",
          "application/xml",
          "text/xml",
          "text/html"
        ],
        "responses": {
          "200": {
            "description": "pet response",
            "schema": {
              "type": "object",
              "required": [
                "Name",
                "Type"
              ],
              "properties": {
                "Name": {
                  "type": "string",
                  "minLength": 2,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "Age": {
                  "type": "integer"
                },
                "DOB": {
                  "type": "string",
                  "format": "date"
                },
                "Type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "Address": {
                  "type": "object",
                  "required": [
                    "Street",
                    "City",
                    "State",
                    "ZipCode"
                  ],
                  "properties": {
                    "Street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "City": {
                      "type": "string",
                      "minLength": 1
                    },
                    "State": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "ZipCode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "Vet": {
                  "type": "object",
                  "required": [
                    "Name"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "Tags": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  }
                }
              }
            }
          },
          "default": {
            "description": "unexpected error",
            "schema": {
              "type": "object",
              "required": [
                "Code",
                "Message"
              ],
              "properties": {
                "Code": {
                  "type": "integer",
                  "format": "int32"
                },
                "Message": {
                  "type": "string"
                },
                "Pet": {
                  "type": "object",
                  "required": [
                    "Name",
                    "Type"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 2,
                      "pattern": "^[a-zA-Z0-9- ]+$"
                    },
                    "Age": {
                      "type": "integer"
                    },
                    "DOB": {
                      "type": "string",
                      "format": "date"
                    },
                    "Type": {
                      "type": "string",
                      "enum": [
                        "cat",
                        "dog",
                        "bird"
                      ]
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    },
                    "Vet": {
                      "type": "object",
                      "required": [
                        "Name"
                      ],
                      "properties": {
                        "Name": {
                          "type": "string",
                          "minLength": 1
                        },
                        "Address": {
                          "type": "object",
                          "required": [
                            "Street",
                            "City",
                            "State",
                            "ZipCode"
                          ],
                          "properties": {
                            "Street": {
                              "type": "string",
                              "minLength": 1
                            },
                            "City": {
                              "type": "string",
                              "minLength": 1
                            },
                            "State": {
                              "type": "string",
                              "minLength": 2,
                              "maxLength": 2,
                              "pattern": "^[A-Z]+$"
                            },
                            "ZipCode": {
                              "type": "integer",
                              "mininum": 10000,
                              "maximum": 99999
                            }
                          }
                        }
                      }
                    },
                    "Tags": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "patch": {
        "description": "Updates a pet by name",
        "security": [
          {
            "petStoreBasic": [],
            "petStoreApiKey": []
          },
          {
            "petStoreOAuth": [
              "view",
              "edit"
            ]
          }
        ],
        "produces": [
          "application/json",
          "application/xml",
          "text/xml",
          "text/html"
        ],
        "parameters": [
          {
            "name": "PetData",
            "in": "body",
            "description": "The updated pet info",
            "required": true,
            "schema": {
              "type": "object",
              "required": [
                "Name",
                "Type"
              ],
              "properties": {
                "Name": {
                  "type": "string",
                  "minLength": 2,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "Age": {
                  "type": "integer"
                },
                "DOB": {
                  "type": "string",
                  "format": "date"
                },
                "Type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "Address": {
                  "type": "object",
                  "required": [
                    "Street",
                    "City",
                    "State",
                    "ZipCode"
                  ],
                  "properties": {
                    "Street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "City": {
                      "type": "string",
                      "minLength": 1
                    },
                    "State": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "ZipCode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "Vet": {
                  "type": "object",
                  "required": [
                    "Name"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "Tags": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  }
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "pet response",
            "schema": {
              "type": "object",
              "required": [
                "Name",
                "Type"
              ],
              "properties": {
                "Name": {
                  "type": "string",
                  "minLength": 2,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "Age": {
                  "type": "integer"
                },
                "DOB": {
                  "type": "string",
                  "format": "date"
                },
                "Type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "Address": {
                  "type": "object",
                  "required": [
                    "Street",
                    "City",
                    "State",
                    "ZipCode"
                  ],
                  "properties": {
                    "Street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "City": {
                      "type": "string",
                      "minLength": 1
                    },
                    "State": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "ZipCode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "Vet": {
                  "type": "object",
                  "required": [
                    "Name"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "Tags": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  }
                }
              }
            }
          },
          "default": {
            "description": "unexpected error",
            "schema": {
              "type": "object",
              "required": [
                "Code",
                "Message"
              ],
              "properties": {
                "Code": {
                  "type": "integer",
                  "format": "int32"
                },
                "Message": {
                  "type": "string"
                },
                "Pet": {
                  "type": "object",
                  "required": [
                    "Name",
                    "Type"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 2,
                      "pattern": "^[a-zA-Z0-9- ]+$"
                    },
                    "Age": {
                      "type": "integer"
                    },
                    "DOB": {
                      "type": "string",
                      "format": "date"
                    },
                    "Type": {
                      "type": "string",
                      "enum": [
                        "cat",
                        "dog",
                        "bird"
                      ]
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    },
                    "Vet": {
                      "type": "object",
                      "required": [
                        "Name"
                      ],
                      "properties": {
                        "Name": {
                          "type": "string",
                          "minLength": 1
                        },
                        "Address": {
                          "type": "object",
                          "required": [
                            "Street",
                            "City",
                            "State",
                            "ZipCode"
                          ],
                          "properties": {
                            "Street": {
                              "type": "string",
                              "minLength": 1
                            },
                            "City": {
                              "type": "string",
                              "minLength": 1
                            },
                            "State": {
                              "type": "string",
                              "minLength": 2,
                              "maxLength": 2,
                              "pattern": "^[A-Z]+$"
                            },
                            "ZipCode": {
                              "type": "integer",
                              "mininum": 10000,
                              "maximum": 99999
                            }
                          }
                        }
                      }
                    },
                    "Tags": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "description": "deletes a single pet based on the name supplied",
        "operationId": "deletePet",
        "security": [
          {
            "petStoreBasic": [],
            "petStoreApiKey": []
          },
          {
            "petStoreOAuth": [
              "view",
              "edit",
              "delete"
            ]
          }
        ],
        "responses": {
          "204": {
            "description": "pet deleted"
          },
          "default": {
            "description": "unexpected error",
            "schema": {
              "type": "object",
              "required": [
                "Code",
                "Message"
              ],
              "properties": {
                "Code": {
                  "type": "integer",
                  "format": "int32"
                },
                "Message": {
                  "type": "string"
                },
                "Pet": {
                  "type": "object",
                  "required": [
                    "Name",
                    "Type"
                  ],
                  "properties": {
                    "Name": {
                      "type": "string",
                      "minLength": 2,
                      "pattern": "^[a-zA-Z0-9- ]+$"
                    },
                    "Age": {
                      "type": "integer"
                    },
                    "DOB": {
                      "type": "string",
                      "format": "date"
                    },
                    "Type": {
                      "type": "string",
                      "enum": [
                        "cat",
                        "dog",
                        "bird"
                      ]
                    },
                    "Address": {
                      "type": "object",
                      "required": [
                        "Street",
                        "City",
                        "State",
                        "ZipCode"
                      ],
                      "properties": {
                        "Street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "City": {
                          "type": "string",
                          "minLength": 1
                        },
                        "State": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "ZipCode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    },
                    "Vet": {
                      "type": "object",
                      "required": [
                        "Name"
                      ],
                      "properties": {
                        "Name": {
                          "type": "string",
                          "minLength": 1
                        },
                        "Address": {
                          "type": "object",
                          "required": [
                            "Street",
                            "City",
                            "State",
                            "ZipCode"
                          ],
                          "properties": {
                            "Street": {
                              "type": "string",
                              "minLength": 1
                            },
                            "City": {
                              "type": "string",
                              "minLength": 1
                            },
                            "State": {
                              "type": "string",
                              "minLength": 2,
                              "maxLength": 2,
                              "pattern": "^[A-Z]+$"
                            },
                            "ZipCode": {
                              "type": "integer",
                              "mininum": 10000,
                              "maximum": 99999
                            }
                          }
                        }
                      }
                    },
                    "Tags": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/pets/{PetName}/photos": {
      "parameters": [
        {
          "name": "PetName",
          "in": "path",
          "description": "name of the pet",
          "required": true,
          "type": "string"
        }
      ],
      "get": {
        "description": "get a list of the photos for a pet",
        "responses": {
          "200": {
            "description": "the list of photos",
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "ID": {
                    "type": "integer",
                    "format": "int32"
                  },
                  "Label": {
                    "type": "string"
                  },
                  "Description": {
                    "type": "string"
                  },
                  "Photo": {
                    "type": "object",
                    "description": "information about the photo (size, file name, etc.)"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "description": "adds a new pet photo",
        "security": [
          {
            "petStoreBasic": [],
            "petStoreApiKey": []
          },
          {
            "petStoreOAuth": [
              "view",
              "edit",
              "create"
            ]
          }
        ],
        "consumes": [
          "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "ID",
            "in": "formData",
            "description": "the photo ID (generated automatically)",
            "type": "integer",
            "format": "int32",
            "minimum": 1
          },
          {
            "name": "Label",
            "in": "formData",
            "description": "a label for the photo",
            "required": true,
            "type": "string",
            "minLength": 1
          },
          {
            "name": "Description",
            "in": "formData",
            "description": "an optional description of the photo",
            "type": "string"
          },
          {
            "name": "Photo",
            "in": "formData",
            "description": "the pet photo",
            "required": true,
            "type": "file",
            "minLength": 1,
            "maxLength": 5000000
          }
        ],
        "responses": {
          "201": {
            "description": "the photo was saved",
            "headers": {
              "Location": {
                "type": "string",
                "description": "Swagger-Express-Middleware will automatically set this header appropriately"
              }
            }
          }
        }
      }
    },
    "/pets/{PetName}/photos/{ID}": {
      "parameters": [
        {
          "name": "PetName",
          "in": "path",
          "description": "name of the pet",
          "required": true,
          "type": "string"
        },
        {
          "name": "ID",
          "in": "path",
          "description": "id of the photo",
          "required": true,
          "type": "integer",
          "format": "int32"
        }
      ],
      "get": {
        "description": "gets a pet photo",
        "responses": {
          "200": {
            "description": "the photo blob",
            "schema": {
              "type": "file"
            }
          }
        }
      },
      "delete": {
        "description": "deletes a pet photo",
        "security": [
          {
            "petStoreBasic": [],
            "petStoreApiKey": []
          },
          {
            "petStoreOAuth": [
              "view",
              "edit",
              "delete"
            ]
          }
        ],
        "responses": {
          "204": {
            "description": "the photo was deleted"
          }
        }
      }
    }
  }
}
