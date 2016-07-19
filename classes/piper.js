var Piper = function (executor) {
    var Pipeline = require('./classes/pipeline');
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
        return pipeline.run(app.compass(config));
    };

    self.style = function (config) {
        return pipeline.run(app.style(config));
    };

    self.script = function (config) {
        return pipeline.run(app.script(config));
    };

    self.copy = function (config) {
        return pipeline.run(app.copy(config));
    };
};

module.exports = Piper;