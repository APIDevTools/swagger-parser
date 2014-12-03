(function() {
  'use strict';

  /**
   * @name swagger.parser
   * @type {{parse: (parse), defaults: swagger.parser.defaults}}
   */
  module.exports = {
    parse: require('./lib/parse'),
    defaults: require('./lib/defaults')
  };

})();
