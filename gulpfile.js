(function(){
  'use strict';

  var gulp = require('gulp')


  /*

  Define Each of the gulp task and any of their dependant tasks
  */
  gulp.task('clean',clean);// clean the project
  gulp.task('jshint', jshint);// hints s the javascript to insure it is well form
  gulp.task('jshintTest',jshintTests);//hints the test file to insure they are well formed
  gulp.task('build-template-cache', ['clean'], buildTemplateCache);// packages the html files in to the templatecache
  gulp.task('build', ['build-template-cache'], build);// concats and uglify the source and define source maps in the ugilfied code
  gulp.task('test', ['build'],unitTests);// execute the unit test
  gulp.task('watch', ['build'],watch);// watches for srce files changes and build the source
  gulp.task('default', ['watch']); // default action
  /*
    Import all dependant modules for use within
  */

  var concat      = require('gulp-concat'),// used to concatinate files
      rename      = require('gulp-rename'),// used to rename files
      jshint      = require('gulp-jshint'),// used to in sure javascript is written to standard and can be uglified
      ngHtml2Js   = require("gulp-ng-html2js"),// used to package angular html fragment into templatecache
      minifyHtml  = require('gulp-minify-html'),// used to minify the html templates
      cssToJs     = require('gulp-css-to-js'),// Used to
      cleanCss    = require('gulp-clean-css'),
      less        = require('gulp-less'),
      base64      = require('gulp-base64'),
      sourcemaps  = require('gulp-sourcemaps'),
      uglify      = require('gulp-uglify'),
      del         = require('del'),
      fs          = require('fs');

  var SRC_DIRECTORY                   = './src/**/*.js',//the directory conatinin the Javascript source
      TEST_SRC_DIRECTORY              = './test/**/*.js',//the directory that contains the javascript test files
      JSHINT_SRC_DIRECTORIES          = [SRC_DIRECTORY],//an array containing all the directtories that require hinting
      TEMP_DIRECTORIES                = ['./temp/*', './dist/*'],//an array of all the directoris that will be deleted during a clean
      CODE_FILES                      = [
                                          './src/*.js',
                                          './src/**/*.js',
                                          './temp/templates/*.js',
                                          './temp/schemas/*.js'
                                        ],// A list of the files that will be packaged into the file distrubution file
      TEST_FILES                      = [
                                         './testmodule/*.js',
                                         './testmodule/**/*.js',
                                         './temp/tests/*.js'
                                        ],
      WATCH_FILES                     = ['src/**/*.*','testmodules/**/*.*'] ,
      /*partial packing */
      TEMPLATE_SRC_DIRECTORY          = ['./src/**/*.html'],
      TEMPLATE_MODULE_NAME            = 'fl.challenge.templateCache',
      TEMPLATE_PREFIX                 = 'flTemplateCache:/',
      TEMPLATE_MODULE_FILE_NAME       = 'flTemplateCache.js',
      TEMP_DIRECTORY                  = './temp/templates',
      DIST_DIRECTORY                  = './dist',
      DIST_FILE                       = 'fl.challenge.js',
      DIST_FILE_MIN                   = 'fl.challenge.min.js',
      PACKAGE_FILE                    = './package.json',
      PACKAGE                         = JSON.parse(fs.readFileSync(PACKAGE_FILE)),
      BOWER_FILE                      = './bower.json',
      BOWER                           = JSON.parse(fs.readFileSync(BOWER_FILE));

    // cleans all temp directories
    function clean(callback){
      return del(TEMP_DIRECTORIES , callback);
    }

    //hint the src
    function jshint(){
      return basehint(JSHINT_SRC_DIRECTORIES,jshint.reporter('default'));
    }

    //hint the tests
    function jshintTests(){
      return basehint([TEST_SRC_DIRECTORY],jshint.reporter('default'));
    }

    // base jshint - for defining custom hints
    function basehint(src,reporter){
      return gulp.src(src)
          .pipe(jshint())
          .pipe(reporter);
    }
    // builds the template cache from the *.html partials
    function buildTemplateCache(){
      return gulp.src(TEMPLATE_SRC_DIRECTORY)
        .pipe(minifyHtml({ empty: true, spare: true, quotes: true }))
        .pipe(ngHtml2Js({
            moduleName: TEMPLATE_MODULE_NAME,
            prefix:TEMPLATE_PREFIX
        }))
        .pipe(concat(TEMPLATE_MODULE_FILE_NAME))
        .pipe(gulp.dest(TEMP_DIRECTORY));
    }


    // builds the source
    function build(){
      return gulp.src(CODE_FILES )
          .pipe(sourcemaps.init())
          .pipe(concat(DIST_FILE))
          .pipe(gulp.dest(DIST_DIRECTORY))
          .pipe(uglify())
          .pipe(rename(DIST_FILE_MIN))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(DIST_DIRECTORY));
    }


    //execute the unit test
    function unitTests(cb){
      var Server = require('karma').Server;
      new Server({
        configFile: __dirname + '/tests/karma-unit.conf.js',
        singleRun: true
      }, function(){cb()}).start();
    }

    function watch(){
        gulp.watch(WATCH_FILES , ['jshint', 'build']);
    }



})();
