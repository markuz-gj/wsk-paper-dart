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
var path = require('path')

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

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

var CFG = require('./config');
var TMP = CFG.tmp
var APP = CFG.app
var BUILD = CFG.build
var WEB = CFG.web

var DEST = path.join(TMP, APP)

// Compile and Automatically Prefix Stylesheets
gulp.task('assets:scss/css', function () {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      path.join(APP, '**/*.{scss,css}'),
      path.join('!'+ APP, '{packages,*/packages}/**')
    ])
    .pipe($.if('*.scss', $.rubySass({
      style: 'expanded',
      precision: 10
    })
    .on('error', console.error.bind(console))
    ))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'scss/css'}));
});

// TODO: add comments
gulp.task('assets:jade/html', function(){
  return gulp.src([
      path.join(APP, '**/*.{html,jade}'),
      path.join('!'+ APP, '{packages,*/packages}/**')
    ])
    .pipe($.if('*.jade', $.jade({pretty: true})))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'jade/html'}))
});

// TODO: add comments
gulp.task('assets:copy', function(){
  return gulp.src([
      path.join(APP, 'pubspec.yaml'),
      path.join(APP, 'pubspec.lock'),
      path.join(APP, 'build.dart')

    ])
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'assets:copy'}))
});

// executing pub build
gulp.task('assets:pub', ['assets:copy'], function(cb){
  var cmd = exec('pub get', {cwd: DEST});
  // cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', cb);
})

// TODO: add comments
gulp.task('assets', function(cb){
  runSequence(['assets:scss/css', 'assets:jade/html', 'assets:pub'], cb)
})



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





