const del             = require('del');

function delRunner(src, outputDir, config, plugins) {
    return function () {
        return Promise.all(src.map(function (path) {
            return del.sync(path);
        }))
    }
}

module.exports = delRunner;
