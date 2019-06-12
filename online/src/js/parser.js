"use strict";

const form = require("./form");
const editors = require("./editors");
const analytics = require("./analytics");
const { ono } = require("ono");
const SwaggerParser = require("../../../");

let swaggerParser = null;
let counters = { parse: 0, resolve: 0, bundle: 0, dereference: 0, validate: 0 };

module.exports = parser;

/**
 * Adds event handlers to trigger Swagger Parser methods
 */
function parser () {
  // When the form is submitted, parse the Swagger API
  form.form.on("submit", (event) => {
    event.preventDefault();
    parseSwagger();
  });

  // When the "x" button is clicked, discard the results
  $("#clear").on("click", () => {
    swaggerParser = null;
    editors.clearResults();
    analytics.trackEvent("results", "clear");
  });
}

/**
 * This function is called when the "Validate it!" button is clicked.
 * It calls Swagger Parser, passing it all the options selected on the form.
 */
function parseSwagger () {
  try {
    // Clear any previous results
    editors.clearResults();

    // Get all the parameters
    swaggerParser = swaggerParser || new SwaggerParser();
    let options = form.getOptions();
    let method = form.method.button.val();
    let api = form.getAPI();

    // Call Swagger Parser
    swaggerParser[method](api, options)
      .then(() => {
        // Show the results
        let results = swaggerParser.$refs.values();
        Object.keys(results).forEach((key) => {
          editors.showResult(key, results[key]);
        });
      })
      .catch((err) => {
        editors.showError(ono(err));
        analytics.trackError(err);
      });

    // Track the operation
    counters[method]++;
    analytics.trackEvent("button", "click", method, counters[method]);
  }
  catch (err) {
    editors.showError(ono(err));
    analytics.trackError(err);
  }
}
