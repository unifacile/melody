var Piper = function () {
    var Pipeline = require('./classes/pipeline');
    var pipeline = new Pipeline(app);
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

    self.compass = function (compassConfig) {
        return pipeline.run(app.compass(compassConfig));
    };

    self.style = function () {
        return pipeline.run(app.style);
    };

    self.script = function () {
        return pipeline.run(app.script);
    };

    self.copy = function () {
        return pipeline.run(app.copy);
    };
};

module.exports = Piper;