module.exports = function (gulp, plugins) {
    var del = require('del');
    return {
        compass: function (srcFiles, outputFilename, config) {
            if (!config.compassSassFolder) {
                throw "The environment variable `compassSassFolder` must be defined";
            }

            // Filtro i CSS perchè non devono essere parsati da compass. Verrà
            // rimosso quando manderemo a cagare compass
            const filter = plugins.filter(['**', '!**/*.css'], {restore: true});
            // TODO: remove gulp-compass ASAP and use gulp-sass instead
            var promise = gulp.src(srcFiles)
                .pipe(plugins.plumber())
                .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
                .pipe(config.debug ? plugins.debug() : plugins.util.noop())
                .pipe(filter)
                .pipe(plugins.compass({
                    require: ['sass-globbing'],
                    sass: config.compassSassFolder
                }))
                .pipe(filter.restore)
                .pipe(plugins.concat(config.cssPath + outputFilename))
                .pipe(config.production ? plugins.minifyCss() : plugins.util.noop());

            if (config.revManifest) {
                promise = promise.pipe(plugins.rev());
            }

            promise = promise
                .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
                .pipe(gulp.dest(config.publicPath))
                .on('end', function () {
                    // Necessario fino a quando non togliamo compass
                    del.sync('css')
                });

            if (config.revManifest) {
                // Write the rev-manifest.json file for gulp-rev
                promise = promise.pipe(plugins.rev.manifest(config.revManifestPath, {
                    merge: true
                }));
            }

            promise = promise.pipe(gulp.dest('.'));

            return promise;
        },
        style: function (src, outputFilename, config) {
            var promise = gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(config.debug ? plugins.debug() : plugins.util.noop())
                .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
                .pipe(plugins.sassGlob())
                .pipe(plugins.sass())
                .pipe(plugins.autoprefixer())
                .pipe(plugins.concat(config.cssPath + outputFilename))
                .pipe(config.production ? plugins.minifyCss() : plugins.util.noop());

            if (config.revManifest) {
                promise = promise.pipe(plugins.rev());
            }

            promise = promise
                .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
                .pipe(gulp.dest(config.publicPath));

            if (config.revManifest) {
                promise = promise.pipe(plugins.rev.manifest(config.revManifestPath, {
                    merge: true
                }));
            }

            promise = promise.pipe(gulp.dest('.'));

            return promise;
        },
        script: function (src, outputFilename, config) {
            var promise = gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(config.debug ? plugins.debug() : plugins.util.noop())
                .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
                .pipe(plugins.concat(config.jsPath + outputFilename))
                .pipe(config.production ? plugins.uglify() : plugins.util.noop());

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
        },
        svgSprite: function(src, outputDir, config) {
            return gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(config.debug ? plugins.debug() : plugins.util.noop())
                .pipe(plugins.svgSprite(config.svgSprite).on('error',function(e){console.log(e)}))
                .pipe(gulp.dest(outputDir));
        },
        copy: function (srcFiles, outputDir, config) {
            return gulp.src(srcFiles)
                .pipe(config.debug ? plugins.debug() : plugins.util.noop())
                .pipe(gulp.dest(outputDir));
        }
    };
};