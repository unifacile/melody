var Piper = function (executor) {
    var Pipeline = require('./pipeline');
    var pipeline = new Pipeline(executor);
    var self = this;
    /**
     *
     * @param data Array of files
     * @param file Filename destination
     * @returns {Piper}
     */
    self.add = function (data, file) {
        pipeline.add(data, file);
        return self;
    };

    self.compass = function (config) {
        return pipeline.run(executor.compass(config));
    };

    self.style = function (config) {
        return pipeline.run(executor.style(config));
    };

    self.script = function (config) {
        return pipeline.run(executor.script(config));
    };

    self.copy = function (config) {
        return pipeline.run(executor.copy(config));
    };
};

module.exports = Piper;