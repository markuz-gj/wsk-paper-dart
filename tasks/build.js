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

var CFG = require('./config');
var ROOT = CFG.root
var TMP = CFG.tmp
var APP = CFG.app
var WEB = CFG.web

var DEST = path.join(TMP, path.basename(WEB))

function tester (vfs) {
  var file = path.relative(ROOT,vfs.path)

  if (file === path.join(APP, 'pubspec.yaml')) return true
  if (file === path.join(APP, 'pubspec.lock')) return true
  if (file === path.join(APP, 'build.dart')) return true

  return false
}

// TODO: add comments
gulp.task('build', function(cb){
  runSequence('assets', 'build:pre', 'build:dart', cb)
})

// Copy All Files At The Dart Root Level (web)
gulp.task('build:pre', function(){
  // TODO: use the TMP and APP vars
  return gulp.src([
    path.join(APP, '**/*.{js,dart,map,jpg,jpeg,png,svg}'),
    path.join(TMP, path.basename(APP), '**/*.{html,css,js,map}'),
    path.join(APP, 'pubspec.yaml'),
    path.join(APP, 'pubspec.lock'),
    path.join(APP, 'build.dart'),
    path.join('!'+ APP, '{packages,*/packages}/**')], {dot:true})
  .pipe($.if(tester, gulp.dest(TMP), gulp.dest(DEST)))
  .pipe($.size({title: 'build:pre'}))
})

// executing pub build
gulp.task('build:dart', function(cb){
  var cmd = exec('pub build', {cwd: TMP});
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', cb);
})

