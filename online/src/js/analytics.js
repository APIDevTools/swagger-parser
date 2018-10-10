'use strict';

var debug = location.hostname === 'localhost';

module.exports = analytics;

/**
 * Initializes Google Analytics and sends a "pageview" hit
 */
function analytics () {
  if (!debug) {
    if (typeof gtag === 'undefined') {
      console.warn('Google Analytics is not enabled');
    }
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
analytics.trackEvent = function (category, action, label, value) {
  try {
    console.log('Analytics event: ', category, action, label, value);

    if (!debug) {
      gtag('event', action, {
        event_category: category,   // eslint-disable-line camelcase
        event_label: label,         // eslint-disable-line camelcase
        value: value
      });
    }
  }
  catch (error) {
    analytics.trackError(error);
  }
};

/**
 * Tracks an error in Google Analytics
 *
 * @param {Error} err
 */
analytics.trackError = function (err) {
  try {
    console.error('Analytics error: ', err);

    if (!debug) {
      gtag('event', 'exception', {
        name: err.name || 'Error',
        description: err.message,
        stack: err.stack,
      });
    }
  }
  catch (error) {
    console.error(err);
  }
};
