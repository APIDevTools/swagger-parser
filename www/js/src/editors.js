'use strict';

var form = require('./form'),
    ono = require('ono'),
    ACE_THEME = 'ace/theme/terminal';

/**
 * Initializes the ACE text editors
 */
exports.init = function () {
  this.sampleAPI = form.sampleAPI = ace.edit('sample-api');
  form.sampleAPI.setTheme(ACE_THEME);
  var session = form.sampleAPI.getSession();
  session.setMode('ace/mode/yaml');
  session.setTabSize(2);

  this.results = $('#results');
  this.tabs = this.results.find('.nav-tabs');
  this.panes = this.results.find('.tab-content');
};

/**
 * Removes all results tabs and editors
 */
exports.clearResults = function () {
  this.results.removeClass('error animated').addClass('hidden');
  this.tabs.children().remove();
  this.panes.children().remove();
};

/**
 * Displays a successful result
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
exports.showResult = function (title, content) {
  this.results.removeClass('hidden');
  this.addResult(title || 'Sample API', content);
  showResults();
};

/**
 * Displays an error result
 *
 * @param {Error} err
 */
exports.showError = function (err) {
  this.results.removeClass('hidden').addClass('error');
  this.addResult('Error!', err);
  showResults();
};

/**
 * Adds a results tab with an Ace Editor containing the given content
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
exports.addResult = function (title, content) {
  var index = this.tabs.children().length;
  var titleId = 'results-tab-' + index + '-title';
  var editorId = 'results-' + index;
  var active = index === 0 ? 'active' : '';

  // Add a tab and pane
  this.tabs.append(
    '<li id="results-tab-' + index + '" class="' + active + '" role="presentation">' +
    ' <a id="' + titleId + '" href="#results-pane-' + index + '" role="tab" aria-controls="results-pane-' + index + '" data-toggle="tab"></a>' +
    '</li>'
  );
  this.panes.append(
    '<div id="results-pane-' + index + '" class="tab-pane ' + active + '" role="tabpanel">' +
    '  <pre id="' + editorId + '" class="editor"></pre>' +
    '</div>'
  );

  // Set the tab title
  var shortTitle = getShortTitle(title);
  this.tabs.find('#' + titleId).text(shortTitle).attr('title', title);

  // Set the <pre> content
  content = toText(content);
  this.panes.find('#' + editorId).text(content.text);

  // Turn the <pre> into an Ace Editor
  var editor = ace.edit(editorId);
  editor.setTheme(ACE_THEME);
  editor.session.setOption('useWorker', false);
  content.isJSON && editor.getSession().setMode('ace/mode/json');
  editor.setReadOnly(true);
};

/**
 * Returns a short version of the given title text, to better fit in a tab
 *
 * @param {string} title
 * @returns {string}
 */
function getShortTitle (title) {
  // Get just the file name
  var lastSlash = title.lastIndexOf('/');
  if (lastSlash !== -1) {
    title = title.substr(lastSlash + 1);
  }

  if (title.length > 15) {
    // It's still too long, so, just return the first 10 characters
    title = title.substr(0, 10) + '...';
  }

  return title;
}

/**
 * Ensures that the results are visible, and plays an animation to get the user's attention.
 */
function showResults () {
  var results = exports.results;

  setTimeout(function () {
    results[0].scrollIntoView();
    results.addClass('animated')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        // Remove the "animated" class when the animation ends,
        // so we can replay the animation again next time
        results.removeClass('animated');
      });
  });
}

/**
 * Converts the given object to text.
 * If possible, it is converted to JSON; otherwise, plain text.
 *
 * @param {object} obj
 * @returns {object}
 */
function toText (obj) {
  if (obj instanceof Error) {
    return {
      isJSON: false,
      text: obj.message + '\n\n' + obj.stack
    };
  }
  else {
    try {
      return {
        isJSON: true,
        text: JSON.stringify(obj, null, 2)
      };
    }
    catch (e) {
      return {
        isJSON: false,
        text: 'This API is valid, but it cannot be shown because it contains circular references\n\n' + e.stack
      };
    }
  }
}
