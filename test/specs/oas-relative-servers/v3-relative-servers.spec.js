'use strict';

const SwaggerParser = require('../../../lib');
const { expect } = require('chai');
const path = require('../../utils/path');

// Import of our fixed OpenAPI JSON files
const v3RelativeServerJson = require('./v3-relative-server.json');
const v3RelativeServerPathsOpsJson = require('./v3-relative-server-paths-ops.json');
const v3NonRelativeServerJson = require('./v3-non-relative-server.json');

// Petstore v3 json has relative path in "servers"
const RELATIVE_SERVERS_OAS3_URL_1 =
  'https://petstore3.swagger.io/api/v3/openapi.json';

// This will have "servers" at paths & operations level
const RELATIVE_SERVERS_OAS3_URL_2 =
  'https://foo.my.cloud/v1/petstore/relativeservers';

const resolverOptions = {
	resolve: {
		http: {
			read() {
				// to prevent edit of the original JSON
				return JSON.parse(JSON.stringify(v3RelativeServerPathsOpsJson));
			},
		},
	},
};
const resolverOptionsNonRel = {
	resolve: {
		http: {
			read() {
				// to prevent edit of the original JSON
				return JSON.parse(JSON.stringify(v3NonRelativeServerJson));
			},
		},
	},
};
const resolverOptionsBase = {
	resolve: {
		http: {
			read() {
				// to prevent edit of the original JSON
				return JSON.parse(JSON.stringify(v3RelativeServerJson));
			},
		},
	},
};
describe('Servers with relative paths in OpenAPI v3 files', () => {
	it('should fix relative servers path in the file fetched from url', async () => {
		try {
			let apiJson = await SwaggerParser.parse(
				RELATIVE_SERVERS_OAS3_URL_1,
				resolverOptionsBase,
			);
			expect(apiJson.servers[0].url).to.equal(
				'https://petstore3.swagger.io/api/v3',
			);
		} catch (error) {
			console.error('\n\nError in relative servers at root test case:', error);
			throw error;
		}
	});

	it('should fix relative servers at root, path and operations level in the file fetched from url', async () => {
		try {
			let apiJson = await SwaggerParser.parse(
				RELATIVE_SERVERS_OAS3_URL_2,
				resolverOptions,
			);
			expect(apiJson.servers[0].url).to.equal('https://foo.my.cloud/api/v3');
			expect(apiJson.paths['/pet'].servers[0].url).to.equal(
				'https://foo.my.cloud/api/v4',
			);
			expect(apiJson.paths['/pet'].get.servers[0].url).to.equal(
				'https://foo.my.cloud/api/v5',
			);
		} catch (error) {
			console.error(
				'\n\nError in relative servers at root, path and operations test case:',
				error,
			);
			throw error;
		}
	});

	it('should parse but no change to non-relative servers path in local file import', async () => {
		try {
			let apiJson = await SwaggerParser.parse(
				path.rel('specs/oas-relative-servers/v3-non-relative-server.json'),
				resolverOptionsNonRel,
			);
			expect(apiJson.servers[0].url).to.equal(
				'https://petstore3.swagger.com/api/v3',
			);
			expect(apiJson.paths['/pet'].servers[0].url).to.equal(
				'https://petstore3.swagger.com/api/v4',
			);
			expect(apiJson.paths['/pet'].get.servers[0].url).to.equal(
				'https://petstore3.swagger.com/api/v5',
			);
		} catch (error) {
			console.error(
				'\n\nError in non-relative servers at root but local file import test case:',
				error,
			);
			throw error;
		}
	});
});
