(function() {
  'use strict';

  /**
   * @name parser
   * @type {{parse: (parse), defaults: defaults}}
   */
  module.exports = {
    parse: require('./lib/parse'),
    defaults: require('./lib/defaults')
  };

})();
