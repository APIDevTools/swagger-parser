'use strict';

var gulp         = require('gulp'),
    sourcemaps   = require('gulp-sourcemaps'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    browserify   = require('browserify'),
    prompt       = require('gulp-prompt'),
    util         = require('util'),
    ChildProcess = require('child_process');


// Top-level tasks
gulp.task('default', ['build']);
gulp.task('build', ['browserify', 'uglify']);
gulp.task('bump', ['prompt-and-bump']);


/**
 * Builds the following files:
 *  - dist/swagger-parser.js
 *  - dist/swagger-parser.js.map
 */
gulp.task('browserify', function() {
    return getBrowserifyStream()
        .pipe(sourcemaps.write('./', {sourceRoot: '../'}))
        .pipe(gulp.dest('./dist/'));
});


/**
 * Builds the following files:
 *  - dist/swagger-parser.min.js
 *  - dist/swagger-parser.min.js.map
 */
gulp.task('uglify', function() {
    return getBrowserifyStream()
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./', {sourceRoot: '../'}))
        .pipe(gulp.dest('./dist/'));
});


/**
 * Returns the Browserify bundle as a Gulp stream
 */
function getBrowserifyStream() {
    var bundle = browserify({
        entries: ['./lib/index.js'],
        standalone: 'swagger.parser',
        debug: true
    }).bundle();

    // Convert the Browserify bundle to a buffered vinyl stream, so Gulp can work with it
    return bundle
        .pipe(source('swagger-parser.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}));
}


/**
 * Prompts for the type of version bump to do, and then runs "npm version" accordingly.
 */
gulp.task('prompt-and-bump', function(done) {
    var pkg = require('./package.json');
    var version = pkg.version.match(/(\d+)\.(\d+)\.(\d+)/);
    var major = util.format('%d.%d.%d', parseInt(version[1]) + 1, version[2], version[3]);
    var minor = util.format('%d.%d.%d', version[1], parseInt(version[2]) + 1, version[3]);
    var patch = util.format('%d.%d.%d', version[1], version[2], parseInt(version[3]) + 1);

    console.log('\n%s is currently on version %s', pkg.name, pkg.version);
    gulp.src('package.json')
        .pipe(prompt.prompt({
                type: 'list',
                name: 'bump',
                message: 'How would you like to bump it?',
                default: 'patch',
                choices: [
                    {value: 'patch', name: 'patch (' + patch + ')'},
                    {value: 'minor', name: 'minor (' + minor + ')'},
                    {value: 'major', name: 'major (' + major + ')'}
                ]
            },
            function(answer) {
                ChildProcess.exec('npm version ' + answer.bump, function(err, stdout, stderr) {
                    console.log(stdout);
                    if (err) {
                        console.error(stderr);
                        process.exit(1);
                    }
                });
            }
        ));
});

