/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';
var exec = require('child_process').exec

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// // TODO: write the equivalent of dart
// // Lint JavaScript
// gulp.task('jshint', function () {
//   return gulp.src('app/scripts/**/*.js')
//     .pipe(reload({stream: true, once: true}))
//     .pipe($.jshint())
//     .pipe($.jshint.reporter('jshint-stylish'))
//     .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
// });

// // Optimize Images
// gulp.task('images', function () {
//   return gulp.src('app/images/**/*')
//     .pipe($.cache($.imagemin({
//       progressive: true,
//       interlaced: true
//     })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe($.size({title: 'images'}));
// });

// // Copy Web Fonts To Dist
// gulp.task('fonts', function () {
//   return gulp.src(['app/fonts/**'])
//     .pipe(gulp.dest('dist/fonts'))
//     .pipe($.size({title: 'fonts'}));
// });

// Copy All Files At The Dart Root Level (web)
gulp.task('prebuild', function(){
  return gulp.src([
    'app/**/*.{html,js,dart,map,jpg,jpeg,png,svg}',
    '.tmp/**/*.{html,css,map}',
    '!app/{packages,*/packages}/**'], {dot:true})
  .pipe(gulp.dest('web'))
  .pipe($.size({title: 'copy:web'}))
})

gulp.task('copy', function(){
  return gulp.src('build/web/**/*.{html,js,dart,map,jpg,jpeg,png,svg}', {dot:true})
  .pipe(gulp.dest('dist'))
  .pipe($.size({title: 'copy:dist'}))
})

// TODO: add comments
gulp.task('minify', function(){
    // return gulp.src('build/web/**/*.{html,css,js,map}', {dot:true})
  return gulp.src([
    'build/web/**/*.{html,css,js,map}',
    '!build/web/{packages,*/packages}/**'], {dot:true})
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'build/web/index.html',
        'build/web/click_counter/index.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: []
    })))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.html', $.htmlmin({
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true,
        removeComments:true,
        // removeAttributeQuotes: true,
        // polymers conditional attributes assign
        customAttrAssign: [new RegExp("\\?=")]

    })))
    // TODO: uglify crashing. RangeError: Maximum call stack size exceeded
    // .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'minify'}))
})

gulp.task('postbuild', function(cb){
  runSequence('copy', 'minify', cb)
})

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'app/**/*.{scss,css}',
      '!app/{packages,*/packages}/**'
    ])
    .pipe($.if('*.scss', $.rubySass({
      style: 'expanded',
      precision: 10
    })
    .on('error', console.error.bind(console))
    ))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'styles'}));
});

// TODO: add comments
gulp.task('jade', function(){
  return gulp.src([
      'app/**/*.{html,jade}',
      '!app/{packages,*/packages}/**'
    ])
    .pipe($.if('*.jade', $.jade({pretty: true})))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'jade'}))
});

// TODO: add comments
gulp.task('assets', function(cb){
  runSequence(['styles', 'jade'], cb)
})

// Clean Output Directory
gulp.task('clean', del.bind(null, ['web', 'build', '.tmp', 'dist']));

// executing pub build
gulp.task('build:dart', function(cb){
  var cmd = exec('pub build');
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', cb);
})

// Watch Files For Changes & Reload
gulp.task('serve', ['assets'], function () {
  browserSync({
    notify: false,
    port: 3001,
    // browser: 'chromium',
    browser: 'skip',
    // forces full page reload on css changes.
    injectChanges: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.tmp', 'app']
    }
  });

  gulp.watch([
    'app/**/*.{jade,html}',
    '!app/{packages,*/packages}/**'], ['jade', reload]);

  gulp.watch([
    'app/**/*.{scss,css}',
    '!app/{packages,*/packages}/**'], ['styles', reload]);

  gulp.watch([
    'app/**/*.{dart,js}',
    '!app/{packages,*/packages}/**'], reload);

});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch([
    'app/**/*.{jade,html}',
    '!app/{packages,*/packages}/**'], ['build', reload]);

  gulp.watch([
    'app/**/*.{scss,css}',
    '!app/{packages,*/packages}/**'], ['build', reload]);

  gulp.watch([
    'app/**/*.{dart,js}',
    '!app/{packages,*/packages}/**'], ['build', reload]);

});

// Build and serve the output from the dist build
gulp.task('serve:build', ['default'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: 'build/web'
    }
  });
});

// TODO: add comments
gulp.task('build', function(cb){
  runSequence('assets', 'prebuild', 'build:dart', 'postbuild', cb)
})

// TODO: add comments
gulp.task('default', ['clean'], function(cb){
  runSequence('build', cb)
})

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}


