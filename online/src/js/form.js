"use strict";

const SwaggerParser = require("../../../");

module.exports = form;

/**
 * Finds all form fields and exposes them as properties.
 */
function form () {
  form.form = $("#swagger-parser-form");

  form.allow = {
    label: form.form.find("#allow-label"),
    menu: form.form.find("#allow-menu"),
    json: form.form.find("input[name=allow-json]"),
    yaml: form.form.find("input[name=allow-yaml]"),
    text: form.form.find("input[name=allow-text]"),
    empty: form.form.find("input[name=allow-empty]"),
    unknown: form.form.find("input[name=allow-unknown]")
  };

  form.refs = {
    label: form.form.find("#refs-label"),
    menu: form.form.find("#refs-menu"),
    external: form.form.find("input[name=refs-external]"),
    circular: form.form.find("input[name=refs-circular]")
  };

  form.validate = {
    label: form.form.find("#validate-label"),
    menu: form.form.find("#validate-menu"),
    schema: form.form.find("input[name=validate-schema]"),
    spec: form.form.find("input[name=validate-spec]")
  };

  form.tabs = {
    url: form.form.find("#url-tab"),
    text: form.form.find("#text-tab")
  };

  form.method = {
    button: form.form.find("button[name=method]"),
    menu: form.form.find("#method-menu")
  };

  form.samples = {
    url: {
      container: form.form.find("#url-sample"),
      link: form.form.find("#url-sample-link"),
    },
    text: {
      container: form.form.find("#text-sample"),
      link: form.form.find("#text-sample-link"),
    }
  };

  form.url = form.form.find("input[name=url]");
  form.textBox = null; // This is set in editors.js
  form.bookmark = form.form.find("#bookmark");
}

/**
 * Returns a Swagger Parser options object,
 * set to the current values of all the form fields.
 */
form.getOptions = function () {
  return {
    parse: {
      json: form.allow.json.is(":checked") ? {
        allowEmpty: form.allow.empty.is(":checked"),
      } : false,
      yaml: form.allow.yaml.is(":checked") ? {
        allowEmpty: form.allow.empty.is(":checked"),
      } : false,
      text: form.allow.text.is(":checked") ? {
        allowEmpty: form.allow.empty.is(":checked"),
      } : false,
      binary: form.allow.unknown.is(":checked") ? {
        allowEmpty: form.allow.empty.is(":checked"),
      } : false,
    },
    resolve: {
      external: form.refs.external.is(":checked"),
    },
    dereference: {
      circular: form.refs.circular.is(":checked"),
    },
    validate: {
      schema: form.validate.schema.is(":checked"),
      spec: form.validate.spec.is(":checked"),
    },
  };
};

/**
 * Returns the Swagger API or URL, depending on the current form fields.
 */
form.getAPI = function () {
  // Determine which tab is selected
  if (form.tabs.url.parent().attr("class").indexOf("active") >= 0) {
    let url = form.url.val();
    if (url) {
      return url;
    }
    else {
      throw new URIError("Please specify the URL of your Swagger/OpenAPI definition");
    }
  }
  else {
    let text = form.textBox.getValue();
    if (form.allow.yaml.is(":checked")) {
      return SwaggerParser.YAML.parse(text);
    }
    else if (form.allow.json.is(":checked")) {
      return JSON.parse(text);
    }
    else {
      throw new SyntaxError("Unable to parse the API. Neither YAML nor JSON are allowed.");
    }
  }
};
