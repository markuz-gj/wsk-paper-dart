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
// var exec = require('child_process').exec

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var log = $.util.log;
var cyan = $.util.colors.cyan;

// Watch Files For Changes & reload

function assets (reload) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  gulp.watch([
    'app/**/*.{jade,html}',
    '!app/{packages,*/packages}/**'], ['assets:jade/html', reload]);

  gulp.watch([
    'app/**/*.{scss,css}',
    '!app/{packages,*/packages}/**'], ['assets:scss/css', reload]);

  gulp.watch([
    'app/**/*.{dart,js}',
    '!app/{packages,*/packages}/**'], reload);
}

function build (reload){
  log("Starting '"+ cyan('watch:build') +"'...")

  gulp.watch([
    'app/**/*.{jade,html}',
    '!app/{packages,*/packages}/**'], function(){
      runSequence('build', reload);
    })

  gulp.watch([
    'app/**/*.{scss,css}',
    '!app/{packages,*/packages}/**'], function(){
      runSequence('build', reload);
    })

  gulp.watch([
    'app/**/*.{dart,js}',
    '!app/{packages,*/packages}/**'], function(){
      runSequence('build', reload);
    })

}

function dist (reload){
  log("Starting '"+ cyan('watch:dist') +"'...")

  gulp.watch([
    'app/**/*.{jade,html}',
    '!app/{packages,*/packages}/**'], function(){
      runSequence('build', 'dist:copy', 'dist:min', reload);
    })

  gulp.watch([
    'app/**/*.{scss,css}',
    '!app/{packages,*/packages}/**'], function(){
      runSequence('build', 'dist:copy', 'dist:min', reload);
    })

  gulp.watch([
    'app/**/*.{dart,js}',
    '!app/{packages,*/packages}/**'], function(){
      runSequence('build', 'dist:copy', 'dist:min', reload);
    })

}

module.exports = {
  assets: assets,
  build: build,
  dist: dist
}

