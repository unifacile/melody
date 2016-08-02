var Piper = function (executor) {
    var Pipeline = require('./pipeline');
    var pipeline = new Pipeline(executor);
    var self = this;
    /**
     *
     * @param data Array of files
     * @param file Filename destination
     * @param environment Local configuration
     * @returns {Piper}
     */
    self.add = function (data, file, environment) {
        pipeline.add(data, file, environment);
        return self;
    };

    self.compass = function () {
        return pipeline.run(executor.compass);
    };

    self.style = function () {
        return pipeline.run(executor.style);
    };

    self.script = function () {
        return pipeline.run(executor.script);
    };

    self.svgSprite = function () {
        return pipeline.run(executor.svgSprite)
    };

    self.copy = function () {
        return pipeline.run(executor.copy);
    };
};

module.exports = Piper;