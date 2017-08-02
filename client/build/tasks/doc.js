var clean = require("gulp-clean");
// var readJsdoc = require("./custom_plugins/read_jsdoc.js");
 readJsdoc = require("./read_jsdoc");
var gulp = require("gulp");
var rename = require("gulp-rename");
 
gulp.task("cleandoc", function() {
    return gulp.src(["doc/*"])
        .pipe(clean());
});
 
gulp.task("builddoc", ["cleandoc"], function() {
    gulp.src(["src/lib/sprite.ts"])
        .pipe(readJsdoc())
        .pipe(rename({
            extname: ".json",
        }))
        .pipe(gulp.dest("doc/"));
});
 
gulp.task("doc", ["cleandoc", "builddoc"]);
