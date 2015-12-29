// Mocha configuration
(function() {
  'use strict';

  if (userAgent.isBrowser) {
    mocha.setup('bdd');
    mocha.fullTrace();
    mocha.asyncOnly();
    mocha.checkLeaks();
    mocha.globals(['$0', '$1', '$2', '$3', '$4', '$5', 'ga', 'gaplugins', 'gaGlobal']);
  }

  beforeEach(function() {
    // Flag TravisCI and SauceLabs as being very slow environments
    var isSlowEnvironment = userAgent.isTravisCI || userAgent.isKarma;

    // Most of our tests perform multiple AJAX requests,
    // so we need to increase the timeouts to allow for that
    this.currentTest.timeout(isSlowEnvironment ? 10000 : 3000);
    this.currentTest.slow(500);
  });

})();
