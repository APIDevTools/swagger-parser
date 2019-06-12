"use strict";

module.exports =
{
  swagger: "2.0",
  info: {
    version: "1.0.0",
    description: "This API contains a VERY DEEP circular (recursive) JSON reference",
    title: "Deep Circular $Ref"
  },
  paths: {
    "/family-tree": {
      get: {
        responses: {
          200: {
            description: "Returns a really deep family tree",
            schema: {
              type: "object",
              required: [
                "name"
              ],
              properties: {
                level1: {
                  required: [
                    "name"
                  ],
                  type: "object",
                  properties: {
                    level2: {
                      required: [
                        "name"
                      ],
                      type: "object",
                      properties: {
                        level3: {
                          required: [
                            "name"
                          ],
                          type: "object",
                          properties: {
                            level4: {
                              required: [
                                "name"
                              ],
                              type: "object",
                              properties: {
                                name: {
                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                },
                                level5: {
                                  required: [
                                    "name"
                                  ],
                                  type: "object",
                                  properties: {
                                    name: {
                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                    },
                                    level6: {
                                      required: [
                                        "name"
                                      ],
                                      type: "object",
                                      properties: {
                                        name: {
                                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                        },
                                        level7: {
                                          required: [
                                            "name"
                                          ],
                                          type: "object",
                                          properties: {
                                            level8: {
                                              required: [
                                                "name"
                                              ],
                                              type: "object",
                                              properties: {
                                                level9: {
                                                  required: [
                                                    "name"
                                                  ],
                                                  type: "object",
                                                  properties: {
                                                    level10: {
                                                      required: [
                                                        "name"
                                                      ],
                                                      type: "object",
                                                      properties: {
                                                        level11: {
                                                          required: [
                                                            "name"
                                                          ],
                                                          type: "object",
                                                          properties: {
                                                            level12: {
                                                              required: [
                                                                "name"
                                                              ],
                                                              type: "object",
                                                              properties: {
                                                                level13: {
                                                                  required: [
                                                                    "name"
                                                                  ],
                                                                  type: "object",
                                                                  properties: {
                                                                    name: {
                                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                    },
                                                                    level14: {
                                                                      required: [
                                                                        "name"
                                                                      ],
                                                                      type: "object",
                                                                      properties: {
                                                                        name: {
                                                                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                        },
                                                                        level15: {
                                                                          required: [
                                                                            "name"
                                                                          ],
                                                                          type: "object",
                                                                          properties: {
                                                                            level16: {
                                                                              required: [
                                                                                "name"
                                                                              ],
                                                                              type: "object",
                                                                              properties: {
                                                                                name: {
                                                                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                },
                                                                                level17: {
                                                                                  required: [
                                                                                    "name"
                                                                                  ],
                                                                                  type: "object",
                                                                                  properties: {
                                                                                    level18: {
                                                                                      required: [
                                                                                        "name"
                                                                                      ],
                                                                                      type: "object",
                                                                                      properties: {
                                                                                        level19: {
                                                                                          required: [
                                                                                            "name"
                                                                                          ],
                                                                                          type: "object",
                                                                                          properties: {
                                                                                            level20: {
                                                                                              required: [
                                                                                                "name"
                                                                                              ],
                                                                                              type: "object",
                                                                                              properties: {
                                                                                                level21: {
                                                                                                  required: [
                                                                                                    "name"
                                                                                                  ],
                                                                                                  type: "object",
                                                                                                  properties: {
                                                                                                    level22: {
                                                                                                      required: [
                                                                                                        "name"
                                                                                                      ],
                                                                                                      type: "object",
                                                                                                      properties: {
                                                                                                        level23: {
                                                                                                          required: [
                                                                                                            "name"
                                                                                                          ],
                                                                                                          type: "object",
                                                                                                          properties: {
                                                                                                            name: {
                                                                                                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                            },
                                                                                                            level24: {
                                                                                                              required: [
                                                                                                                "name"
                                                                                                              ],
                                                                                                              type: "object",
                                                                                                              properties: {
                                                                                                                name: {
                                                                                                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                                },
                                                                                                                level25: {
                                                                                                                  required: [
                                                                                                                    "name"
                                                                                                                  ],
                                                                                                                  type: "object",
                                                                                                                  properties: {
                                                                                                                    name: {
                                                                                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                                    },
                                                                                                                    level26: {
                                                                                                                      required: [
                                                                                                                        "name"
                                                                                                                      ],
                                                                                                                      type: "object",
                                                                                                                      properties: {
                                                                                                                        level27: {
                                                                                                                          required: [
                                                                                                                            "name"
                                                                                                                          ],
                                                                                                                          type: "object",
                                                                                                                          properties: {
                                                                                                                            level28: {
                                                                                                                              required: [
                                                                                                                                "name"
                                                                                                                              ],
                                                                                                                              type: "object",
                                                                                                                              properties: {
                                                                                                                                level29: {
                                                                                                                                  required: [
                                                                                                                                    "name"
                                                                                                                                  ],
                                                                                                                                  type: "object",
                                                                                                                                  properties: {
                                                                                                                                    level30: {
                                                                                                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema"
                                                                                                                                    },
                                                                                                                                    name: {
                                                                                                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                },
                                                                                                                                name: {
                                                                                                                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                                                }
                                                                                                                              }
                                                                                                                            },
                                                                                                                            name: {
                                                                                                                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                                            }
                                                                                                                          }
                                                                                                                        },
                                                                                                                        name: {
                                                                                                                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        },
                                                                                                        name: {
                                                                                                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                        }
                                                                                                      }
                                                                                                    },
                                                                                                    name: {
                                                                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                    }
                                                                                                  }
                                                                                                },
                                                                                                name: {
                                                                                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                                }
                                                                                              }
                                                                                            },
                                                                                            name: {
                                                                                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                            }
                                                                                          }
                                                                                        },
                                                                                        name: {
                                                                                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                        }
                                                                                      }
                                                                                    },
                                                                                    name: {
                                                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            },
                                                                            name: {
                                                                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                },
                                                                name: {
                                                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                                }
                                                              }
                                                            },
                                                            name: {
                                                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                            }
                                                          }
                                                        },
                                                        name: {
                                                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                        }
                                                      }
                                                    },
                                                    name: {
                                                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                    }
                                                  }
                                                },
                                                name: {
                                                  $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                                }
                                              }
                                            },
                                            name: {
                                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            name: {
                              $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                            }
                          }
                        },
                        name: {
                          $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                        }
                      }
                    },
                    name: {
                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name"
                    }
                  }
                },
                name: {
                  required: [
                    "first",
                    "last"
                  ],
                  type: "object",
                  properties: {
                    middle: {
                      type: "string",
                      enum: [
                        { $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name/properties/last/type" },
                        { $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name/properties/last/title" }
                      ]
                    },
                    prefix: {
                      minLength: 3,
                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name/properties/last"
                    },
                    last: {
                      minLength: 1,
                      type: "string",
                      title: "requiredString"
                    },
                    suffix: {
                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name/properties/prefix",
                      type: "string",
                      maxLength: 3
                    },
                    first: {
                      $ref: "#/paths/~1family-tree/get/responses/200/schema/properties/name/properties/last"
                    }
                  },
                  title: "name"
                }
              }
            }
          }
        }
      }
    }
  }
};
