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
  rename = require("gulp-rename"),
  zip = require("gulp-zip"),
  minify = require("gulp-minify"),
  mergeStream = require("merge-stream"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync"),
  fs = require("fs");

/*
 * Directories here
 */
var pathsNew = {
  build: "./build/",

  kitUI: {
    sass: {
      input: "./src/scss/ds/style.scss",
      output: "./ds-sources/assets/css/"
    },
    images: {
      input: "./src/assets/images/",
      output: "./ds-sources/assets/images/"
    },
    fonts: {
      input: "./src/assets/fonts/",
      output: "./ds-sources/assets/fonts/"
    }
  },

  site: {
    scripts: {
      input: "./src/js/*",
      output: "./build/assets/js/"
    },
    sass: {
      input: "./src/scss/site/main.scss",
      output: "./build/assets/css/"
    },
    images: {
      input: "./src/assets/images/",
      output: "./build/assets/images/"
    },
    fonts: {
      input: "./src/assets/fonts/",
      output: "./build/assets/fonts/"
    }
  }
};

var paths = {
  build: "./build/",
  zip: "./ds-sources/",
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
      gulpCopyFontsTask,
      gulpZipResourcesTask
    ],
    function() {
      browserSync({
        server: {
          baseDir: paths.build
        },
        notify: false,
        browser: ["chrome", "firefox"]
      });
    }
  )
);

/**
 * Compile .scss files into build css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
function gulpSassSourcesTask () {
  
    var sassDS =  gulp
      .src(pathsNew.kitUI.sass.input)
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
          includePaths: [pathsNew.kitUI.sass.input + "ds/"],
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
      .pipe(gulp.dest(pathsNew.kitUI.sass.output))

      // 

      var sassSite = gulp
        .src(pathsNew.kitUI.sass.input)
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
            includePaths: [pathsNew.kitUI.sass.input + "ds/"],
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
        .pipe(gulp.dest(pathsNew.site.sass.output));

      return mergeStream(sassDS, sassSite);
};



/**
 * Compile .scss files into build css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
function gulpSassTask  () {
  return (
    gulp
      .src(pathsNew.site.sass.input)
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
          includePaths: [pathsNew.site.sass.input + "site/"],
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
      .pipe(gulp.dest(pathsNew.site.sass.output))
  );
};

/**
 * Compile .js files into build js directory With app.min.js
 */
function gulpJsTask () {
    return gulp
      .src(paths.scripts.input)
      .pipe(sourcemaps.init())
      // .pipe(concat("script.min.js"))
      .pipe(minify())
      .on("error", function(err) {
        console.log(err.toString());
        this.emit("end");
      })
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(paths.scripts.output));
};

/**
 *  Copy Images folder to assets
 */
 function gulpCopyImageTask () {    
    return gulp
      .src(paths.images.input + "/**/*.*")
      .pipe(gulp.dest(paths.images.output));  

      
};
/**
 * Copy fonts folder to assets
 */
 function gulpCopyFontsTask () {    
    var fontsDS = gulp
      .src(pathsNew.kitUI.fonts.input + "/**/*.*")
      .pipe(gulp.dest(pathsNew.kitUI.fonts.output)); 

    var fontsSite = gulp
      .src(pathsNew.site.fonts.input + "/**/*.*")
      .pipe(gulp.dest(pathsNew.site.fonts.output)); 

      return mergeStream(fontsDS, fontsSite);
};

/**
 * Zip the ressources folder
 * 
 *  */
function gulpZipResourcesTask () {
  return gulp
    .src(pathsNew.zip + "./**")
    .pipe(zip("assets-resource.zip"))
    .pipe(gulp.dest("./build/"));
};


     
/**
 * Rename files extension
 * 
 */

 /* gulp.task("jsx", function() {
   return gulp
     .src(exampleJSX)
     .pipe(plumber())
     .pipe(jsx())
     .on("error", function(e) {
       console.error(e.message + "\n  in " + e.fileName);
     })
     .pipe(rename({ ext: ".js" }));
 }); */

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
    gulpCopyFontsTask,
    gulpZipResourcesTask
  ])
);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the project site, launch BrowserSync then watch
 * files for changes
 */
gulp.task("default", gulp.series(['browser-sync', gulpWatchTask]));