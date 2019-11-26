const gulp = require("gulp");
const nodemon = require("gulp-nodemon");

gulp.task("deploy", (done) => {
    nodemon({
        script: "src/app.ts",
        done,
    });
});