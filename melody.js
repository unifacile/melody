module.exports = function (configuration) {
    const plugins = require('gulp-load-plugins')({
        rename: {
            'gulp.spritesmith': 'spritesmith',
            'gulp-clean-css': 'cleanCSS',
            'gulp-typescript': 'typescript'
        }
    });
    const gulp    = require('gulp');
    const _       = require('lodash');
    const path    = require('path');
    const mode    = require('gulp-mode')();

    const Composer = require('./classes/composer');

    if (!configuration) {
        configuration = {};
    }
    const isProduction   = mode.production();
    const defaultConfigs = {
        debug: false,
        resourcePath: 'app/Resources/',
        production: isProduction,
        sourceMaps: !isProduction,
        revManifest: true,
        revManifestPath: 'app/Resources/assets/rev-manifest.json',
        publicPath: 'web/',
        bowerPath: 'vendor/bower_components/',
        assetPath: 'app/Resources/assets/',
        cssPath: 'assets/css/',
        jsPath: 'assets/js/',
        compassSassFolder: false,
        vectorSprite: {
            mode: {
                symbol: { // symbol mode to build the SVG
                    render: {
                        css: false, // CSS output option for icon sizing
                        scss: false // SCSS output option for icon sizing
                    },
                    dest: '', // destination folder
                    prefix: '.svg--%s', // BEM-style prefix if styles rendered
                    sprite: 'vector-sprite.svg', //generated sprite name
                    example: true // Build a sample page, please!
                }
            }
        },
        rasterSpriteOptions: {
            imgName: 'raster-sprite.png',
            cssName: '_sprite.scss',
            padding: 10, // Padding between images
            cssTemplate: path.resolve(__dirname, "./template/template.scss.handlebars"), // Handlebars.js template path
            cssHandlebarsHelpers: { // Handlebars.js helpers definition
                half: function (num) {
                    return num / 2;
                }
            }
        },
        rasterSpriteStylePath: "app/Resources/assets", // Where save generated sprite stylesheet (e.g app/Resources/assets/sprite.scss)
        rasterSpritePrefix: 'web/' // Prefix to remove from sprite public path (e.g. web/assets/img/sprite.png -> /assets/img/sprite.png)
    };

    const config       = _.defaultsDeep(configuration, defaultConfigs);
    /**
     *
     * @type {Array}
     *  - env_name:
     *      - resourcePath: ex. app/Resources
     *      - publicPath: Symfony public folder ex. web
     *      - bowerPath: path where bower install deps, ex vendor/bower_components
     *      - cssPath: ex. assets/css/
     *      - jsPath: ex. assets/js/
     */
    const environments = [];

    function addGulpTask(/* name, tasksToExecute, callback */) {
        if (arguments.length === 1) {
            return addTask(arguments[0]);
        }
        const name = arguments[0];
        let callback, dependentTasks;

        if (arguments.length === 2) {
            if (_.isFunction(arguments[1])) {
                callback = arguments[1];
                gulp.task(name, addTask(callback));
            } else {
                dependentTasks = arguments[1];
                gulp.task(name, dependentTasks);
            }
            return;
        }

        if (arguments.length === 3) {
            dependentTasks = arguments[1];
            callback       = arguments[2];

            gulp.task(name, dependentTasks, addTask(callback));

            return;
        }

        throw "Something went wrong during melody composition"
    }

    function addTask(instructions) {
        const composer = new Composer(config, environments, plugins);
        const tasks    = composer.play(instructions);
        return gulp.series.apply(gulp, tasks);
    }


    function addEnvironment(envName, data) {
        const envKeys     = _.keys(data);
        const defaultKeys = _.keys(defaultConfigs);

        const wrongKeys = _.difference(envKeys, defaultKeys);

        if (wrongKeys.length > 0) {
            throw "Some environment variable is not correct: " + wrongKeys.join(", ");
        }
        environments[envName] = data;
    }

    function getEnvinronmentConfiguration(env, key) {
        if (!_.has(environments, env)) {
            throw "The environment " + env + " not exist";
        }
        if (!_.has(environments[env], key)) {
            throw "The property " + key + " not exist in environment " + env;
        }
        return environments[env][key];
    }

    function addWatcher(path, tasks) {
        return gulp.watch(path, tasks);
    }

    return {
        env: addEnvironment,
        envConfig: getEnvinronmentConfiguration,
        watch: addWatcher,
        compose: addGulpTask,
        config: config
    };
};
