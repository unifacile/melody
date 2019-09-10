module.exports = {
    createPattern: function(path, extension) {
        if (extension) {
            if (path.charAt(path.length - 1) !== '/') {
                path += '/';
            }
            return path + '**/*.' + extension;
        } else {
            return path;
        }
    }
};
