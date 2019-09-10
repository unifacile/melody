const gulp = require('gulp');

function vectorSpriteRunner(src, outputDir, config, plugins) {
    return function () {
        return gulp.src(src)
            .pipe(plugins.plumber())
            .pipe(config.debug ? plugins.debug() : plugins.noop())
            .pipe(plugins.svgSprite(config.vectorSprite).on('error', function (e) {
                console.log(e)
            }))
            .pipe(gulp.dest(outputDir));
    }
}

module.exports = vectorSpriteRunner;
