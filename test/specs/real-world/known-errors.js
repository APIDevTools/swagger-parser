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
    // Many of the Azure API definitions have references to external files that don't exist
    // NOTE: This entry must come FIRST, otherwise every broken Azure API is retried multiple times
    {
      api: "azure.com",
      error: /Error downloading https?:/,
      whatToDo: "ignore",
    },

    // If the API definition failed to download, then retry
    {
      error: /Error downloading https?:/,
      whatToDo: "retry",
    },
    {
      error: "socket hang up",
      whatToDo: "retry",
    },

    // Many API have info version using date / datetime stamp (e.g. amazonaws.com).
    // https://github.com/APIDevTools/json-schema-ref-parser/pull/247
    {
      error: "#/info/version must be string",
      whatToDo: "ignore",
    },

    // They have a string pattern set to `00:00:00.00` and YAML parsing is converting it to a `Date` object.
    // https://github.com/APIDevTools/json-schema-ref-parser/pull/247
    {
      api: "api.video",
      error: "timecode/pattern must be string",
      whatToDo: "ignore",
    },

    // Many Azure API definitions erroneously reference external files that don't exist.
    {
      api: "azure.com",
      error: /Error downloading .*\.json\s+HTTP ERROR 404/,
      whatToDo: "ignore",
    },

    // Many Azure API definitions have endpoints with multiple "location" placeholders, which is invalid.
    {
      api: "azure.com",
      error: "has multiple path placeholders named {location}",
      whatToDo: "ignore",
    },

    {
      api: "avaza.com",
      error: "has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",
      whatToDo: "ignore"
    },

    // They have a description of `2015-04-22T10:03:19.323-07:00` and YAML parsing is converting that to a `Date`.
    // https://github.com/APIDevTools/json-schema-ref-parser/pull/247
    {
      api: "beanstream.com",
      error: "trn_date_time/description must be string",
      whatToDo: "ignore",
    },

    // Cloudmersive.com's API definition contains invalid JSON Schema types
    {
      api: "cloudmersive.com:ocr",
      error: "schema/type must be equal to one of the allowed values",
      whatToDo: "ignore",
    },

    // Contribly's API has a misspelled field name
    {
      api: "contribly.com",
      error: "Property 'includeThumbnail' listed as required but does not exist",
      whatToDo: "ignore",
    },

    {
      api: "enode.io",
      error: "schema/items must NOT have additional properties",
      whatToDo: "ignore"
    },
    {
      api: "frankiefinancial.io",
      error: "Property 'rowid' listed as required but does not exist",
      whatToDo: "ignore"
    },
    {
      api: "github.com",
      error: 'Token "0" does not exist',
      whatToDo: "ignore",
    },
    {
      api: "github.com",
      error: 'Token "expires_at" does not exist',
      whatToDo: "ignore",
    },

    // Some Google APIs have a `source` property at the root.
    {
      api: "googleapis.com",
      error: "#/ must NOT have additional properties",
      whatToDo: "ignore",
    },

    {
      api: "motaword.com",
      error: "properties/source must NOT have additional properties",
      whatToDo: "ignore"
    },
    {
      api: "openapi-generator.tech",
      error: "schema/additionalProperties must NOT have additional properties",
      whatToDo: "ignore",
    },
    {
      api: "opensuse.org",
      error: "xmlns/xml must NOT have additional properties",
      whatToDo: "ignore",
    },

    // Missing a required field
    {
      api: "opto22.com:groov",
      error: "Property 'isCoreInUse' listed as required but does not exist",
      whatToDo: "ignore",
    },

    {
      api: "personio.de",
      error: 'Token "comment" does not exist',
      whatToDo: "ignore",
    },

    // Missing a required field
    {
      api: "postmarkapp.com:server",
      error: "Property 'TemplateId' listed as required but does not exist",
      whatToDo: "ignore",
    },

    {
      api: "rebilly.com",
      error: 'Token "feature" does not exist',
      whatToDo: "ignore",
    },
    {
      api: "statsocial.com",
      error: 'Token "18_24" does not exist',
      whatToDo: "ignore"
    },
    {
      api: "testfire.net:altoroj",
      error: "Property 'passwrod1' listed as required but does not exist",
      whatToDo: "ignore"
    },
    {
      api: "turbinelabs.io",
      error: "Property 'listener_key' listed as required but does not exist",
      whatToDo: "ignore"
    },

    // VersionEye's API definition is missing MIME types
    {
      api: "versioneye.com",
      error: "has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",
      whatToDo: "ignore",
    },

    {
      api: "vestorly.com",
      error: "Property 'orginator_email' listed as required but does not exist",
      whatToDo: "ignore"
    },
    {
      api: "viator.com",
      error: 'Token "pas" does not exist',
      whatToDo: "ignore"
    },
    {
      api: "whapi.com:accounts",
      error: "Property 'nif (italy only)' listed as required but does not exist",
      whatToDo: "ignore"
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
