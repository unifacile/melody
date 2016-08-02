var Player = function (executor, config, environments) {
    var self = this;
    var buffer = [];
    var Piper = require('./piper');
    const _ = require('lodash');
    const del = require('del');

    var piper = new Piper(executor);
    var environment = config;

    var jollyPattern = function (path, extension) {
        if (extension) {
            if (path.charAt(path.length - 1) !== '/') {
                path += '/';
            }
            return path + '**/*.' + extension;
        } else {
            return path;
        }
    };

    self.env = function (envName) {
        if (envName === 'default') {
            environment = config;
            return self;
        }
        if (!_.has(environments, envName)) {
            throw "The environment " + envName + " doesn't exist";
        }
        environment = _.defaultsDeep(environments[envName], config);

        return self;
    };

    self.bower = function (path, extension) {
        path = jollyPattern(path, extension);
        buffer.push(environment.bowerPath + path);
        return self;
    };


    self.resource = function (path, extension) {
        path = jollyPattern(path, extension);
        buffer.push(environment.resourcePath + path);
        return self;
    };

    self.asset = function (path, extension) {
        path = jollyPattern(path, extension);
        buffer.push(environment.assetPath + path);
        return self;
    };


    self.public = function (path, extension) {
        path = jollyPattern(path, extension);
        buffer.push(environment.publicPath + path);
        return self;
    };

    self.add = function (path, extension) {
        path = jollyPattern(path, extension);
        buffer.push(path);
        return self;
    };

    self.record = function (destination) {
        piper.add(buffer, destination, environment);
        buffer = [];
        return self;
    };

    self.compass = function () {
        return piper.compass();
    };
    
    self.style = function () {
        return piper.style();
    };

    self.script = function () {
        return piper.script();
    };
    
    self.svgSprite = function () {
        return piper.svgSprite()
    };

    self.copy = function () {
        return piper.copy();
    };

    self.del = function (path, extension) {
        path = jollyPattern(path, extension);
        del.sync(path);
    };
};

module.exports = Player;