var form    = require('./form'),
    editors = require('./editors'),
    ono     = require('ono'),
    parser  = null;

/**
 * Adds event handlers to trigger Swagger Parser methods
 */
exports.init = function() {
  // When the form is submitted, parse the Swagger API
  form.form.on('submit', function(event) {
    event.preventDefault();
    parseSwagger();
  });

  // When the "x" button is clicked, discard the results and clear the cache
  $('#clear').on('click', function() {
    parser = null;
    editors.clearResults();
  });
};

/**
 * This function is called when the "Validate it!" button is clicked.
 * It calls Swagger Parser, passing it all the options selected on the form.
 */
function parseSwagger() {
  try {
    // Clear any previous results
    editors.clearResults();

    // Get all the parameters
    parser = parser || new SwaggerParser();
    var options = form.getOptions();
    var method = form.method.button.val();
    var api = form.getAPI();

    // Call Swagger Parser
    parser[method](api, options)
      .then(function() {
        // Show the results
        var results = parser.$refs.values();
        Object.keys(results).forEach(function(key) {
          editors.showResult(key, results[key]);
        });
      })
      .catch(function(err) {
        editors.showError(ono(err));
      });
  }
  catch (err) {
    editors.showError(ono(err));
  }
}
