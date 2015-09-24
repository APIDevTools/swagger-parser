var form        = require('./form'),
    querystring = require('./querystring'),
    dropdowns   = require('./dropdowns'),
    editor      = require('./editor');

$(function() {
  // Initialize the page
  form.init();
  querystring.init();
  dropdowns.init();
  editor.init();

  // Parse the Swagger API when the form is submitted
  form.form.on('submit', function(event) {
    event.preventDefault();
    parseSwagger();
  });
});

function parseSwagger() {
  var options = {
    allow: {
      json: form.allow.json.is(':checked'),
      yaml: form.allow.yaml.is(':checked'),
      empty: form.allow.empty.is(':checked'),
      unknown: form.allow.unknown.is(':checked')
    },
    $refs: {
      internal: form.refs.internal.is(':checked'),
      external: form.refs.external.is(':checked'),
      circular: form.refs.circular.is(':checked')
    },
    validate: {
      schema: form.validate.schema.is(':checked'),
      spec: form.validate.spec.is(':checked')
    },
    cache: {
      http: form.cache.parse(form.cache.http.val()),
      https: form.cache.parse(form.cache.https.val())
    }
  };
  var method = form.method.button.val();
  var api = form.url.val() || SwaggerParser.YAML.parse(form.sampleAPI.val());

  alert('SwaggerParser.' + method + '(' + api + ', ' + JSON.stringify(options, null, 2) + ')');
}
