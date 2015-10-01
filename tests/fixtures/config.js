(function() {
  'use strict';

  if (typeof(mocha) === 'object') {
    // Configure Mocha
    mocha.setup('bdd');
    mocha.fullTrace();
    mocha.asyncOnly();
    mocha.checkLeaks();
    mocha.globals(['$0', '$1', '$2', '$3', '$4', '$5', 'ga', 'gaplugins', 'gaGlobal']);
  }

  // Set global settings for all tests
  beforeEach(function() {
    // Most of our tests perform multiple AJAX requests,
    // so we need to increase the timeouts to allow for that
    this.currentTest.timeout(slowEnvironment ? 10000 : 2000);
    this.currentTest.slow(500);
  });

})();
