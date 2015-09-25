var form = require('./form');

/**
 * Adds all the drop-down menu functionality
 */
exports.init = function() {
  // Update each dropdown's label when its value(s) change
  onChange(form.allow.menu, setAllowLabel);
  onChange(form.refs.menu, setRefsLabel);
  onChange(form.validate.menu, setValidateLabel);
  onChange(form.cache.menu, setCacheLabel);

  // Change the button text whenever a new method is selected
  setButtonLabel(form.method.button.val());
  form.method.menu.find('a').on('click', function(event) {
    setButtonLabel($(this).data('value'));
    form.method.menu.dropdown('toggle');
    event.stopPropagation();
  });
};

/**
 * Calls the given function whenever the user selects (or deselects)
 * a value in the given drop-down menu.
 *
 * @param {jQuery} menu
 * @param {function} setLabel
 */
function onChange(menu, setLabel) {
  // Don't auto-close the menu when items are clicked
  menu.find('a').on('click', function(event) {
    event.stopPropagation();
  });

  // Set the label immediately, and again whenever the menu is closed
  setLabel();
  menu.parent('.dropdown').on('hidden.bs.dropdown', setLabel);
}

/**
 * Sets the "allow" label, based on which options are selected
 */
function setAllowLabel() {
  var values = getCheckedAndUnchecked(
    form.allow.json, form.allow.yaml, form.allow.empty, form.allow.unknown);

  switch (values.checked.length) {
    case 0:
      form.allow.label.text('No file types allowed');
      break;
    case 1:
      form.allow.label.text('Only allow ' + values.checked[0] + ' files');
      break;
    case 2:
      form.allow.label.text('Allow ' + values.checked[0] + ' and ' + values.checked[1]);
      break;
    case 3:
      form.allow.label.text('Don\'t allow ' + values.unchecked[0] + ' files');
      break;
    case 4:
      form.allow.label.text('Allow all file types');
  }
}

/**
 * Sets the "refs" label, based on which options are selected
 */
function setRefsLabel() {
  var values = getCheckedAndUnchecked(form.refs.internal, form.refs.external, form.refs.circular);

  switch (values.checked.length) {
    case 0:
      form.refs.label.text('No $refs allowed');
      break;
    case 1:
      form.refs.label.text('Only follow ' + values.checked[0] + ' $refs');
      break;
    case 2:
      form.refs.label.text('Don\'t follow ' + values.unchecked[0] + ' $refs');
      break;
    case 3:
      form.refs.label.text('Follow all $refs');
  }
}

/**
 * Sets the "validate" label, based on which options are selected
 */
function setValidateLabel() {
  var values = getCheckedAndUnchecked(form.validate.schema, form.validate.spec);

  switch (values.checked.length) {
    case 0:
      form.validate.label.text('Don\'t validate anything');
      break;
    case 1:
      form.validate.label.text('Don\'t validate Swagger ' + values.checked[0]);
      break;
    case 2:
      form.validate.label.text('Validate everything');
  }
}

/**
 * Sets the "cache" label, based on which values are entered
 */
function setCacheLabel() {
  var http = form.cache.parse(form.cache.http.val());
  var https = form.cache.parse(form.cache.https.val());

  if (http === https) {
    if (http % 60) {
      form.cache.label.text('Cache for ' + http + ' seconds');
    }
    else {
      form.cache.label.text('Cache for ' + (http / 60) + ' minutes');
    }
  }
  else {
    form.cache.label.text('Customized caching');
  }
}

/**
 * Sets the "Validate!" button's text and value
 *
 * @param {string} methodName - The method name (e.g. "validate", "dereference", etc.)
 */
function setButtonLabel(methodName) {
  form.method.button.val(methodName.toLowerCase());
  form.method.button.text(methodName[0].toUpperCase() + methodName.substr(1) + ' it!');
}

/**
 * Examines the given checkboxes, and returns arrays of checked and unchecked values.
 *
 * @param {...jQuery} checkboxes
 * @returns {{checked: string[], unchecked: string[]}}
 */
function getCheckedAndUnchecked(checkboxes) {
  var checked = [], unchecked = [];
  for (var i = 0; i < arguments.length; i++) {
    var checkbox = arguments[i];
    if (checkbox.is(':checked')) {
      checked.push(checkbox.data('value'));
    }
    else {
      unchecked.push(checkbox.data('value'));
    }
  }
  return {checked: checked, unchecked: unchecked};
}
