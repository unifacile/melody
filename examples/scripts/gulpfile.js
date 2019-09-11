const melody = require('../../melody')({
    jsPath:'code/',
    resourcePath:'./',
    publicPath:'./',
    revManifest:false,
    debug:true
});

// run just  `gulp` in terminal
melody.compose('default',function(play){
    return play
        .resource('script1.js')
        .resource('script2.js')
        .record('main.js')
        .script();
});

melody.compose('remove',function(play){
    return play
        .add('code','js')
        .record(null)
        .del();
});
