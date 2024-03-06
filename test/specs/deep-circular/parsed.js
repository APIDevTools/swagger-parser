"use strict";

module.exports = {
  api: {
    swagger: "2.0",
    info: {
      version: "1.0.0",
      description: "This API contains a VERY DEEP circular (recursive) JSON reference",
      title: "Deep Circular $Ref",
    },
    paths: {
      "/family-tree": {
        get: {
          responses: {
            200: {
              description: "Returns a really deep family tree",
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  level1: {
                    required: ["name"],
                    type: "object",
                    properties: {
                      level2: {
                        required: ["name"],
                        type: "object",
                        properties: {
                          level3: {
                            required: ["name"],
                            type: "object",
                            properties: {
                              level4: {
                                required: ["name"],
                                type: "object",
                                properties: {
                                  name: {
                                    $ref: "definitions/name.yaml",
                                  },
                                  level5: {
                                    required: ["name"],
                                    type: "object",
                                    properties: {
                                      name: {
                                        $ref: "definitions/name.yaml",
                                      },
                                      level6: {
                                        required: ["name"],
                                        type: "object",
                                        properties: {
                                          name: {
                                            $ref: "definitions/name.yaml",
                                          },
                                          level7: {
                                            required: ["name"],
                                            type: "object",
                                            properties: {
                                              level8: {
                                                required: ["name"],
                                                type: "object",
                                                properties: {
                                                  level9: {
                                                    required: ["name"],
                                                    type: "object",
                                                    properties: {
                                                      level10: {
                                                        required: ["name"],
                                                        type: "object",
                                                        properties: {
                                                          level11: {
                                                            required: ["name"],
                                                            type: "object",
                                                            properties: {
                                                              level12: {
                                                                required: ["name"],
                                                                type: "object",
                                                                properties: {
                                                                  level13: {
                                                                    required: ["name"],
                                                                    type: "object",
                                                                    properties: {
                                                                      name: {
                                                                        $ref: "definitions/name.yaml",
                                                                      },
                                                                      level14: {
                                                                        required: ["name"],
                                                                        type: "object",
                                                                        properties: {
                                                                          name: {
                                                                            $ref: "definitions/name.yaml",
                                                                          },
                                                                          level15: {
                                                                            required: ["name"],
                                                                            type: "object",
                                                                            properties: {
                                                                              level16: {
                                                                                required: ["name"],
                                                                                type: "object",
                                                                                properties: {
                                                                                  name: {
                                                                                    $ref: "definitions/name.yaml",
                                                                                  },
                                                                                  level17: {
                                                                                    required: ["name"],
                                                                                    type: "object",
                                                                                    properties: {
                                                                                      level18: {
                                                                                        required: ["name"],
                                                                                        type: "object",
                                                                                        properties: {
                                                                                          level19: {
                                                                                            required: ["name"],
                                                                                            type: "object",
                                                                                            properties: {
                                                                                              level20: {
                                                                                                required: ["name"],
                                                                                                type: "object",
                                                                                                properties: {
                                                                                                  level21: {
                                                                                                    required: ["name"],
                                                                                                    type: "object",
                                                                                                    properties: {
                                                                                                      level22: {
                                                                                                        required: [
                                                                                                          "name",
                                                                                                        ],
                                                                                                        type: "object",
                                                                                                        properties: {
                                                                                                          level23: {
                                                                                                            required: [
                                                                                                              "name",
                                                                                                            ],
                                                                                                            type: "object",
                                                                                                            properties:
                                                                                                              {
                                                                                                                name: {
                                                                                                                  $ref: "definitions/name.yaml",
                                                                                                                },
                                                                                                                level24:
                                                                                                                  {
                                                                                                                    required:
                                                                                                                      [
                                                                                                                        "name",
                                                                                                                      ],
                                                                                                                    type: "object",
                                                                                                                    properties:
                                                                                                                      {
                                                                                                                        name: {
                                                                                                                          $ref: "definitions/name.yaml",
                                                                                                                        },
                                                                                                                        level25:
                                                                                                                          {
                                                                                                                            required:
                                                                                                                              [
                                                                                                                                "name",
                                                                                                                              ],
                                                                                                                            type: "object",
                                                                                                                            properties:
                                                                                                                              {
                                                                                                                                name: {
                                                                                                                                  $ref: "definitions/name.yaml",
                                                                                                                                },
                                                                                                                                level26:
                                                                                                                                  {
                                                                                                                                    required:
                                                                                                                                      [
                                                                                                                                        "name",
                                                                                                                                      ],
                                                                                                                                    type: "object",
                                                                                                                                    properties:
                                                                                                                                      {
                                                                                                                                        level27:
                                                                                                                                          {
                                                                                                                                            required:
                                                                                                                                              [
                                                                                                                                                "name",
                                                                                                                                              ],
                                                                                                                                            type: "object",
                                                                                                                                            properties:
                                                                                                                                              {
                                                                                                                                                level28:
                                                                                                                                                  {
                                                                                                                                                    required:
                                                                                                                                                      [
                                                                                                                                                        "name",
                                                                                                                                                      ],
                                                                                                                                                    type: "object",
                                                                                                                                                    properties:
                                                                                                                                                      {
                                                                                                                                                        level29:
                                                                                                                                                          {
                                                                                                                                                            required:
                                                                                                                                                              [
                                                                                                                                                                "name",
                                                                                                                                                              ],
                                                                                                                                                            type: "object",
                                                                                                                                                            properties:
                                                                                                                                                              {
                                                                                                                                                                level30:
                                                                                                                                                                  {
                                                                                                                                                                    $ref: "#/paths/~1family-tree/get/responses/200/schema",
                                                                                                                                                                  },
                                                                                                                                                                name: {
                                                                                                                                                                  $ref: "definitions/name.yaml",
                                                                                                                                                                },
                                                                                                                                                              },
                                                                                                                                                          },
                                                                                                                                                        name: {
                                                                                                                                                          $ref: "definitions/name.yaml",
                                                                                                                                                        },
                                                                                                                                                      },
                                                                                                                                                  },
                                                                                                                                                name: {
                                                                                                                                                  $ref: "definitions/name.yaml",
                                                                                                                                                },
                                                                                                                                              },
                                                                                                                                          },
                                                                                                                                        name: {
                                                                                                                                          $ref: "definitions/name.yaml",
                                                                                                                                        },
                                                                                                                                      },
                                                                                                                                  },
                                                                                                                              },
                                                                                                                          },
                                                                                                                      },
                                                                                                                  },
                                                                                                              },
                                                                                                          },
                                                                                                          name: {
                                                                                                            $ref: "definitions/name.yaml",
                                                                                                          },
                                                                                                        },
                                                                                                      },
                                                                                                      name: {
                                                                                                        $ref: "definitions/name.yaml",
                                                                                                      },
                                                                                                    },
                                                                                                  },
                                                                                                  name: {
                                                                                                    $ref: "definitions/name.yaml",
                                                                                                  },
                                                                                                },
                                                                                              },
                                                                                              name: {
                                                                                                $ref: "definitions/name.yaml",
                                                                                              },
                                                                                            },
                                                                                          },
                                                                                          name: {
                                                                                            $ref: "definitions/name.yaml",
                                                                                          },
                                                                                        },
                                                                                      },
                                                                                      name: {
                                                                                        $ref: "definitions/name.yaml",
                                                                                      },
                                                                                    },
                                                                                  },
                                                                                },
                                                                              },
                                                                              name: {
                                                                                $ref: "definitions/name.yaml",
                                                                              },
                                                                            },
                                                                          },
                                                                        },
                                                                      },
                                                                    },
                                                                  },
                                                                  name: {
                                                                    $ref: "definitions/name.yaml",
                                                                  },
                                                                },
                                                              },
                                                              name: {
                                                                $ref: "definitions/name.yaml",
                                                              },
                                                            },
                                                          },
                                                          name: {
                                                            $ref: "definitions/name.yaml",
                                                          },
                                                        },
                                                      },
                                                      name: {
                                                        $ref: "definitions/name.yaml",
                                                      },
                                                    },
                                                  },
                                                  name: {
                                                    $ref: "definitions/name.yaml",
                                                  },
                                                },
                                              },
                                              name: {
                                                $ref: "definitions/name.yaml",
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              name: {
                                $ref: "definitions/name.yaml",
                              },
                            },
                          },
                          name: {
                            $ref: "definitions/name.yaml",
                          },
                        },
                      },
                      name: {
                        $ref: "definitions/name.yaml",
                      },
                    },
                  },
                  name: {
                    $ref: "definitions/name.yaml",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  name: {
    title: "name",
    required: ["first", "last"],
    type: "object",
    properties: {
      middle: {
        type: "string",
        enum: [{ $ref: "#/properties/first/type" }, { $ref: "#/properties/last/title" }],
      },
      prefix: {
        minLength: 3,
        $ref: "#/properties/last",
      },
      last: {
        $ref: "./required-string.yaml",
      },
      suffix: {
        $ref: "#/properties/prefix",
        type: "string",
        maxLength: 3,
      },
      first: {
        $ref: "../definitions/required-string.yaml",
      },
    },
  },

  requiredString: {
    minLength: 1,
    type: "string",
    title: "requiredString",
  },
};
