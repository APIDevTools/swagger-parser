"use strict";

const { host } = require("host-environment");
const fetch = require("node-fetch");
const SwaggerParser = require("../../..");

describe("Real-world APIs", () => {
  let MAX_APIS_TO_TEST = 3000;
  let START_AT_INDEX = 0;
  let MAX_DOWNLOAD_RETRIES = 3;

  let apiIndex = START_AT_INDEX;
  let realWorldAPIs = [];
  let knownApiErrors = getKnownApiErrors();

  before(async function () {
    // This hook sometimes takes several seconds, due to the large download
    this.timeout(10000);

    // Download a list of over 2000 real-world Swagger APIs from apis.guru
    let response = await fetch("https://api.apis.guru/v2/list.json");

    if (!response.ok) {
      throw new Error("Unable to downlaod real-world APIs from apis.guru");
    }

    // Remove certain APIs that are known to cause problems
    let apis = await response.json();

    // GitHub's CORS policy blocks this request
    delete apis["googleapis.com:adsense"];

    // These APIs cause infinite loops in json-schema-ref-parser.  Still investigating.
    // https://github.com/APIDevTools/json-schema-ref-parser/issues/56
    delete apis["bungie.net"];
    delete apis["stripe.com"];

    // Flatten the list, so there's an API object for every API version
    realWorldAPIs = [];
    for (let apiName of Object.keys(apis)) {
      for (let version of Object.keys(apis[apiName].versions)) {
        let api = apis[apiName].versions[version];
        api.name = apiName;
        api.version = version;
        realWorldAPIs.push(api);
      }
    }
  });

  beforeEach(function () {
    // Increase the timeouts by A LOT because:
    //   1) CI is really slow
    //   2) Some API definitions are HUGE and take a while to download
    //   3) If the download fails, we retry 2 times, which takes even more time
    //   4) Really large API definitions take longer to pase, dereference, and validate
    this.currentTest.timeout(host.env.CI ? 300000 : 60000);     // 5 minutes in CI, 1 minute locally
    this.currentTest.slow(5000);
  });

  // Mocha requires us to create our tests synchronously. But the list of APIs is downloaded asynchronously.
  // So, we just create a bunch of placeholder tests, and then rename them later to reflect which API they're testing.
  for (let i = 1; i <= MAX_APIS_TO_TEST; i++) {
    it(i + ") ", testNextAPI);
  }

  /**
   * This Mocha test is repeated for each API in the APIs.guru registry
   */
  async function testNextAPI () {
    // Get the next API to test
    let api = realWorldAPIs[apiIndex++];

    if (api) {
      this.test.title += api.name + " " + (api.version[0] === "v" ? api.version : "v" + api.version);
      await validateApi(api);
    }
    else {
      // There are no more APIs to test
      this.test.title += "more APIs coming soon...";
    }
  }

  /**
   * Downloads an API definition and validates it.  Automatically retries if the download fails.
   */
  async function validateApi (api, attemptNumber) {
    attemptNumber = attemptNumber || 1;

    try {
      await SwaggerParser.validate(api.swaggerYamlUrl);
      throw new Error("boooooom");
    }
    catch (error) {
      let knownError = findKnownApiError(api, error);

      if (!knownError) {
        console.error("\n\nERROR IN THIS API:", JSON.stringify(api, null, 2));
        throw error;
      }

      if (knownError.whatToDo === "ignore") {
        // Ignore the error.  It's a known problem with this API
        return null;
      }

      if (knownError.whatToDo === "retry") {
        if (attemptNumber >= MAX_DOWNLOAD_RETRIES) {
          console.error("        failed to download.  giving up.");
          return null;
        }
        else {
          // Wait a few seconds, then try the download again
          await new Promise((resolve) => {
            console.error("        failed to download.  trying again...");
            setTimeout(resolve, 2000);
          });

          await validateApi(api, attemptNumber + 1);
        }
      }
    }
  }

  /**
   * Determines whether an API and error match a known error.
   */
  function findKnownApiError (api, error) {
    for (let i = 0; i < knownApiErrors.length; i++) {
      let knownError = knownApiErrors[i];

      if (typeof knownError.api === "string" && api.name.indexOf(knownError.api) === -1) {
        continue;
      }

      if (typeof knownError.error === "string" && error.message.indexOf(knownError.error) === -1) {
        continue;
      }

      if (knownError.error instanceof RegExp && !knownError.error.test(error.message)) {
        continue;
      }

      return true;
    }
  }

  /**
   * Returns a list of known validation errors in certain API definitions on APIs.guru.
   */
  function getKnownApiErrors () {
    let knownErrors = [
      // If the API definition failed to download, then retry
      {
        error: /Error downloading https?:.*swagger\.yaml/,
        whatToDo: "retry",
      },
      {
        error: "socket hang up",
        whatToDo: "retry",
      },

      // Many Azure API definitions erroneously reference external files that don't exist
      {
        api: "azure.com", error: /Error downloading .*\.json\s+HTTP ERROR 404/,
        whatToDo: "ignore",
      },

      // Many Azure API definitions have endpoints with multiple "location" placeholders, which is invalid
      {
        api: "azure.com", error: "has multiple path placeholders named {location}",
        whatToDo: "ignore",
      },

      // Stoplight.io's API definition uses multi-type schemas, which isn't allowed by Swagger 2.0
      {
        api: "stoplight.io", error: "invalid response schema type (object,string)",
        whatToDo: "ignore",
      },

      // VersionEye's API definition is missing MIME types
      {
        api: "versioneye.com", error: "has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",
        whatToDo: "ignore",
      },
    ];

    if ((host.node && host.node.version < 8) || (host.browser && !host.browser.chrome)) {
      // Many AWS APIs contain RegEx patterns that are invalid on older versions of Node
      // and some browsers. They work fine on Node 8+ and Chrome though.
      //
      // Examples of problematic RegExp include:
      //    ^[0-9A-Za-z\.\-_]*(?<!\.)$
      //    jdbc:(redshift|postgresql)://((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+redshift\.amazonaws\.com:\d{1,5}/[a-zA-Z0-9_$]+
      //
      knownErrors.push({
        api: "amazonaws.com",
        error: "Object didn't pass validation for format regex",
        whatToDo: "ignore",
      });
    }

    return knownErrors;
  }
});
