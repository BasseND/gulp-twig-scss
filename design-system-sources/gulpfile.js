// https://github.com/thecodercoder/frontend-boilerplate
/*
|--------------------------------------------------------------------------
| DEPENDENCIES
|--------------------------------------------------------------------------
*/
// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const
    // Gulp utilisation
    gulp = require('gulp'),
    // Combine gulp with sass utilisation
    sass = require('gulp-sass'),
    // Combine multiples plugins
    postcss = require('gulp-postcss'),
    // Parser for scss
    //   scss = require('postcss-scss'),
    // Autoprefix css properties
    autoprefixer = require('autoprefixer'),
    // Clean and minify CSS files
    cssnano = require('cssnano'),
    // Clean and concat JS files
    concat = require('gulp-concat'),
    // Minify JS files
    uglify = require('gulp-uglify'),
    // Generate sourcemaps
    sourcemaps = require('gulp-sourcemaps'),
    // Twig
    twig = require('gulp-twig'),
    // Merge : Permet de faire plusieurs src en une task
    merge = require('merge-stream'),
    // Delete generated files
    del = require('del');
    // EMBED SVG
    embedSvg = require('gulp-embed-svg');

// - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// CONFIGURATION
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
const target = {
    'src': './',
    'buildFolder': '../ds/',
    'buildSite': '../ds/site/',
    'buildStyleguide': '../ds/design-system/'
};

// File paths
const files = {
    twigPath: target.src + 'twig/**/*.twig',
    scssPath: target.src + 'style/**/*.scss',
    jsAppPath: target.src + 'script/app/**/*.js',
    jsPluginPath: target.src + 'script/plugin/**/*.js',
    fontPath: target.src + 'font/**/*.*',
    imgPath: target.src + 'img/**/*.*'
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// TASKS
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Clean task: delete generated files
function clean(){
    return del(target.buildFolder);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// Twig task: compiles the .twig files into .html
// TWIG - Template
// IMPORTANT : Le twig doit être appelé en 1er
// IMPORTANT : Le *.html sert à prendre que les .html à la racine
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function twigSite(){
    return src(target.src + 'twig/site/page/*.twig')
        .pipe(twig())
        .pipe(dest(target.buildSite));
}

function twigStyleguide(){
    return src(target.src + 'twig/styleguide/page/*.twig')
        .pipe(twig())
        .pipe(embedSvg({
            selectors: '.inline-svg',
            root: target.src + 'img/styleguide/'
        }))
        .pipe(dest(target.buildStyleguide));
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// SCSS GENERATION
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function style(){
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(postcss([
            autoprefixer() //,
            // cssnano()
        ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current targetectory
        .pipe(dest(target.buildSite + 'style'))
        .pipe(dest(target.buildStyleguide + 'style')); // put final CSS in dist folder
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// JS APP task: concatenates and uglifies JS files to app.js
// * jquery-open + jquery-close : Fix le bug jQuery dans Drupal
// * jquery-open.js ouvre jQuery
// * jquery-close.js ouvre jQuery
//
// * Le fichier app.js init le fichier généré core.js
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function scriptApp(){
    return src([
            //
            // OPEN
            target.src + 'script/app/jquery/jquery-open.js',
            //
            // Appeler tous les autres scripts ici
            target.src + 'script/app/header-sticky.js',
            target.src + 'script/app/overflow.js',
            target.src + 'script/app/float-label.js',
            target.src + 'script/app/popover.js',
            target.src + 'script/app/a11y-config.js',
            //
            // init des scripts du dessus
            target.src + 'script/app/app.js',
            //
            // Close
            target.src + 'script/app/jquery/jquery-close.js'
        ])
        .pipe(concat('app.js'))
        // .pipe(uglify())
        .pipe(dest(target.buildSite + 'script'))
        .pipe(dest(target.buildStyleguide + 'script'));
}

// JS PLUGIN task: concatenates and uglifies JS files to plugin.js
function scriptPlugin(){
    return src([
            //
            // OPEN
            target.src + 'script/app/jquery/jquery-open.js',
            //
            // Appeler tous les autres scripts ici
            target.src + 'script/plugin/jquery-ui/datepicker.js',
            target.src + 'script/plugin/a11y/datepicker.js',
            //
            // CLOSE
            target.src + 'script/app/jquery/jquery-close.js'
        ])
        .pipe(concat('plugin.js'))
        // .pipe(uglify())
        .pipe(dest(target.buildSite + 'script'))
        .pipe(dest(target.buildStyleguide + 'script'));
}

// Assets task: copy JS, fonts and imgs
function assets(){
    const assetsJs = src([
            target.src + 'script/plugin/modernizr/modernizr.js',
            target.src + 'script/plugin/detectizr/detectizr.js',
            target.src + 'script/plugin/jquery/jquery-3-3-1.js',
            target.src + 'script/plugin/bootstrap/bootstrap.bundle.js',
            target.src + 'script/plugin/prism/prism.js'
        ])
        .pipe(dest(target.buildSite + 'script'))
        .pipe(dest(target.buildStyleguide + 'script'));

    const assetsFont = src(target.src + 'font/**/*.*')
        .pipe(dest(target.buildSite + 'font'))
        .pipe(dest(target.buildStyleguide + 'font'));

    const assetsImg = src(target.src + 'img/**/*')
        .pipe(dest(target.buildSite + 'img'))
        .pipe(dest(target.buildStyleguide + 'img'));

    return merge(assetsJs, assetsFont, assetsImg);
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([
            files.twigPath,
            files.scssPath,
            files.jsAppPath,
            files.jsPluginPath,
            files.fontPath,
            files.imgPath
        ],
        parallel(twigSite, twigStyleguide, style, scriptApp, scriptPlugin, assets));
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then watch task
exports.default = series(
    clean,
    parallel(twigSite, twigStyleguide, style, scriptApp, scriptPlugin, assets),
    watchTask
);

exports.build = series(
	clean,
	parallel(twigSite, twigStyleguide, style, scriptApp, scriptPlugin, assets)
);
