"use strict";

const fetch = require("node-fetch");

module.exports = fetchApiList;

/**
 * Downloads a list of over 2000 real-world Swagger APIs from apis.guru,
 * and applies some custom filtering logic to it.
 */
async function fetchApiList () {
  let response = await fetch("https://api.apis.guru/v2/list.json");

  if (!response.ok) {
    throw new Error("Unable to downlaod real-world APIs from apis.guru");
  }

  let apiMap = await response.json();

  deleteProblematicAPIs(apiMap);
  let apiArray = flatten(apiMap);

  apiArray.sort(byLatestVersion);
  return apiArray;
}

/**
 * Removes certain APIs that are known to cause problems
 */
function deleteProblematicAPIs (apis) {
  // GitHub's CORS policy blocks this request
  delete apis["googleapis.com:adsense"];

  // These APIs cause infinite loops in json-schema-ref-parser.  Still investigating.
  // https://github.com/APIDevTools/json-schema-ref-parser/issues/56
  delete apis["bungie.net"];
  delete apis["stripe.com"];
  delete apis["docusign.net"];
  delete apis["kubernetes.io"];
  delete apis["microsoft.com:graph"];
}

/**
 * Flattens the API object structure into an array containing all versions of all APIs.
 */
function flatten (apimap) {
  let apiArray = [];

  for (let [name, api] of Object.entries(apimap)) {
    for (let [versionNumber, apiVersion] of Object.entries(api.versions)) {
      apiArray.push({
        name,
        version: versionNumber,
        isLatestVersion: versionNumber === api.preferred,
        swaggerYamlUrl: apiVersion.swaggerYamlUrl,
      });
    }
  }

  return apiArray;
}

/**
 * Sorts the array of APIs so that all the primary versions come first.
 */
function byLatestVersion (a, b) {
  if (a.isLatestVersion !== b.isLatestVersion) {
    return a.isLatestVersion ? -1 : 1;
  }
  else if (a.name !== b.name) {
    return a.name < b.name ? -1 : 1;
  }
  else {
    return a.version < b.version ? -1 : 1;
  }
}
