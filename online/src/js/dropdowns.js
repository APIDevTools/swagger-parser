"use strict";

const form = require("./form");
const analytics = require("./analytics");

module.exports = dropdowns;

/**
 * Adds all the drop-down menu functionality
 */
function dropdowns () {
  // Set the initial method name (in case it was set by the querystring module)
  setSelectedMethod(form.method.button.val());

  // Update each dropdown's label when its value(s) change
  onChange(form.allow.menu, setAllowLabel);
  onChange(form.refs.menu, setRefsLabel);
  onChange(form.validate.menu, setValidateLabel);

  // Track option changes
  trackCheckbox(form.allow.json);
  trackCheckbox(form.allow.yaml);
  trackCheckbox(form.allow.text);
  trackCheckbox(form.allow.empty);
  trackCheckbox(form.allow.unknown);
  trackCheckbox(form.refs.external);
  trackCheckbox(form.refs.circular);
  trackCheckbox(form.validate.schema);
  trackCheckbox(form.validate.spec);

  // Change the button text whenever a new method is selected
  form.method.menu.find("a").on("click", function (event) {
    form.method.menu.dropdown("toggle");
    event.stopPropagation();
    let methodName = $(this).data("value");
    setSelectedMethod(methodName);
    trackButtonLabel(methodName);
  });
}

/**
 * Calls the given function whenever the user selects (or deselects)
 * a value in the given drop-down menu.
 *
 * @param {jQuery} menu        - dropdown menu we're using
 * @param {Function} setLabel  - value to be set (or unset)
 */
function onChange (menu, setLabel) {
  let dropdown = menu.parent(".dropdown");

  // Don't auto-close the menu when items are clicked
  menu.find("a").on("click", (event) => {
    event.stopPropagation();
  });

  // Set the label immediately, and again whenever the menu is closed
  setLabel();
  dropdown.on("hidden.bs.dropdown", setLabel);

  // Track when a dropdown menu is shown
  dropdown.on("shown.bs.dropdown", () => {
    analytics.trackEvent("options", "shown", menu.attr("id"));
  });
}

/**
 * Sets the "allow" label, based on which options are selected
 */
function setAllowLabel () {
  let values = getCheckedAndUnchecked(
    form.allow.json, form.allow.yaml, form.allow.text, form.allow.empty, form.allow.unknown);

  switch (values.checked.length) {
    case 0:
      form.allow.label.text("No file types allowed");
      break;
    case 1:
      form.allow.label.text("Only allow " + values.checked[0] + " files");
      break;
    case 2:
      form.allow.label.text("Only allow " + values.checked[0] + " and " + values.checked[1]);
      break;
    case 3:
      form.allow.label.text("Don't allow " + values.unchecked[0] + " or " + values.unchecked[1]);
      break;
    case 4:
      form.allow.label.text("Don't allow " + values.unchecked[0] + " files");
      break;
    case 5:
      form.allow.label.text("Allow all file types");
  }
}

/**
 * Sets the "refs" label, based on which options are selected
 */
function setRefsLabel () {
  let values = getCheckedAndUnchecked(form.refs.external, form.refs.circular);

  switch (values.checked.length) {
    case 0:
      form.refs.label.text("Only follow internal $refs");
      break;
    case 1:
      form.refs.label.text("Don't follow " + values.unchecked[0] + " $refs");
      break;
    case 2:
      form.refs.label.text("Follow all $refs");
  }
}

/**
 * Sets the "validate" label, based on which options are selected
 */
function setValidateLabel () {
  let values = getCheckedAndUnchecked(form.validate.schema, form.validate.spec);

  switch (values.checked.length) {
    case 0:
      form.validate.label.text("Don't validate anything");
      break;
    case 1:
      form.validate.label.text("Don't validate Swagger " + values.unchecked[0]);
      break;
    case 2:
      form.validate.label.text("Validate everything");
  }
}

/**
 * Updates the UI to match the specified method name
 *
 * @param {string} methodName - The method name (e.g. "validate", "dereference", etc.)
 */
function setSelectedMethod (methodName) {
  form.method.button.val(methodName.toLowerCase());

  methodName = methodName[0].toUpperCase() + methodName.substr(1);
  form.method.button.text(methodName + " it!");
  form.tabs.url.text(methodName + " a URL");
  form.tabs.text.text(methodName + " Text");
}

/**
 * Tracks changes to a checkbox option
 *
 * @param {jQuery} checkbox - Checkbox that we're tracking changes for
 */
function trackCheckbox (checkbox) {
  checkbox.on("change", () => {
    let value = checkbox.is(":checked") ? 1 : 0;
    analytics.trackEvent("options", "changed", checkbox.attr("name"), value);
  });
}

/**
 * Tracks changes to the "Validate!" button
 *
 * @param {string} methodName - The method name (e.g. "validate", "dereference", etc.)
 */
function trackButtonLabel (methodName) {
  let value = ["", "parse", "resolve", "bundle", "dereference", "validate"].indexOf(methodName);
  analytics.trackEvent("options", "changed", "method", value);
}

/**
 * Examines the given checkboxes, and returns arrays of checked and unchecked values.
 *
 * @param {...jQuery} _checkboxes                         - Checkboxes we're checking
 * @returns {{checked: string[], unchecked: string[]}}    - Arrays of checked and unchecked values
 */
function getCheckedAndUnchecked (_checkboxes) {
  let checked = [], unchecked = [];
  for (let i = 0; i < arguments.length; i++) {
    let checkbox = arguments[i];
    if (checkbox.is(":checked")) {
      checked.push(checkbox.data("value"));
    }
    else {
      unchecked.push(checkbox.data("value"));
    }
  }
  return { checked, unchecked };
}
