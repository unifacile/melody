const gulp = require('gulp');

function copyRunner(src, outputDir, config, plugins) {
    return function () {
        return gulp.src(src)
            .pipe(config.debug ? plugins.debug() : plugins.noop())
            .pipe(gulp.dest(outputDir));
    }
}

module.exports = copyRunner;
