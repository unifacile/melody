const gulp = require('gulp');
const _ = require('lodash');

function rasterSpriteRunner(src, outputDir, config, plugins) {
    return function () {
        const prefixPath = _.replace(outputDir, config.rasterSpritePrefix, '/');
        config.rasterSpriteOptions.imgPath = prefixPath + '/' + config.rasterSpriteOptions.imgName;

        const spriteData = gulp.src(src)
            .pipe(config.debug ? plugins.debug() : plugins.noop())
            .pipe(plugins.spritesmith(config.rasterSpriteOptions));

        spriteData.img.pipe(gulp.dest(outputDir));
        spriteData.css.pipe(gulp.dest(config.rasterSpriteStylePath));

        return spriteData;
    }
}

module.exports = rasterSpriteRunner;
