module.exports = function (gulp, plugins) {
    var del = require('del');
    return {
        compass: function (config) {
            return function (srcFiles, outputFilename) {
                if(!config.compassSassFolder){
                    throw "The environment variable `compassSassFolder` must be defined";
                }

                // Filtro i CSS perchè non devono essere parsati da compass. Verrà 
                // rimosso quando manderemo a cagare compass
                const filter = plugins.filter(['**', '!**/*.css'], {restore: true});
                // TODO: remove gulp-compass ASAP and use gulp-sass instead
                return gulp.src(srcFiles)
                    .pipe(plugins.plumber())
                    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
                    .pipe(plugins.debug())
                    .pipe(filter)
                    .pipe(plugins.compass({
                        require: ['sass-globbing'],
                        sass: config.compassSassFolder
                    }))
                    .pipe(filter.restore)
                    .pipe(plugins.concat(config.cssPath + outputFilename))
                    .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
                    .pipe(plugins.rev())
                    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
                    .pipe(gulp.dest(config.publicPath))
                    .on('end', function () {
                        // Necessario fino a quando non togliamo compass
                        del.sync('css')
                    })

                    // Write the rev-manifest.json file for gulp-rev
                    .pipe(plugins.rev.manifest(config.revManifestPath, {
                        merge: true
                    }))
                    .pipe(gulp.dest('.'));
            }
        },
        style: function (config) {
            return function (src, outputFilename) {
                return gulp.src(src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
                    .pipe(plugins.sassGlob())
                    .pipe(plugins.sass())
                    .pipe(plugins.autoprefixer())
                    .pipe(plugins.concat(config.cssPath + outputFilename))
                    .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
                    .pipe(plugins.rev())
                    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
                    .pipe(gulp.dest(config.publicPath))
                    .pipe(plugins.rev.manifest(config.revManifestPath, {
                        merge: true
                    }))
                    .pipe(gulp.dest('.'));
            }
        },
        script: function (config) {
            return function (src, outputFilename) {
                return gulp.src(src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
                    .pipe(plugins.concat(config.jsPath + outputFilename))
                    .pipe(config.production ? plugins.uglify() : plugins.util.noop())
                    .pipe(plugins.rev())
                    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
                    .pipe(gulp.dest(config.publicPath))

                    // Write the rev-manifest.json file for gulp-rev
                    .pipe(plugins.rev.manifest(config.revManifestPath, {
                        merge: true
                    }))
                    .pipe(gulp.dest('.'));
            }
        },
        copy: function (config) {
            return function (srcFiles, outputDir) {
                return gulp.src(srcFiles)
                    .pipe(gulp.dest(outputDir));
            }
        }
    };
};