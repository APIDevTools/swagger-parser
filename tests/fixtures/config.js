(function() {
  'use strict';

  if (typeof(mocha) === 'object') {
    // Configure Mocha
    mocha.setup('bdd');
    mocha.fullTrace();
    mocha.checkLeaks();
    mocha.globals(['$0', '$1', '$2', '$3', '$4', '$5', 'ga', 'gaplugins', 'gaGlobal']);
  }

  // Set global settings for all tests
  beforeEach(function() {
    // Most of our tests perform multiple AJAX requests,
    // so we need to increase the timeouts to allow for that
    this.currentTest.timeout(2000);
    this.currentTest.slow(500);

    if (global.__karma__) {
      // TravisCI and SauceLabs are VERY slow, so we need to increase the test timeout
      this.currentTest.timeout(10000);
    }
  });

})();
