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

    // The Amazon App Mesh API definition has a misplaced "tags" property
    {
      api: "amazonaws.com:appmesh",
      error: "Additional properties not allowed: tags",
      whatToDo: "ignore",
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

    // Cloudmersive.com's API definition contains invalid JSON Schema types
    {
      api: "cloudmersive.com:ocr",
      error: "No enum match for: application/json at #/schema/type",
      whatToDo: "ignore",
    },

    // Contribly's API has a misspelled field name
    {
      api: "contribly.com",
      error: "Property 'includeThumbnail' listed as required but does not exist",
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

    // Motaword has validation errors
    {
      api: "motaword.com",
      error: "Data does not match any schemas from 'oneOf'",
      whatToDo: "ignore",
    },

    // OpenBankingProject's API has validation errors
    {
      api: "openbankingproject.ch",
      error: "Data does not match any schemas from 'oneOf'",
      whatToDo: "ignore",
    },

    // Missing a required field
    {
      api: "opto22.com:groov",
      error: "Property 'isCoreInUse' listed as required but does not exist",
      whatToDo: "ignore",
    },

    // APIs.guru is missing one of Nexmo's API definitions, which causes a 404 error
    {
      api: "nexmo.com",
      error: /Error downloading .*\.yml\s+HTTP ERROR 404/,
      whatToDo: "ignore",
    },

    // Missing a required field
    {
      api: "postmarkapp.com:server",
      error: "Property 'TemplateId' listed as required but does not exist",
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
    // more errors
    {
      api: 'akeneo.com',
      error: 'Token "parent" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'api.video',
      error: 'Token "expiresAt" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'avaza.com',
      error: 'Validation failed. /paths/api/Expense/Attachment/post has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded',
      whatToDo: 'ignore'
    },
    {
      api: 'bluemix.net:containers',
      error: 'Swagger schema validation failed. \n' +
        "  Data does not match any schemas from 'oneOf' at #/paths//build/post/parameters/6\n" +
        "    Data does not match any schemas from 'oneOf' at #/paths//build/post/parameters/6\n" +
        '      Missing required property: schema at #/\n' +
        "      Data does not match any schemas from 'oneOf' at #/\n" +
        '        No enum match for: file at #/type\n' +
        '        No enum match for: body at #/in\n' +
        '        No enum match for: file at #/type\n' +
        '        No enum match for: file at #/type\n' +
        '    Missing required property: $ref at #/paths//build/post/parameters/6\n' +
        ' \n' +
        'JSON_OBJECT_VALIDATION_FAILED',
      whatToDo: 'ignore'
    },
    {
      api: 'box.com',
      error: 'Token "x-box-tag" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'circuitsandbox.net',
      error: 'Swagger schema validation failed. \n' +
        '  Additional properties not allowed: securityDefinitions at #/\n' +
        ' \n' +
        'JSON_OBJECT_VALIDATION_FAILED',
      whatToDo: 'ignore'
    },
    {
      api: 'clicksend.com',
      error: 'Token "value" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'clubhouseapi.com',
      error: 'Token "email" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'credas.co.uk:pi',
      error: 'Token "middleName" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'dev.to',
      error: 'Token "website_url" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'digitalocean.com',
      error: 'Token "slug" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'docker.com:engine',
      error: 'Token "2377/tcp" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'dracoon.team',
      error: 'Token "errorCode" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'enode.io',
      error: 'Swagger schema validation failed. \n' +
        "  Data does not match any schemas from 'oneOf' at #/paths//vehicles/get/parameters/0\n" +
        "    Data does not match any schemas from 'oneOf' at #/paths//vehicles/get/parameters/0/schema\n" +
        "      Data does not match any schemas from 'oneOf' at #/schema/items\n" +
        '        Additional properties not allowed: explode at #/items\n' +
        '        Missing required property: $ref at #/items\n' +
        '      Missing required property: $ref at #/schema\n' +
        '    Missing required property: $ref at #/paths//vehicles/get/parameters/0\n' +
        ' \n' +
        'JSON_OBJECT_VALIDATION_FAILED',
      whatToDo: 'ignore'
    },
    {
      api: 'figshare.com',
      error: 'Token "example" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'files.com',
      error: 'Token "x-docs" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'formapi.io',
      error: 'Token "value" does not exist.',
      whatToDo: 'ignore'
    },
    {
      api: 'frankiefinancial.io',
      error: "Validation failed. Property 'rowid' listed as required but does not exist in '/definitions/UBOResponse'",
      whatToDo: 'ignore'
    },
    {
      api: 'goog.io',
      error: 'Token "total" does not exist.',
      whatToDo: 'ignore'
    }

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
