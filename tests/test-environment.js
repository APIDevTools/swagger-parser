(function() {
    'use strict';

    var env = {
        /**
         * Are we running in Node?
         */
        isNode: typeof(require) === 'function',


        /**
         * Are we running in a browser?
         */
        isBrowser: typeof(require) !== 'function',


        /**
         * The global object (i.e. window or global)
         */
        global: null,


        /**
         * The Swagger-Parser
         * @type {parser}
         */
        parser: null,


        /**
         * Helpers for accessing/testing the YAML and JSON Swagger files.
         */
        files: {
            /**
             * Parsed (but not dereferenced) Swagger files.
             */
            parsed: {},


            /**
             * Parsed and dereferenced Swagger files.
             */
            dereferenced: {},


            /**
             * Returns the relative path of the given test file, based on the current environment.
             */
            getPath: function(fileName) {
                if (env.isNode) {
                    return path.join('tests', 'files', fileName);
                }
                else if (window.location.href.indexOf(env.__dirname) === 0) {
                    // We're running in the "/tests" directory
                    return 'files/' + fileName;
                }
                else {
                    // We're running from a different path, so use the absolute path, but remove the hostname
                    return env.__dirname.replace(/^https?:\/\/[^\/]+(\/.*)/, '$1/files/' + fileName);
                }
            },


            /**
             * Returns the absolute path of the given test file, based on the current environment.
             */
            getAbsolutePath: function(fileName) {
                if (env.isNode) {
                    return url.parse(__dirname + '/files/' + fileName).href; // jshint ignore:line
                }
                else {
                    return env.__dirname + '/files/' + fileName;
                }
            }
        },


        /**
         * Returns a function that calls the given function with the given parameters.
         * This is useful for `expect(fn).to.throw` tests.
         */
        call: function(fn, params) {
            params = _.rest(arguments);
            return function() {
                fn.apply(null, params);
            };
        },


        /**
         * A no-op function
         */
        noop: function() {}
    };


    if (env.isNode) {
        // Set env properties for Node.js
        env.global = global;
        env.parser = require('../index.js');
        env.__filename = __filename;
        env.__dirname = __dirname;

        // Set globals for use in tests
        global.env = env;
        global.expect = require('chai').expect;
        global.sinon = require('sinon');
        global.path = require('path');
        global.url = require('url');
        global._ = require('lodash');
    }
    else {
        // Set env properties for browsers
        env.global = window;
        env.parser = window.swagger.parser;
        env.__filename = document.querySelector('script[src*="test-environment.js"]').src;
        env.__dirname = env.__filename.substr(0, env.__filename.lastIndexOf('/'));

        // Set globals for use in tests
        window.env = env;
        window.expect = window.chai.expect;
        window.require = function() {
        };
    }

})();
