(function() {
    'use strict';

    /**
     * @name parser
     * @type {{parse: function, defaults: defaults}}
     */
    module.exports = {
        parse: require('./parse'),
        defaults: require('./defaults')
    };

})();
