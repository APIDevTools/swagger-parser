'use strict';

var form = require('./form');

module.exports = samples;

/**
 * Allows the user to use a sample URL or sample API text
 */
function samples () {
  form.samples.url.link.on('click', function (event) {
    event.preventDefault();
    form.url.val(samples.url);
  });

  form.samples.text.link.on('click', function (event) {
    event.preventDefault();
    form.textBox.setValue(samples.text, -1);
    form.samples.text.container.hide();
    form.textBox.focus();
  });

  form.textBox.on('input', function () {
    if (form.textBox.session.getValue().length === 0) {
      form.samples.text.container.show();
    }
    else {
      form.samples.text.container.hide();
    }
  });
}

samples.url = 'https://apidevtools.org/swagger-parser/www/swagger.yaml';

samples.text =
  'swagger: "2.0"\n' +
  'info:\n' +
  '  version: 1.0.0\n' +
  '  title: Swagger Petstore\n' +
  '  description: >\n' +
  '    A sample API that uses a petstore as an example\n' +
  '    to demonstrate features in the swagger-2.0 specification\n' +
  'consumes:\n' +
  '  - application/json\n' +
  'produces:\n' +
  '  - application/json\n' +
  'paths:\n' +
  '  /pets:\n' +
  '    get:\n' +
  '      description: Returns all pets from the petstore\n' +
  '      responses:\n' +
  '        "200":\n' +
  '          description: pet response\n' +
  '          schema:\n' +
  '            type: array\n' +
  '            items:\n' +
  '              $ref: "#/definitions/pet"\n' +
  '        default:\n' +
  '          description: unexpected error\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/errorModel"\n' +
  '    post:\n' +
  '      description: Creates a new pet in the store\n' +
  '      parameters:\n' +
  '        - name: pet\n' +
  '          in: body\n' +
  '          description: Pet to add to the store\n' +
  '          required: true\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/pet"\n' +
  '      responses:\n' +
  '        "200":\n' +
  '          description: pet response\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/pet"\n' +
  '        default:\n' +
  '          description: unexpected error\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/errorModel"\n' +
  '  "/pets/{name}":\n' +
  '    get:\n' +
  '      description: Returns a single pet by name\n' +
  '      parameters:\n' +
  '        - name: name\n' +
  '          in: path\n' +
  '          description: Name of the pet to fetch\n' +
  '          required: true\n' +
  '          type: string\n' +
  '      responses:\n' +
  '        "200":\n' +
  '          description: pet response\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/pet"\n' +
  '        default:\n' +
  '          description: unexpected error\n' +
  '          schema:\n' +
  '            $ref: "#/definitions/errorModel"\n' +
  'definitions:\n' +
  '  pet:\n' +
  '    $ref: pet.yaml\n' +
  '  pet-owner:\n' +
  '    $ref: pet-owner.yaml\n' +
  '  errorModel:\n' +
  '    $ref: error.json\n';
