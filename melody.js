// TODO: scrivere documentazione
module.exports = function (configuration) {
    const plugins = require('gulp-load-plugins')();
    const gulp = require('gulp');
    const executor = require('./classes/executor')(gulp, plugins);
    const _ = require('lodash');
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
        svgSprite: {
            mode: {
                symbol: { // symbol mode to build the SVG
                    render: {
                        css: false, // CSS output option for icon sizing
                        scss: false // SCSS output option for icon sizing
                    },
                    dest: 'sprite', // destination folder
                    prefix: '.svg--%s', // BEM-style prefix if styles rendered
                    sprite: 'sprite.svg', //generated sprite name
                    example: true // Build a sample page, please!
                }
            }
        }
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
                    return callback(player)
                });
            } else {
                dependentTasks = arguments[1];
                gulp.task(name, dependentTasks);
            }
        } else if (arguments.length == 3) {
            dependentTasks = arguments[1];
            callback = arguments[2];

            gulp.task(name, dependentTasks, function () {
                return callback(player);
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