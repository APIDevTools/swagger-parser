helper.bundled.deepCircular =
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "description": "This API contains a VERY DEEP circular (recursive) JSON reference",
    "title": "Deep Circular $Ref"
  },
  "paths": {
    "/family-tree": {
      "get": {
        "responses": {
          "200": {
            "description": "Returns a really deep family tree",
            "schema": {
              "type": "object",
              "required": [
                "name"
              ],
              "properties": {
                "level1": {
                  "required": [
                    "name"
                  ],
                  "type": "object",
                  "properties": {
                    "level2": {
                      "required": [
                        "name"
                      ],
                      "type": "object",
                      "properties": {
                        "level3": {
                          "required": [
                            "name"
                          ],
                          "type": "object",
                          "properties": {
                            "level4": {
                              "required": [
                                "name"
                              ],
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": {
                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                  }
                                },
                                "level5": {
                                  "required": [
                                    "name"
                                  ],
                                  "type": "object",
                                  "properties": {
                                    "name": {
                                      "type": {
                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                      }
                                    },
                                    "level6": {
                                      "required": [
                                        "name"
                                      ],
                                      "type": "object",
                                      "properties": {
                                        "name": {
                                          "type": {
                                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                          }
                                        },
                                        "level7": {
                                          "required": [
                                            "name"
                                          ],
                                          "type": "object",
                                          "properties": {
                                            "level8": {
                                              "required": [
                                                "name"
                                              ],
                                              "type": "object",
                                              "properties": {
                                                "level9": {
                                                  "required": [
                                                    "name"
                                                  ],
                                                  "type": "object",
                                                  "properties": {
                                                    "level10": {
                                                      "required": [
                                                        "name"
                                                      ],
                                                      "type": "object",
                                                      "properties": {
                                                        "level11": {
                                                          "required": [
                                                            "name"
                                                          ],
                                                          "type": "object",
                                                          "properties": {
                                                            "level12": {
                                                              "required": [
                                                                "name"
                                                              ],
                                                              "type": "object",
                                                              "properties": {
                                                                "level13": {
                                                                  "required": [
                                                                    "name"
                                                                  ],
                                                                  "type": "object",
                                                                  "properties": {
                                                                    "name": {
                                                                      "type": {
                                                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                      }
                                                                    },
                                                                    "level14": {
                                                                      "required": [
                                                                        "name"
                                                                      ],
                                                                      "type": "object",
                                                                      "properties": {
                                                                        "name": {
                                                                          "type": {
                                                                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                          }
                                                                        },
                                                                        "level15": {
                                                                          "required": [
                                                                            "name"
                                                                          ],
                                                                          "type": "object",
                                                                          "properties": {
                                                                            "level16": {
                                                                              "required": [
                                                                                "name"
                                                                              ],
                                                                              "type": "object",
                                                                              "properties": {
                                                                                "name": {
                                                                                  "type": {
                                                                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                  }
                                                                                },
                                                                                "level17": {
                                                                                  "required": [
                                                                                    "name"
                                                                                  ],
                                                                                  "type": "object",
                                                                                  "properties": {
                                                                                    "level18": {
                                                                                      "required": [
                                                                                        "name"
                                                                                      ],
                                                                                      "type": "object",
                                                                                      "properties": {
                                                                                        "level19": {
                                                                                          "required": [
                                                                                            "name"
                                                                                          ],
                                                                                          "type": "object",
                                                                                          "properties": {
                                                                                            "level20": {
                                                                                              "required": [
                                                                                                "name"
                                                                                              ],
                                                                                              "type": "object",
                                                                                              "properties": {
                                                                                                "level21": {
                                                                                                  "required": [
                                                                                                    "name"
                                                                                                  ],
                                                                                                  "type": "object",
                                                                                                  "properties": {
                                                                                                    "level22": {
                                                                                                      "required": [
                                                                                                        "name"
                                                                                                      ],
                                                                                                      "type": "object",
                                                                                                      "properties": {
                                                                                                        "level23": {
                                                                                                          "required": [
                                                                                                            "name"
                                                                                                          ],
                                                                                                          "type": "object",
                                                                                                          "properties": {
                                                                                                            "name": {
                                                                                                              "type": {
                                                                                                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                              }
                                                                                                            },
                                                                                                            "level24": {
                                                                                                              "required": [
                                                                                                                "name"
                                                                                                              ],
                                                                                                              "type": "object",
                                                                                                              "properties": {
                                                                                                                "name": {
                                                                                                                  "type": {
                                                                                                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                                  }
                                                                                                                },
                                                                                                                "level25": {
                                                                                                                  "required": [
                                                                                                                    "name"
                                                                                                                  ],
                                                                                                                  "type": "object",
                                                                                                                  "properties": {
                                                                                                                    "name": {
                                                                                                                      "type": {
                                                                                                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                                      }
                                                                                                                    },
                                                                                                                    "level26": {
                                                                                                                      "required": [
                                                                                                                        "name"
                                                                                                                      ],
                                                                                                                      "type": "object",
                                                                                                                      "properties": {
                                                                                                                        "level27": {
                                                                                                                          "required": [
                                                                                                                            "name"
                                                                                                                          ],
                                                                                                                          "type": "object",
                                                                                                                          "properties": {
                                                                                                                            "level28": {
                                                                                                                              "required": [
                                                                                                                                "name"
                                                                                                                              ],
                                                                                                                              "type": "object",
                                                                                                                              "properties": {
                                                                                                                                "level29": {
                                                                                                                                  "required": [
                                                                                                                                    "name"
                                                                                                                                  ],
                                                                                                                                  "type": "object",
                                                                                                                                  "properties": {
                                                                                                                                    "level30": {
                                                                                                                                      "$ref": "#/paths/~1family-tree/get/responses/200/schema"
                                                                                                                                    },
                                                                                                                                    "name": {
                                                                                                                                      "type": {
                                                                                                                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                },
                                                                                                                                "name": {
                                                                                                                                  "type": {
                                                                                                                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            },
                                                                                                                            "name": {
                                                                                                                              "type": {
                                                                                                                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        },
                                                                                                                        "name": {
                                                                                                                          "type": {
                                                                                                                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
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
                                                                                                        "name": {
                                                                                                          "type": {
                                                                                                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    },
                                                                                                    "name": {
                                                                                                      "type": {
                                                                                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                },
                                                                                                "name": {
                                                                                                  "type": {
                                                                                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            },
                                                                                            "name": {
                                                                                              "type": {
                                                                                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        },
                                                                                        "name": {
                                                                                          "type": {
                                                                                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    },
                                                                                    "name": {
                                                                                      "type": {
                                                                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            },
                                                                            "name": {
                                                                              "type": {
                                                                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                },
                                                                "name": {
                                                                  "type": {
                                                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                                  }
                                                                }
                                                              }
                                                            },
                                                            "name": {
                                                              "type": {
                                                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                              }
                                                            }
                                                          }
                                                        },
                                                        "name": {
                                                          "type": {
                                                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "name": {
                                                      "type": {
                                                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                      }
                                                    }
                                                  }
                                                },
                                                "name": {
                                                  "type": {
                                                    "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                                                  }
                                                }
                                              }
                                            },
                                            "name": {
                                              "type": {
                                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
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
                            "name": {
                              "type": {
                                "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                              }
                            }
                          }
                        },
                        "name": {
                          "type": {
                            "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                          }
                        }
                      }
                    },
                    "name": {
                      "type": {
                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type"
                      }
                    }
                  }
                },
                "name": {
                  "type": {
                    "required": [
                      "first",
                      "last"
                    ],
                    "type": "object",
                    "properties": {
                      "middle": {
                        "minLength": {
                          "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type/properties/first/minLength"
                        },
                        "type": {
                          "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type/properties/first/type"
                        }
                      },
                      "prefix": {
                        "minLength": 3,
                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type/properties/first"
                      },
                      "last": {
                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type/properties/first"
                      },
                      "suffix": {
                        "$ref": "#/paths/~1family-tree/get/responses/200/schema/properties/name/type/properties/prefix",
                        "type": "string",
                        "maxLength": 3
                      },
                      "first": {
                        "minLength": 1,
                        "type": "string",
                        "title": "requiredString"
                      }
                    },
                    "title": "name"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
