var clean = require("gulp-clean");
var readJsdoc = require("./custom_plugins/parse_doc");
var gulp = require("gulp");
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
 
gulp.task("cleandoc", function() {
    return gulp.src(["doc/*"])
        .pipe(clean());
});
 
gulp.task("sprite-doc", function() {
  gulp.src(["src/api/sprite.ts"])
      .pipe(readJsdoc())
      .pipe(rename({
          extname: ".json",
      }))
      .pipe(gulp.dest("assets/doc/"));
});

gulp.task("global-doc", function() {
  gulp.src(["src/api/game.ts", "src/api/sensors.ts", "src/api/utility.ts"])
      .pipe(concat('globals.ts'))
      .pipe(readJsdoc())
      .pipe(rename({
          extname: ".json",
      }))
      .pipe(gulp.dest("assets/doc/"));
});

gulp.task("builddoc", ["cleandoc"], function() {
  return runSequence(
    ['sprite-doc', 'global-doc']
  );
});
 
gulp.task("doc", ["cleandoc", "builddoc"]);
