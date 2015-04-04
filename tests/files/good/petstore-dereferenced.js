require('../../test-environment.js');

env.dereferenced.petStore =
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger petstore",
    "description": "A sample API"
  },
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "definitions": {
    "pet": {
      "required": [
        "name",
        "type"
      ],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 4,
          "pattern": "^[a-zA-Z0-9- ]+$"
        },
        "age": {
          "type": "integer"
        },
        "dob": {
          "type": "string",
          "format": "date"
        },
        "type": {
          "type": "string",
          "enum": [
            "cat",
            "dog",
            "bird"
          ]
        },
        "address": {
          "properties": {
            "street": {
              "type": "string",
              "minLength": 1
            },
            "city": {
              "type": "string",
              "minLength": 1
            },
            "state": {
              "type": "string",
              "minLength": 2,
              "maxLength": 2,
              "pattern": "^[A-Z]+$"
            },
            "zipcode": {
              "type": "integer",
              "mininum": 10000,
              "maximum": 99999
            }
          }
        },
        "vet": {
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "minLength": 1
            },
            "address": {
              "properties": {
                "street": {
                  "type": "string",
                  "minLength": 1
                },
                "city": {
                  "type": "string",
                  "minLength": 1
                },
                "state": {
                  "type": "string",
                  "minLength": 2,
                  "maxLength": 2,
                  "pattern": "^[A-Z]+$"
                },
                "zipcode": {
                  "type": "integer",
                  "mininum": 10000,
                  "maximum": 99999
                }
              }
            }
          }
        },
        "tags": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "veterinarian": {
      "required": [
        "name"
      ],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1
        },
        "address": {
          "properties": {
            "street": {
              "type": "string",
              "minLength": 1
            },
            "city": {
              "type": "string",
              "minLength": 1
            },
            "state": {
              "type": "string",
              "minLength": 2,
              "maxLength": 2,
              "pattern": "^[A-Z]+$"
            },
            "zipcode": {
              "type": "integer",
              "mininum": 10000,
              "maximum": 99999
            }
          }
        }
      }
    },
    "address": {
      "properties": {
        "street": {
          "type": "string",
          "minLength": 1
        },
        "city": {
          "type": "string",
          "minLength": 1
        },
        "state": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2,
          "pattern": "^[A-Z]+$"
        },
        "zipcode": {
          "type": "integer",
          "mininum": 10000,
          "maximum": 99999
        }
      }
    }
  },
  "parameters": {
    "petName": {
      "name": "petName",
      "in": "path",
      "description": "Name of the pet",
      "required": true,
      "type": "string"
    }
  },
  "paths": {
    "/pets": {
      "get": {
        "description": "Returns all pets, optionally filtered by one or more criteria",
        "operationId": "findPets",
        "parameters": [
          {
            "name": "tags",
            "in": "query",
            "description": "Filters pets by one or more tags",
            "required": false,
            "type": "array",
            "items": {
              "type": "string"
            },
            "uniqueItems": true,
            "collectionFormat": "csv"
          },
          {
            "name": "type",
            "in": "query",
            "description": "Filters pets by type (dog, cat, or bird)",
            "required": false,
            "type": "string",
            "enum": [
              "cat",
              "dog",
              "bird"
            ]
          },
          {
            "name": "age",
            "in": "query",
            "description": "Filters pets by age",
            "required": false,
            "type": "integer"
          },
          {
            "name": "dob",
            "in": "query",
            "description": "Filters pets by date of birth",
            "required": false,
            "type": "string",
            "format": "date"
          },
          {
            "name": "address.city",
            "in": "query",
            "description": "Filters pets by city",
            "required": false,
            "type": "string"
          },
          {
            "name": "address.state",
            "in": "query",
            "description": "Filters pets by state",
            "required": false,
            "type": "string"
          },
          {
            "name": "address.zipcode",
            "in": "query",
            "description": "Filters pets by zip code",
            "required": false,
            "type": "integer"
          },
          {
            "name": "vet.name",
            "in": "query",
            "description": "Filters pets by veterinarian name",
            "required": false,
            "type": "string"
          },
          {
            "name": "vet.address.city",
            "in": "query",
            "description": "Filters pets by veterinarian city",
            "required": false,
            "type": "string"
          },
          {
            "name": "vet.address.state",
            "in": "query",
            "description": "Filters pets by veterinarian state",
            "required": false,
            "type": "string"
          },
          {
            "name": "vet.address.zipcode",
            "in": "query",
            "description": "Filters pets by veterinarian zip code",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "default": {
            "description": "Returns the matching pets",
            "schema": {
              "type": "array",
              "items": {
                "required": [
                  "name",
                  "type"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "minLength": 4,
                    "pattern": "^[a-zA-Z0-9- ]+$"
                  },
                  "age": {
                    "type": "integer"
                  },
                  "dob": {
                    "type": "string",
                    "format": "date"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "cat",
                      "dog",
                      "bird"
                    ]
                  },
                  "address": {
                    "properties": {
                      "street": {
                        "type": "string",
                        "minLength": 1
                      },
                      "city": {
                        "type": "string",
                        "minLength": 1
                      },
                      "state": {
                        "type": "string",
                        "minLength": 2,
                        "maxLength": 2,
                        "pattern": "^[A-Z]+$"
                      },
                      "zipcode": {
                        "type": "integer",
                        "mininum": 10000,
                        "maximum": 99999
                      }
                    }
                  },
                  "vet": {
                    "required": [
                      "name"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "minLength": 1
                      },
                      "address": {
                        "properties": {
                          "street": {
                            "type": "string",
                            "minLength": 1
                          },
                          "city": {
                            "type": "string",
                            "minLength": 1
                          },
                          "state": {
                            "type": "string",
                            "minLength": 2,
                            "maxLength": 2,
                            "pattern": "^[A-Z]+$"
                          },
                          "zipcode": {
                            "type": "integer",
                            "mininum": 10000,
                            "maximum": 99999
                          }
                        }
                      }
                    }
                  },
                  "tags": {
                    "type": "array",
                    "uniqueItems": true,
                    "items": {
                      "type": "string",
                      "minLength": 1
                    }
                  }
                }
              }
            },
            "headers": {
              "last-modified": {
                "type": "string",
                "description": "The date/time that a pet was last modified"
              }
            }
          }
        }
      },
      "delete": {
        "description": "Deletes all pets, optionally filtered by one or more criteria",
        "operationId": "deletePets",
        "parameters": [
          {
            "name": "tags",
            "in": "query",
            "description": "Filters pets by one or more tags",
            "required": false,
            "type": "array",
            "items": {
              "type": "string"
            },
            "uniqueItems": true,
            "collectionFormat": "csv"
          },
          {
            "name": "type",
            "in": "query",
            "description": "Filters pets by type (dog, cat, or bird)",
            "required": false,
            "type": "string",
            "enum": [
              "cat",
              "dog",
              "bird"
            ]
          },
          {
            "name": "age",
            "in": "query",
            "description": "Filters pets by age",
            "required": false,
            "type": "integer"
          },
          {
            "name": "dob",
            "in": "query",
            "description": "Filters pets by date of birth",
            "required": false,
            "type": "string",
            "format": "date"
          },
          {
            "name": "address.city",
            "in": "query",
            "description": "Filters pets by city",
            "required": false,
            "type": "string"
          },
          {
            "name": "address.state",
            "in": "query",
            "description": "Filters pets by state",
            "required": false,
            "type": "string"
          },
          {
            "name": "address.zipcode",
            "in": "query",
            "description": "Filters pets by zip code",
            "required": false,
            "type": "integer"
          },
          {
            "name": "vet.name",
            "in": "query",
            "description": "Filters pets by veterinarian name",
            "required": false,
            "type": "string"
          },
          {
            "name": "vet.address.city",
            "in": "query",
            "description": "Filters pets by veterinarian city",
            "required": false,
            "type": "string"
          },
          {
            "name": "vet.address.state",
            "in": "query",
            "description": "Filters pets by veterinarian state",
            "required": false,
            "type": "string"
          },
          {
            "name": "vet.address.zipcode",
            "in": "query",
            "description": "Filters pets by veterinarian zip code",
            "required": false,
            "type": "integer"
          }
        ],
        "responses": {
          "default": {
            "description": "Returns the pets that were deleted",
            "schema": {
              "type": "array",
              "items": {
                "required": [
                  "name",
                  "type"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "minLength": 4,
                    "pattern": "^[a-zA-Z0-9- ]+$"
                  },
                  "age": {
                    "type": "integer"
                  },
                  "dob": {
                    "type": "string",
                    "format": "date"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "cat",
                      "dog",
                      "bird"
                    ]
                  },
                  "address": {
                    "properties": {
                      "street": {
                        "type": "string",
                        "minLength": 1
                      },
                      "city": {
                        "type": "string",
                        "minLength": 1
                      },
                      "state": {
                        "type": "string",
                        "minLength": 2,
                        "maxLength": 2,
                        "pattern": "^[A-Z]+$"
                      },
                      "zipcode": {
                        "type": "integer",
                        "mininum": 10000,
                        "maximum": 99999
                      }
                    }
                  },
                  "vet": {
                    "required": [
                      "name"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "minLength": 1
                      },
                      "address": {
                        "properties": {
                          "street": {
                            "type": "string",
                            "minLength": 1
                          },
                          "city": {
                            "type": "string",
                            "minLength": 1
                          },
                          "state": {
                            "type": "string",
                            "minLength": 2,
                            "maxLength": 2,
                            "pattern": "^[A-Z]+$"
                          },
                          "zipcode": {
                            "type": "integer",
                            "mininum": 10000,
                            "maximum": 99999
                          }
                        }
                      }
                    }
                  },
                  "tags": {
                    "type": "array",
                    "uniqueItems": true,
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
      },
      "post": {
        "description": "Creates a new pet in the store",
        "operationId": "addPet",
        "parameters": [
          {
            "name": "pet",
            "in": "body",
            "description": "The pet to add to the store",
            "required": true,
            "schema": {
              "required": [
                "name",
                "type"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "minLength": 4,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "age": {
                  "type": "integer"
                },
                "dob": {
                  "type": "string",
                  "format": "date"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "address": {
                  "properties": {
                    "street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "city": {
                      "type": "string",
                      "minLength": 1
                    },
                    "state": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "zipcode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "vet": {
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "address": {
                      "properties": {
                        "street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "city": {
                          "type": "string",
                          "minLength": 1
                        },
                        "state": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "zipcode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "uniqueItems": true,
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
            "description": "Returns the newly-added pet",
            "schema": {
              "required": [
                "name",
                "type"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "minLength": 4,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "age": {
                  "type": "integer"
                },
                "dob": {
                  "type": "string",
                  "format": "date"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "address": {
                  "properties": {
                    "street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "city": {
                      "type": "string",
                      "minLength": 1
                    },
                    "state": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "zipcode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "vet": {
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "address": {
                      "properties": {
                        "street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "city": {
                          "type": "string",
                          "minLength": 1
                        },
                        "state": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "zipcode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "uniqueItems": true,
                  "items": {
                    "type": "string",
                    "minLength": 1
                  }
                }
              }
            },
            "headers": {
              "Location": {
                "type": "string",
                "description": "The URL of the newly-added pet"
              }
            }
          }
        }
      }
    },
    "/pets/{petName}": {
      "parameters": [
        {
          "name": "petName",
          "in": "path",
          "description": "Name of the pet",
          "required": true,
          "type": "string"
        }
      ],
      "get": {
        "description": "Returns a pet by name",
        "operationId": "findPetByName",
        "responses": {
          "default": {
            "description": "Returns the pet data",
            "schema": {
              "required": [
                "name",
                "type"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "minLength": 4,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "age": {
                  "type": "integer"
                },
                "dob": {
                  "type": "string",
                  "format": "date"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "address": {
                  "properties": {
                    "street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "city": {
                      "type": "string",
                      "minLength": 1
                    },
                    "state": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "zipcode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "vet": {
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "address": {
                      "properties": {
                        "street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "city": {
                          "type": "string",
                          "minLength": 1
                        },
                        "state": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "zipcode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "uniqueItems": true,
                  "items": {
                    "type": "string",
                    "minLength": 1
                  }
                }
              }
            },
            "headers": {
              "last-modified": {
                "type": "string",
                "description": "The date/time that the pet was last modified"
              }
            }
          }
        }
      },
      "delete": {
        "description": "Deletes a single pet based on the name supplied",
        "operationId": "deletePet",
        "responses": {
          "default": {
            "description": "Returns the pet that was deleted",
            "schema": {
              "required": [
                "name",
                "type"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "minLength": 4,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "age": {
                  "type": "integer"
                },
                "dob": {
                  "type": "string",
                  "format": "date"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "address": {
                  "properties": {
                    "street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "city": {
                      "type": "string",
                      "minLength": 1
                    },
                    "state": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "zipcode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "vet": {
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "address": {
                      "properties": {
                        "street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "city": {
                          "type": "string",
                          "minLength": 1
                        },
                        "state": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "zipcode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "uniqueItems": true,
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
      "patch": {
        "description": "Updates a pet by name",
        "parameters": [
          {
            "name": "pet",
            "in": "body",
            "description": "The updated pet info",
            "required": true,
            "schema": {
              "required": [
                "name",
                "type"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "minLength": 4,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "age": {
                  "type": "integer"
                },
                "dob": {
                  "type": "string",
                  "format": "date"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "address": {
                  "properties": {
                    "street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "city": {
                      "type": "string",
                      "minLength": 1
                    },
                    "state": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "zipcode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "vet": {
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "address": {
                      "properties": {
                        "street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "city": {
                          "type": "string",
                          "minLength": 1
                        },
                        "state": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "zipcode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "uniqueItems": true,
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
          "default": {
            "description": "Returns the updated pet data",
            "schema": {
              "required": [
                "name",
                "type"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "minLength": 4,
                  "pattern": "^[a-zA-Z0-9- ]+$"
                },
                "age": {
                  "type": "integer"
                },
                "dob": {
                  "type": "string",
                  "format": "date"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "cat",
                    "dog",
                    "bird"
                  ]
                },
                "address": {
                  "properties": {
                    "street": {
                      "type": "string",
                      "minLength": 1
                    },
                    "city": {
                      "type": "string",
                      "minLength": 1
                    },
                    "state": {
                      "type": "string",
                      "minLength": 2,
                      "maxLength": 2,
                      "pattern": "^[A-Z]+$"
                    },
                    "zipcode": {
                      "type": "integer",
                      "mininum": 10000,
                      "maximum": 99999
                    }
                  }
                },
                "vet": {
                  "required": [
                    "name"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1
                    },
                    "address": {
                      "properties": {
                        "street": {
                          "type": "string",
                          "minLength": 1
                        },
                        "city": {
                          "type": "string",
                          "minLength": 1
                        },
                        "state": {
                          "type": "string",
                          "minLength": 2,
                          "maxLength": 2,
                          "pattern": "^[A-Z]+$"
                        },
                        "zipcode": {
                          "type": "integer",
                          "mininum": 10000,
                          "maximum": 99999
                        }
                      }
                    }
                  }
                },
                "tags": {
                  "type": "array",
                  "uniqueItems": true,
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
    },
    "/pets/{petName}/photos": {
      "parameters": [
        {
          "name": "petName",
          "in": "path",
          "description": "Name of the pet",
          "required": true,
          "type": "string"
        }
      ],
      "post": {
        "description": "Upload a new pet photo",
        "operationId": "addPetPhoto",
        "consumes": [
          "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "formData",
            "description": "The photo ID (generated automatically)",
            "type": "integer",
            "format": "int32",
            "minimum": 1
          },
          {
            "name": "label",
            "in": "formData",
            "description": "A label for the photo",
            "required": true,
            "type": "string",
            "minLength": 1
          },
          {
            "name": "description",
            "in": "formData",
            "description": "An optional description of the photo",
            "type": "string"
          },
          {
            "name": "photo",
            "in": "formData",
            "description": "The pet photo",
            "required": true,
            "type": "file",
            "minLength": 1,
            "maxLength": 5000000
          }
        ],
        "responses": {
          "default": {
            "description": "Returns the photo information",
            "schema": {
              "properties": {
                "id": {
                  "type": "integer",
                  "format": "int32",
                  "description": "The auto-generated photo ID"
                },
                "label": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "photo": {
                  "description": "Information about the photo (size, file name, etc.)"
                }
              }
            },
            "headers": {
              "Location": {
                "type": "string",
                "description": "The URL of the newly-added photo"
              }
            }
          }
        }
      },
      "get": {
        "description": "Get a list of the photos for a pet",
        "responses": {
          "200": {
            "description": "Returns the list of photos",
            "schema": {
              "type": "array",
              "items": {
                "properties": {
                  "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "The auto-generated photo ID"
                  },
                  "label": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "photo": {
                    "description": "Information about the photo (size, file name, etc.)"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/pets/{petName}/photos/{id}": {
      "parameters": [
        {
          "name": "petName",
          "in": "path",
          "description": "Name of the pet",
          "required": true,
          "type": "string"
        },
        {
          "name": "id",
          "in": "path",
          "description": "The ID of the photo",
          "required": true,
          "type": "integer",
          "format": "int32"
        }
      ],
      "get": {
        "description": "Gets a pet photo",
        "operationId": "getPetPhoto",
        "produces": [
          "image/jpeg",
          "image/gif",
          "image/png",
          "image/bmp"
        ],
        "responses": {
          "default": {
            "description": "Returns the pet photo",
            "schema": {
              "type": "file"
            }
          }
        }
      },
      "delete": {
        "description": "Deletes a pet photo",
        "operationId": "deletePetPhoto",
        "responses": {
          "default": {
            "description": "The photo was deleted successfully"
          }
        }
      }
    }
  }
};
