var clean = require("gulp-clean");
var readMyComments = require("gulp-read-my-comments");
var gulp = require("gulp");
var rename = require("gulp-rename");
 
gulp.task("cleandoc", function() {
    return gulp.src(["doc/test/*"])
        .pipe(clean());
});
 
gulp.task("builddoc", ["cleandoc"], function() {
    gulp.src(["src/lib/sprite.ts"])
        .pipe(readMyComments())
        .pipe(rename({
            extname: ".json",
        }))
        .pipe(gulp.dest("doc/test/"));
});
 
gulp.task("doc", ["cleandoc", "builddoc"]);
