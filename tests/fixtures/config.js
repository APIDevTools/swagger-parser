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
    this.currentTest.timeout(2000);
    this.currentTest.slow(100);
  });

})();
