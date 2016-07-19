var Player = function (config,environments) {
    var self = this;
    var buffer = [];
    var piper = new Piper();
    var environment = {};

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
        if(!_.has(environments, envName)){
            throw "The environment "+envName+" doesn't exist";
        }
        environment = _.defaultsDeep(environments[env], config);
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
        piper.add(buffer, destination);
        buffer = [];
        return self;
    };

    self.compass = function () {
        return piper.compass(environment);
    };
    self.style = function () {
        //var compassConfig = {};
        //switch (section) {
        //    case Section.BACKEND:
        //        compassConfig = {
        //            sass: config.sass.backendSrc,
        //            require: config.sass.dependecies
        //        };
        //        break;
        //    case Section.FRONTEND:
        //        compassConfig = {
        //            sass: config.sass.frontendSrc,
        //            require: config.sass.dependecies
        //        };
        //        break;
        //    default:
        //        compassConfig = {
        //            sass: config.sass.frontendSrc,
        //            require: config.sass.dependecies
        //        };
        //        break;
        //}
        return piper.style(environment);
    };

    self.script = function () {
        return piper.script(environment);
    };

    self.copy = function () {
        return piper.copy(environment);
    };
};

module.exports = Player;