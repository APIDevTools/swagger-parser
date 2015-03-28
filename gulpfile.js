'use strict';

var gulp         = require('gulp'),
    sourcemaps   = require('gulp-sourcemaps'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    browserify   = require('browserify');


// Top-level tasks
gulp.task('default', ['build']);
gulp.task('build', ['browserify', 'uglify']);


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
