"use strict";

const SwaggerParser = require("../../../lib");
const fetch = require("node-fetch");
const {expect} = require("chai");

const RELATIVE_SERVERS_OAS3_URL = "https://petstore3.swagger.io/api/v3/openapi.json"; //Petstore v3 json has relative path in "servers"
describe("Servers with relative paths in OpenAPI v3 files",() => {

  it("should fix relative servers path in the file fetched from url",testRelativeServersPath(RELATIVE_SERVERS_OAS3_URL));

  function testRelativeServersPath(oasFileUrl) {
    return async function () {
      try {
        const response = await fetch(oasFileUrl);
        if (!response.ok) {
          throw new Error("Unable to downlaod relative servers v3 json file");
        }
        let originalJson = await response.json();

        //If the servers url still has relative path, it helps our test
        if ((originalJson.servers?.length > 0) && (originalJson.servers[0].url).startsWith("/")) {
          let apiJson = await SwaggerParser.validate(oasFileUrl);
          expect(apiJson.servers[0].url).to.equal("https://petstore3.swagger.io/api/v3");
        } else {
          console.warn("Petstore v3 file's servers object doesn't have relative path!!!");
        }
      } catch (error) {
        console.error("\n\nError in relative servers test case:",error);
        throw error;
      }
    };
  }
});
