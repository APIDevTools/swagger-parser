module.exports = function(config) {
    'use strict';

    var isMac       = /^darwin/.test(process.platform),
        isWindows   = /^win/.test(process.platform),
        isLinux     = !(isMac || isWindows),
        isTravisCI  = process.env.TRAVIS === 'true';

    // Basic Karma configuration
    var cfg = {
        port: 9876,
        browserNoActivityTimeout: 8000,
        colors: true,
        logLevel: config.LOG_INFO,
        frameworks: ['mocha', 'chai', 'sinon'],
        reporters: ['mocha'],

        files: [
            // Swagger-Parser
            'dist/swagger-parser.min.js',
            {pattern: 'dist/swagger-parser.js.map', included: false},

            // Test environment 
            'tests/test-environment.js',
            'tests/files/real-world/file-list.js',
            'tests/files/good/text-resolved.js',
            'tests/files/good/image-resolved.js',
            'tests/files/**/*-resolved.js',
            'tests/files/**/*-dereferenced.js',
            {pattern: 'tests/files/**', included: false},
            
            // Unit tests
            'tests/specs/**/*-spec.js'
        ],

        browsers: (function() {
            // Test on all browsers that are available for the environment
            if (isMac) {
                return ['PhantomJS', 'Firefox', 'Chrome', 'Safari'];
            }
            else if (isWindows) {
                return ['PhantomJS', 'Firefox', 'Chrome', 'Safari', 'IE'];
            }
            else if (isTravisCI) {
                return ['PhantomJS', 'Firefox'];
            }
            else if (isLinux) {
                return ['PhantomJS', 'Firefox', 'Chrome'];
            }
        })()
    };

    if (isTravisCI || isWindows) {
        cfg.exclude = [
            // Travis-CI and IE both choke when trying to parse 100+ very large Swagger files,
            // so skip those files when running on Travis or Windows
            'tests/files/real-world/file-list.js'
        ];
    }

    config.set(cfg);
};
