const gulp = require('gulp');

function scriptRunner(src, outputFilename, config, plugins) {
    return function () {
        let promise = gulp.src(src)
            .pipe(plugins.plumber())
            .pipe(config.debug ? plugins.debug() : plugins.noop())
            .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
            .pipe(plugins.concat(config.jsPath + outputFilename))
            .pipe(config.production ? plugins.uglify() : plugins.noop());

        if (config.revManifest) {
            promise = promise.pipe(plugins.rev());
        }

        promise = promise
            .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
            .pipe(gulp.dest(config.publicPath));

        if (config.revManifest) {
            // Write the rev-manifest.json file for gulp-rev
            promise = promise.pipe(plugins.rev.manifest(config.revManifestPath, {
                merge: true
            }));
        }
        promise = promise.pipe(gulp.dest('.'));

        return promise;
    }
}

module.exports = scriptRunner;
