var gulp = require('gulp');
var dest = require('gulp-dest');
var typedoc = require('gulp-typedoc');
var mustache = require('gulp-mustache');
var runSequence = require('run-sequence');
var paths = require('../paths');
 
gulp.task('generate-json-doc', function() {
  return gulp
    .src([paths.api])
    .pipe(typedoc({
      // TypeScript options (see typescript docs) 
      module: "amd",
      target: "es5",
      includeDeclarations: false,

      // Output options (see typedoc docs) 
      //out: paths.doc,
      json: paths.jsonDoc,

      // TypeDoc options (see typedoc docs) 
      name: "name-of-the-app",
      theme: "minimal",
      ignoreCompilerErrors: false,
      version: true,
    }));
});

gulp.task('generate-html-doc', function() {
  return gulp
    .src(paths.mustacheDoc + '*.mustache')
    .pipe(mustache(paths.jsonDoc, {}, {}))
    .pipe(dest(paths.htmlDoc + ':name.html'))
    .pipe(gulp.dest(paths.htmlDoc));
});

gulp.task('doc', function(callback) {
  return runSequence('generate-json-doc', 'generate-html-doc', callback);
});

// todo: add watcher to lib files to auto generate doc on modification
