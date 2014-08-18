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

var log = $.util.log
var red = $.util.colors.red

var CFG = require('./config');
var TMP = CFG.tmp
var APP = CFG.app
var WEB = CFG.web
var DIST = CFG.dist
var ROOT = CFG.root
var BUILD = CFG.build

gulp.task('dist', ['clean'], function(cb){
  runSequence('build', 'dist:copy', 'dist:min', cb)
})

gulp.task('dist:copy', function(){
  return gulp.src('.tmp/build/web/**/*.{html,js,dart,map,jpg,jpeg,png,svg}', {dot:true})
  .pipe(gulp.dest(DIST))
  .pipe($.size({title: 'dist:copy'}))
})

// TODO: add comments
gulp.task('dist:min', function(){
    // return gulp.src('build/web/**/*.{html,css,js,map}', {dot:true})
  return gulp.src([
    '.tmp/build/web/**/*.{html,css,js,map}',
    '!.tmp/build/web/**/*.precompiled.js',
    '!.tmp/build/web/{packages,*/packages}/**'], {dot:true})
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        '.tmp/build/web/index.html',
        '.tmp/build/web/click_counter/index.html',
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
    .pipe(gulp.dest(DIST))
    .pipe($.size({title: 'minify'}))
})

