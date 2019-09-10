const scriptRunner = require('./runner/scriptRunner');
const styleRunner = require('./runner/styleRunner');
const copyRunner = require('./runner/copyRunner');
const rasterSpriteRunner = require('./runner/rasterSpriteRunner');
const vectorSpriteRunner = require('./runner/vectorSpriteRunner');

const { createPattern } = require('./utils');
const _ = require('lodash');

class Composer {
    constructor(config, environments, plugins) {
        this.config        = config;
        this.defaultConfig = config;

        this.environments = environments;
        this.plugins      = plugins;

        this.targets   = [];
        this.sections  = [];
        this.gulpTasks = [];
    }

    play(instructionsCallback) {
        const $this = this;
        instructionsCallback(this);
        return this.gulpTasks.map(function (task) {
            return task.runner(task.section.targets, task.section.destination, task.section.config, $this.plugins)
        });
    }

    env(envName) {
        if (envName === 'default') {
            this.config = this.defaultConfig;
            return this;
        }
        if (!_.has(this.environments, envName)) {
            throw "The environment " + envName + " doesn't exist";
        }
        this.config = _.defaultsDeep(this.environments[envName], this.defaultConfig);
        return this;
    }

    resource(path, extension) {
        path = createPattern(path, extension);
        this.targets.push(this.config.resourcePath + path);
        return this;
    }

    record(destination) {
        this.sections.push({
            destination,
            targets: this.targets,
            config: this.config
        });

        this.targets = [];
        return this;
    }

    _runSectionWith(runner){
        const $this = this;

        this.sections.forEach(function (section) {
            $this.gulpTasks.push({
                runner: runner,
                section: section
            });
        });

        this.sections = [];
        return this;
    }

    script() {
        return this._runSectionWith(scriptRunner);
    }
    style() {
        return this._runSectionWith(styleRunner);
    }
    copy(){
        return this._runSectionWith(copyRunner);
    }
    rasterSprite(){
        return this._runSectionWith(rasterSpriteRunner);
    }
    vectorSprite(){
        return this._runSectionWith(vectorSpriteRunner);
    }
    compass(){
        throw "Compass is not supported anymore";
    }
}

module.exports = Composer;
