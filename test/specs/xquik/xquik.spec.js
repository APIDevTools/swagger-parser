"use strict";

const { expect } = require("chai");
const SwaggerParser = require("../../..");
const path = require("../../utils/path");

describe("Xquik OpenAPI 3.1 fixture", () => {
  it("validates the search endpoint and API key security scheme", async () => {
    const api = await SwaggerParser.validate(path.rel("specs/xquik/xquik-openapi.yaml"));
    const operation = api.paths["/api/v1/x/tweets/search"].get;
    const responseSchema = operation.responses["200"].content["application/json"].schema;
    const scheme = api.components.securitySchemes.apiKey;

    expect(api.openapi).to.equal("3.1.0");
    expect(api.info.title).to.equal("Xquik API");
    expect(operation.operationId).to.equal("searchTweets");
    expect(operation.responses["200"].description).to.equal("Search results.");
    expect(responseSchema.required).to.deep.equal(["tweets", "has_next_page", "next_cursor"]);
    expect(responseSchema.properties.tweets.items.required).to.include.members([
      "id",
      "text",
      "likeCount",
      "viewCount",
    ]);
    expect(responseSchema.properties.tweets.items.properties.author.required).to.deep.equal(["id", "username", "name"]);
    expect(scheme.type).to.equal("apiKey");
    expect(scheme.in).to.equal("header");
    expect(scheme.name).to.equal("x-api-key");
  });
});
