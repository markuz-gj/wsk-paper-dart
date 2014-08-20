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
// var exec = require('child_process').execvar
var join = require('path').join

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var log = $.util.log;
var cyan = $.util.colors.cyan;


var CFG = require('./config');
var TMP = CFG.tmp
var APP = CFG.app
var WEB = CFG.web
var DIST = CFG.dist
var ROOT = CFG.root
var BUILD = CFG.build

// Watch Files For Changes & reload
var files = {
  html:[
    join(APP, '**/*.{jade,html}'),
    join('!'+ APP, '{packages,*/packages}/**')
  ],

  css:[
    join(APP, '**/*.{scss,sass,css}'),
    join('!'+ APP, '{packages,*/packages}/**')
  ],

  js:[
    join(APP, '**/*.{dart,js}'),
    join('!'+ APP, '{packages,*/packages}/**')
  ],

  all: [
    join(APP, '**/*.{jade,html}'),
    join(APP, '**/*.{scss,sass,css}'),
    join(APP, '**/*.{dart,js}'),
    join('!'+ APP, '{packages,*/packages}/**')
  ]
}

function assets (reload) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  gulp.watch(files.html, ['assets:jade/html', reload]);
  gulp.watch(files.css, ['assets:scss/css', reload]);
  gulp.watch(files.js, reload);
}

function build (reload){
  log("Starting '"+ cyan('watch:build') +"'...")

  gulp.watch(files.all, function(){
      runSequence('build', reload);
    })
}

function dist (reload){
  log("Starting '"+ cyan('watch:dist') +"'...")

  gulp.watch(files.all, function(){
      runSequence('dist:build', reload);
    })
}

module.exports = {
  assets: assets,
  build: build,
  dist: dist
}

