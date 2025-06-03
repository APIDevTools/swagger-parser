'use strict';

const validatedAPI = (module.exports = {
	fullyDereferenced: {
		swagger: '2.0',
		info: {
			version: '1.0.0',
			description: 'This API contains circular (recursive) JSON references',
			title: 'Circular $Refs',
		},
		paths: {
			'/pet': {
				get: {
					responses: {
						200: {
							description: 'Returns a pet',
							schema: null,
						},
					},
				},
			},
			'/thing': {
				get: {
					responses: {
						200: {
							description: 'Returns a thing',
							schema: null,
						},
					},
				},
			},
			'/person': {
				get: {
					responses: {
						200: {
							description: 'Returns a person',
							schema: null,
						},
					},
				},
			},
			'/parent': {
				get: {
					responses: {
						200: {
							description: 'Returns a parent',
							schema: null,
						},
					},
				},
			},
		},
		definitions: {
			pet: {
				type: 'object',
				properties: {
					age: {
						type: 'number',
					},
					name: {
						type: 'string',
					},
					species: {
						enum: ['cat', 'dog', 'bird', 'fish'],
						type: 'string',
					},
				},
				title: 'pet',
			},
			thing: {
				$ref: '#/definitions/thing',
			},
			person: {
				title: 'person',
				type: 'object',
				properties: {
					spouse: null,
					name: {
						type: 'string',
					},
				},
			},
			parent: {
				title: 'parent',
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					children: {
						items: null,
						type: 'array',
					},
				},
			},
			child: {
				title: 'child',
				type: 'object',
				properties: {
					parents: {
						items: null,
						type: 'array',
					},
					name: {
						type: 'string',
					},
				},
			},
		},
	},

	ignoreCircular$Refs: {
		swagger: '2.0',
		info: {
			version: '1.0.0',
			description: 'This API contains circular (recursive) JSON references',
			title: 'Circular $Refs',
		},
		paths: {
			'/parent': {
				get: {
					responses: {
						200: {
							description: 'Returns a parent',
							schema: {
								$ref: '#/definitions/parent',
							},
						},
					},
				},
			},
			'/pet': {
				get: {
					responses: {
						200: {
							description: 'Returns a pet',
							schema: null,
						},
					},
				},
			},
			'/thing': {
				get: {
					responses: {
						200: {
							description: 'Returns a thing',
							schema: {
								$ref: '#/definitions/thing',
							},
						},
					},
				},
			},
			'/person': {
				get: {
					responses: {
						200: {
							description: 'Returns a person',
							schema: {
								$ref: '#/definitions/person',
							},
						},
					},
				},
			},
		},
		definitions: {
			pet: {
				type: 'object',
				properties: {
					age: {
						type: 'number',
					},
					name: {
						type: 'string',
					},
					species: {
						enum: ['cat', 'dog', 'bird', 'fish'],
						type: 'string',
					},
				},
				title: 'pet',
			},
			thing: {
				$ref: '#/definitions/thing',
			},
			person: {
				$ref: 'definitions/person.yaml',
			},
			parent: {
				$ref: 'definitions/parent.yaml',
			},
			child: {
				$ref: 'definitions/child.yaml',
			},
		},
	},
});

validatedAPI.fullyDereferenced.paths['/pet'].get.responses['200'].schema =
  validatedAPI.fullyDereferenced.definitions.pet;

validatedAPI.fullyDereferenced.paths['/thing'].get.responses['200'].schema =
  validatedAPI.fullyDereferenced.definitions.thing;

validatedAPI.fullyDereferenced.paths['/person'].get.responses['200'].schema =
  validatedAPI.fullyDereferenced.definitions.person.properties.spouse =
    validatedAPI.fullyDereferenced.definitions.person;

validatedAPI.fullyDereferenced.definitions.parent.properties.children.items =
  validatedAPI.fullyDereferenced.definitions.child;

validatedAPI.fullyDereferenced.paths['/parent'].get.responses['200'].schema =
  validatedAPI.fullyDereferenced.definitions.child.properties.parents.items =
    validatedAPI.fullyDereferenced.definitions.parent;

validatedAPI.ignoreCircular$Refs.paths['/pet'].get.responses['200'].schema =
  validatedAPI.ignoreCircular$Refs.definitions.pet;
