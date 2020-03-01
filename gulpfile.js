/*global require*/
"use strict";

var gulp = require("gulp"),
  path = require("path"),
  data = require("gulp-data"),
  twig = require("gulp-twig"), // Decided to use twig, because already familiar with it
  prefix = require("gulp-autoprefixer"),
  sass = require("gulp-sass"),
  plumber = require("gulp-plumber"),
  concat = require("gulp-concat"),
  minify = require('gulp-minify'),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync"),
  fs = require("fs");

/*
 * Directories here
 */
var paths = {
  build: "./build/",
  // sass: "./src/scss/",
  cssDS: "./ds-sources/assets/css/",
  // css: "./build/assets/css/",
  data: "./twig/data/",

  sass: {
    input: "./src/scss/",
    output: "./build/assets/css/"
  },

  scripts: {
    input: "./src/js/*",
    output: "./build/assets/js/"
    // polyfills: ".polyfill.js",
  },
  images: {
    input: "./src/assets/images/",
    output: "./build/assets/images/"
  },
  fonts: {
    input: "./src/assets/fonts/",
    output: "./build/assets/fonts/"
  },
  svgs: {
    input: "./src/assets/svg/*.svg",
    output: "./build/assets/svg/"
  }
};

/**
 * Compile .twig files and pass in data from json file
 * matching file name. index.twig - index.twig.json
 */
function gulpTwigTask () {
//   return gulp.src(['./twig/templates/*.twig','./twig/data/head.twig'])
  return gulp.src(['./twig/templates/*.twig'])
    // Stay live and reload on error
	.pipe(plumber({
		handleError: function (err) {
			console.log(err);
			this.emit('end');
		}
	}))
  	// Load template pages json data
    .pipe(data(function (file) {
		return JSON.parse(fs.readFileSync(paths.data + path.basename(file.path) + '.json'));		
	}))
    .pipe(twig())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
	.pipe(gulp.dest(paths.build));
};

/**
 * Recompile .twig files and live reload the browser
 */
//gulp.task('rebuild', ['twig'], function () {
  // BrowserSync Reload
  //browserSync.reload();
//});

gulp.task(
  "rebuild",
  gulp.series(gulpTwigTask, function() {
    // BrowserSync Reload
    browserSync.reload();
  })
);

/**
 * Wait for twig, js and sass tasks, then launch the browser-sync Server
 */

gulp.task(
  "browser-sync",
  gulp.series(
    [
      gulpSassTask,
      gulpSassSourcesTask,
      gulpTwigTask,
      gulpJsTask,
      gulpCopyImageTask,
      gulpCopyFontsTask
    ],
    function() {
      browserSync({
        server: {
          baseDir: paths.build
        },
        notify: false,
        browser: ["google chrome", "firefox"]
      });
    }
  )
);

/**
 * Compile .scss files into build css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
function gulpSassSourcesTask () {
  return (
    gulp
      .src(paths.sass.input + "ds/style.scss")
      .pipe(sourcemaps.init())
      // Stay live and reload on error
      .pipe(
        plumber({
          handleError: function(err) {
            console.log(err);
            this.emit("end");
          }
        })
      )
      .pipe(
        sass({
          includePaths: [paths.sass.input + "ds/"],
          outputStyle: "expanded"
        }).on("error", function(err) {
          console.log(err.message);
          // sass.logError
          this.emit("end");
        })
      )
      .pipe(
        prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
          cascade: true
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(paths.cssDS))
  );
};



/**
 * Compile .scss files into build css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
function gulpSassTask  () {
  return (
    gulp
      .src(paths.sass.input + "site/main.scss")
      .pipe(sourcemaps.init())
      // Stay live and reload on error
      .pipe(
        plumber({
          handleError: function(err) {
            console.log(err);
            this.emit("end");
          }
        })
      )
      .pipe(
        sass({
          includePaths: [paths.sass.input + "site/"],
          outputStyle: "expanded"
        }).on("error", function(err) {
          console.log(err.message);
          // sass.logError
          this.emit("end");
        })
      )
      .pipe(
        prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
          cascade: true
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(paths.sass.output))
  );
};

/**
 * Compile .js files into build js directory With app.min.js
 */
function gulpJsTask () {
    return gulp
      .src(paths.scripts.input)
      .pipe(sourcemaps.init())
      .pipe(concat("script.min.js"))
      .pipe(minify())
      .on("error", function(err) {
        console.log(err.toString());
        this.emit("end");
      })
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(paths.scripts.output));
};

 function gulpCopyImageTask () {    
    return gulp
      .src(paths.images.input + "/**/*.*")
      .pipe(gulp.dest(paths.images.output));  
};

 function gulpCopyFontsTask () {    
    return gulp
      .src(paths.fonts.input + "/**/*.*")
      .pipe(gulp.dest(paths.fonts.output));  
};
     
/**
 * Watch scss files for changes & recompile
 * Watch .twig files run twig-rebuild then reload BrowserSync
 */
function gulpWatchTask () {
	  gulp.watch(paths.build + 'assets/js/script.js', ['js', browserSync.reload]);
    // gulp.watch(paths.sass + 'vendors/main.scss', ['sass', browserSync.reload]);
    gulp.watch(paths.sass.input + 'ds/style.scss', ['sass', browserSync.reload]);
    gulp.watch(paths.sass.input + 'site/main.scss', ['sass', browserSync.reload]);
  	gulp.watch(['twig/templates/**/*.twig','twig/data/*.twig.json'], {cwd:'./'}, ['rebuild']);
};

// Build task compile sass and twig.
gulp.task(
  "build",
  gulp.series([
    gulpSassTask,
    gulpSassSourcesTask,
    gulpTwigTask,
    gulpCopyImageTask,
    gulpCopyFontsTask
  ])
);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the project site, launch BrowserSync then watch
 * files for changes
 */
gulp.task("default", gulp.series(['browser-sync', gulpWatchTask]));