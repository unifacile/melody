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
        .resource('script1.ts')
        .resource('script2.ts')
        .record('main.js')
        .typescript();
});
