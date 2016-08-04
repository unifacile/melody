// TODO: scrivere documentazione
module.exports = function (configuration) {
    const plugins = require('gulp-load-plugins')({
        rename: {
            'gulp.spritesmith': 'spritesmith'
        }
    });
    const gulp = require('gulp');
    const executor = require('./classes/executor')(gulp, plugins);
    const _ = require('lodash');
    const path = require('path');
    
    var Player = require('./classes/player');

    if (!configuration) {
        configuration = {};
    }
    var defaultConfigs = {
        debug: false,
        resourcePath: 'app/Resources/',
        production: !!plugins.util.env.production,
        sourceMaps: !plugins.util.env.production,
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
            cssTemplate: path.resolve( __dirname, "./template/template.scss.handlebars" ), // Handlebars.js template path
            cssHandlebarsHelpers: { // Handlebars.js helpers definition
                half: function (num) { return num/2;}
            }
        },
        rasterSpriteStylePath: "app/Resources/assets", // Where save generated sprite stylesheet (e.g app/Resources/assets/sprite.scss)
        rasterSpritePrefix: 'web/' // Prefix to remove from sprite public path (e.g. web/assets/img/sprite.png -> /assets/img/sprite.png)
    };

    var config = _.defaultsDeep(configuration, defaultConfigs);
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
    var environments = [];

    function addGulpTask(/* name, tasksToExecute, callback */) {
        var player = new Player(executor, config, environments);
        var name = arguments[0];
        var callback, dependentTasks;

        if (arguments.length == 2) {
            if (_.isFunction(arguments[1])) {
                callback = arguments[1];
                gulp.task(name, function () {
                    var promise = callback(player);
                    if(!promise){
                        promise = player.getLastPromise();
                    }
                    return promise;
                });
            } else {
                dependentTasks = arguments[1];
                gulp.task(name, dependentTasks);
            }
        } else if (arguments.length == 3) {
            dependentTasks = arguments[1];
            callback = arguments[2];

            gulp.task(name, dependentTasks, function () {
                var promise = callback(player);
                if(!promise){
                    promise = player.getLastPromise();
                }
                return promise;
            })
        }
    }

    function addEnvironment(envName, data) {
        var envKeys = _.keys(data);
        var defaultKeys = _.keys(defaultConfigs);

        var wrongKeys = _.difference(envKeys, defaultKeys);

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