"use strict";

const { host } = require("@jsdevtools/host-environment");

const knownErrors = module.exports = {
  /**
   * An array of known validation errors in certain API definitions on APIs.guru
   */
  all: getKnownApiErrors(),

  /**
   * Determines whether an API and error match a known error.
   */
  find (api, error) {
    for (let knownError of knownErrors.all) {
      if (typeof knownError.api === "string" && !api.name.includes(knownError.api)) {
        continue;
      }

      if (typeof knownError.error === "string" && !error.message.includes(knownError.error)) {
        continue;
      }

      if (knownError.error instanceof RegExp && !knownError.error.test(error.message)) {
        continue;
      }

      return knownError;
    }
  },
};

/**
 * Returns a list of known validation errors in certain API definitions on APIs.guru.
 */
function getKnownApiErrors () {
  let errors = [
    // If the API definition failed to download, then retry
    {
      error: /Error downloading https?:.*swagger\.yaml/,
      whatToDo: "retry",
    },
    {
      error: "socket hang up",
      whatToDo: "retry",
    },

    // Apigee's API definitions contain arrays without "items" schemas
    {
      api: "apigee.net",
      error: 'is an array, so it must include an "items" schema',
      whatToDo: "ignore",
    },

    // Many Azure API definitions erroneously reference external files that don't exist
    {
      api: "azure.com",
      error: /Error downloading .*\.json\s+HTTP ERROR 404/,
      whatToDo: "ignore",
    },

    // Many Azure API definitions have endpoints with multiple "location" placeholders, which is invalid
    {
      api: "azure.com",
      error: "has multiple path placeholders named {location}",
      whatToDo: "ignore",
    },

    // Figshare.com's API definition contains arrays without "items" schemas
    {
      api: "figshare.com",
      error: 'is an array, so it must include an "items" schema',
      whatToDo: "ignore",
    },

    // Some of Google's APIs have query parameters with conflicting names, which is invalid
    {
      api: "googleapis.com",
      error: "Array items are not unique",
      whatToDo: "ignore",
    },

    // APIs.guru is missing one of Nexmo's API definitions, which causes a 404 error
    {
      api: "nexmo.com",
      error: /Error downloading .*\.yml\s+HTTP ERROR 404/,
      whatToDo: "ignore",
    },

    // Stoplight.io's API definition uses multi-type schemas, which isn't allowed by Swagger 2.0
    {
      api: "stoplight.io",
      error: "invalid response schema type (object,string)",
      whatToDo: "ignore",
    },

    // TomTom's API definition combines multiple response codes together, which isn't allowed
    {
      api: "tomtom.com",
      error: "Additional properties not allowed: 404/596",
      whatToDo: "ignore",
    },

    // VersionEye's API definition is missing MIME types
    {
      api: "versioneye.com",
      error: "has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",
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
    errors.push({
      api: "amazonaws.com",
      error: "Object didn't pass validation for format regex",
      whatToDo: "ignore",
    });
  }

  return errors;
}
