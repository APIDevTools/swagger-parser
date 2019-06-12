"use strict";

const qs = require("querystring");
const form = require("./form");

module.exports = querystring;

/**
 * Initializes the UI, based on the query-string in the URL
 */
function querystring () {
  setFormFields();
  setBookmarkURL();
  form.bookmark.on("click focus mouseenter", setBookmarkURL);
}

/**
 * Populates all form fields based on the query-string in the URL
 */
function setFormFields () {
  let query = qs.parse(window.location.search.substr(1));

  setCheckbox(form.allow.json, query["allow-json"]);
  setCheckbox(form.allow.yaml, query["allow-yaml"]);
  setCheckbox(form.allow.text, query["allow-text"]);
  setCheckbox(form.allow.empty, query["allow-empty"]);
  setCheckbox(form.allow.unknown, query["allow-unknown"]);
  setCheckbox(form.refs.external, query["refs-external"]);
  setCheckbox(form.refs.circular, query["refs-circular"]);
  setCheckbox(form.validate.schema, query["validate-schema"]);
  setCheckbox(form.validate.spec, query["validate-spec"]);

  // If a custom URL is specified, then show the "Your API" tab
  if (query.url) {
    form.url.val(query.url);
  }

  // If a method is specified, then change the "Validate!" button
  if (query.method) {
    query.method = query.method.toLowerCase();
    if (["parse", "resolve", "bundle", "dereference", "validate"].indexOf(query.method) !== -1) {
      form.method.button.val(query.method);
    }
  }
}

/**
 * Checks or unchecks the given checkbox, based on the given value.
 *
 * @param {jQuery} input
 * @param {*} value
 */
function setCheckbox (input, value) {
  if (!value || value === "true" || value === "on") {
    value = "yes";
  }
  input.val([value]);
}

/**
 * Sets the href of the bookmark link, based on the values of each form field
 */
function setBookmarkURL () {
  let query = {};
  let options = form.getOptions();
  options.parse.json || (query["allow-json"] = "no");
  options.parse.yaml || (query["allow-yaml"] = "no");
  options.parse.text || (query["allow-text"] = "no");
  options.parse.json.allowEmpty || (query["allow-empty"] = "no");
  options.parse.binary || (query["allow-unknown"] = "no");
  options.resolve.external || (query["refs-external"] = "no");
  options.dereference.circular || (query["refs-circular"] = "no");
  options.validate.schema || (query["validate-schema"] = "no");
  options.validate.spec || (query["validate-spec"] = "no");

  let method = form.method.button.val();
  method === "validate" || (query.method = method);

  let url = form.url.val();
  url === "" || (query.url = url);

  let bookmark = "?" + qs.stringify(query);
  form.bookmark.attr("href", bookmark);
}
