const melody = require('../../melody')({
    cssPath:'css/',
    resourcePath:'./',
    publicPath:'./',
    revManifest:false,
    debug:true
});

// run just  `gulp` in terminal
melody.compose('default',function(play){
    return play
        .resource('test.scss')
        .resource('test2.scss')
        .record('full-test.css')
        .style();
});

// run  `gulp demo` in terminal
exports.demo = melody.compose(function(play){
    return play
        .resource('test.scss')
        .resource('test2.scss')
        .record('full-test.css')
        .style();
});
