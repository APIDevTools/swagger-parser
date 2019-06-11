"use strict";

let form = require("./form"),
    ono = require("ono"),
    ACE_THEME = "ace/theme/terminal";

module.exports = editors;

/**
 * Initializes the ACE text editors
 */
function editors () {
  editors.textBox = form.textBox = ace.edit("text-box");
  form.textBox.setTheme(ACE_THEME);
  let session = form.textBox.getSession();
  session.setMode("ace/mode/yaml");
  session.setTabSize(2);

  editors.results = $("#results");
  editors.tabs = editors.results.find(".nav-tabs");
  editors.panes = editors.results.find(".tab-content");
}

/**
 * Removes all results tabs and editors
 */
editors.clearResults = function () {
  editors.results.removeClass("error animated").addClass("hidden");
  editors.tabs.children().remove();
  editors.panes.children().remove();
};

/**
 * Displays a successful result
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
editors.showResult = function (title, content) {
  editors.results.removeClass("hidden");
  editors.addResult(title || "Sample API", content);
  showResults();
};

/**
 * Displays an error result
 *
 * @param {Error} err
 */
editors.showError = function (err) {
  editors.results.removeClass("hidden").addClass("error");
  editors.addResult("Error!", err);
  showResults();
};

/**
 * Adds a results tab with an Ace Editor containing the given content
 *
 * @param {string} title - The title of the tab
 * @param {object|string} content - An object that will be displayed as JSON in the editor
 */
editors.addResult = function (title, content) {
  let index = editors.tabs.children().length;
  let titleId = "results-tab-" + index + "-title";
  let editorId = "results-" + index;
  let active = index === 0 ? "active" : "";

  // Add a tab and pane
  editors.tabs.append(
    '<li id="results-tab-' + index + '" class="' + active + '" role="presentation">' +
    ' <a id="' + titleId + '" href="#results-pane-' + index + '" role="tab" aria-controls="results-pane-' + index + '" data-toggle="tab"></a>' +
    "</li>"
  );
  editors.panes.append(
    '<div id="results-pane-' + index + '" class="tab-pane ' + active + '" role="tabpanel">' +
    '  <pre id="' + editorId + '" class="editor"></pre>' +
    "</div>"
  );

  // Set the tab title
  let shortTitle = getShortTitle(title);
  editors.tabs.find("#" + titleId).text(shortTitle).attr("title", title);

  // Set the <pre> content
  content = toText(content);
  editors.panes.find("#" + editorId).text(content.text);

  // Turn the <pre> into an Ace Editor
  let editor = ace.edit(editorId);
  editor.setTheme(ACE_THEME);
  editor.session.setOption("useWorker", false);
  content.isJSON && editor.getSession().setMode("ace/mode/json");
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
  let lastSlash = title.lastIndexOf("/");
  if (lastSlash !== -1) {
    title = title.substr(lastSlash + 1);
  }

  if (title.length > 15) {
    // It's still too long, so, just return the first 10 characters
    title = title.substr(0, 10) + "...";
  }

  return title;
}

/**
 * Ensures that the results are visible, and plays an animation to get the user's attention.
 */
function showResults () {
  let results = editors.results;

  setTimeout(() => {
    results[0].scrollIntoView();
    results.addClass("animated")
      .one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", () => {
        // Remove the "animated" class when the animation ends,
        // so we can replay the animation again next time
        results.removeClass("animated");
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
      text: obj.message + "\n\n" + obj.stack
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
        text: "This API is valid, but it cannot be shown because it contains circular references\n\n" + e.stack
      };
    }
  }
}
