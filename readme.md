# Melody for gulp

Melody provides a clean, fluent API for defining basic Gulp tasks for your Symfony application

## what is it?
Melody is a gulp wrap that makes gulp even more easy to use.
It designed for fit a Symfony framework infrastructure but can be used in every project.

## Installation
Before to use melody you need to install __Gulp__ globally.
```
npm install -g gulp
```
Probably your system will ask you the admin permission (so you have to run `sudo npm install -g gulp`)

Then install __melody__ in your project:
 ```
 npm install melody-gulp
 ```
 
## Usage
 Create your classic gulp file and use the melody library in this way:
_gulpfile.js_ 
```js
 var melody = require('melody-gulp')();
 
 melody.compose('default',function(play){
    return play
            .resource('assets/sass/homepage.sass')
            .resource('assets/sass/contacts.sass')
            .resource('assets/sass/links.sass')
            .record('pages.css')
            .style();
 });
```

## Configuration reference
Is possible to override the default configuration in this way:
```js
 var melody = require('melody-gulp')({
    cssPath:'css/'
 });
```

This is the default configuration:
```js
 {
     resourcePath: 'app/Resources/',
     production: !!plugins.util.env.production,
     sourceMaps: !plugins.util.env.production,
     revManifestPath: 'app/Resources/assets/rev-manifest.json',
     publicPath:'web/',
     bowerPath:'vendor/bower_components/',
     assetPath:'app/Resources/assets/',
     cssPath:'assets/css/',
     jsPath:'assets/js/',
     compassSassFolder:false,
     revManifest: true
 };
```

### Override global configurations - environments
```js
var melody = require('melody-gulp')({
    cssPath:'css/'
});
 
melody.env('frontend',{
     cssPath:'frontend/css/'
 });
 
melody.compose('default',function(play){
return play
        .resource('assets/sass/homepage.sass')
        .resource('assets/sass/contacts.sass')
        .resource('assets/sass/links.sass')
        .record('pages.css')
        .style();
});

melody.compose('styles-frontend',function(play){
 return play
         .env('frontend')
         .resource('assets/sass/homepage.sass')
         .resource('assets/sass/contacts.sass')
         .resource('assets/sass/links.sass')
         .record('pages.css')
         .style();
});

/**
 * Watch for SCSS change
 */
gulp.task('watch', function () {
    gulp.watch(melody.envConfig('frontend','cssPath') + '/**/*.scss', ['styles-frontend']);
});


```