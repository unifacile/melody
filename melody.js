// TODO: scrivere documentazione
module.exports = function (configuration) {
    const plugins = require('gulp-load-plugins')();
    const gulp = require('gulp');
    const executor = require('./classes/executor')(gulp, plugins);
    const _ = require('lodash');
    var Player = require('./classes/player');

    if(!configuration){
        configuration = {};
    }
    var defaultConfigs = {
        resourcePath: 'app/Resources/',
        production: !!plugins.util.env.production,
        sourceMaps: !plugins.util.env.production,
        revManifestPath: 'app/Resources/assets/rev-manifest.json',
        publicPath:'web/',
        bowerPath:'vendor/bower_components/',
        cssPath:'assets/css/',
        jsPath:'assets/js/',
        compassSassFolder:false
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

    /**
     * Configurazione
     *
     * N.B. è una funzione e non un oggetto cosi da poter riutilizzare
     * da subito i valori definiti
     */
    /*
    var config = new function () {
        this.resourcePath = 'app/Resources';
        this.path = {
            public: 'web',
            css: 'assets/css/',
            javascript: 'assets/js/',
            backendAssets: this.resourcePath + '/ui-backend/assets',
            frontendAssets: this.resourcePath + '/ui-alpha/assets',
            bower: 'vendor/bower_components',
            coreBundleResources: 'src/Unifacile/CoreBundle/Resources'
        };
        this.sass = {
            pattern: 'sass/**'+'/*.scss',
            frontendSrc: this.resourcePath + '/ui-alpha/assets/sass',
            backendSrc: this.resourcePath + '/ui-backend/assets/sass',
            dependecies: ['sass-globbing']
        };
        this.js = {
            pattern: 'js/**'+'/*.js'
        };
        this.production = !!plugins.util.env.production;
        this.sourceMaps = !plugins.util.env.production;
        this.revManifestPath = this.resourcePath + '/assets/rev-manifest.json';
    };

    // Aggiorna configurazione con i valori passati per parametro
    if (typeof configParams !== 'undefined') {
        if (configParams.hasOwnProperty('backendAssets') && configParams.backendAssets !== 'undefined') {
            config.path.backendAssets = config.resourcePath + configParams.backendAssets;
        }
        if (configParams.hasOwnProperty('frontendAssets') && configParams.frontendAssets !== 'undefined') {
            config.path.frontendAssets = config.resourcePath + configParams.frontendAssets;
        }
        if (configParams.hasOwnProperty('bower') && configParams.bower !== 'undefined') {
            config.path.bower = configParams.bower;
        }
    }
    */


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

        if(wrongKeys.length>0){
            throw "Some evironment's variable is not corretc: " + wrongKeys.join(", ");
        }
        environments[envName] = data;
    }

    return {
        env: addEnvironment,
        compose: addGulpTask,
        config: config
    };
};