var debug = location.hostname === 'localhost';

/**
 * Initializes Google Analytics and sends a "pageview" hit
 */
exports.init = function() {
  if (!debug) {
    ga('create', 'UA-68102273-1', 'auto');
    ga('send', 'pageview');
  }
}

/**
 * Tracks an event in Google Analytics
 *
 * @param {string} category - the object type (e.g. "button", "menu", "link", etc.)
 * @param {string} action - the action (e.g. "click", "show", "hide", etc.)
 * @param {string} [label] - label for categorization
 * @param {number} [value] - numeric value, such as a counter
 */
exports.trackEvent = function(category, action, label, value) {
  if (debug) {
    console.log('Reporting an event to Google Analytics: ', category, action, label, value);
  }
  else {
    ga('send', 'event', category, action, label, value);
  }
};

/**
 * Tracks an error in Google Analytics
 *
 * @param {Error} err
 */
exports.trackError = function(err) {
  if (debug) {
    console.error('Reporting an error to Google Analytics: ', err);
  }
  else {
    ga('send', 'exception', {exDescription: err.message});
  }
};
