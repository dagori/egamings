'use strict';
const { src, dest, series, parallel, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
//const htmlmin = require('gulp-htmlmin');

const config = {
  shape: {
    dimension: { // Set maximum dimensions
      maxWidth: 26,
      maxHeight: 26
    },
    spacing: { // Add padding
      padding: 5
    }
  },
  mode: {
    view: { // Activate the «view» mode
      bust: false,
      render: {
        scss: true // Activate Sass output (with default options)
      }
    },
    symbol: false // Activate the «symbol» mode
  }
};

// function html() {
//   return src('*.html')
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(dest('build'))
// }

function sprites() {
  return src('images-dev/*.svg')
    .pipe(svgSprite(config))
    .pipe(dest('build/images'));
}

function styles() {
  return src('scss/a-style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserList: ['last 2 versions', '>1%'],
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename(function (path) {
      path.basename = path.basename.slice(2) + ".min";
    }))
    .pipe(dest('build/css', { sourcemaps: true }))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('js/*.js', { sourcemaps: true })
  .pipe(plumber())
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest('build/js'), { sourcemaps: true })
  .pipe(browserSync.stream())
}

function serve() {
  browserSync.init({
    server: {
       baseDir: "./"
    }
  });
  watch('images/*', series(images))
  watch('js/*.js', series(scripts))
  watch('scss/*.scss', series(styles))
  watch('*.html').on('change', browserSync.reload)
}

function images() {
  return src('images-dev/**')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
        ]
      }),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(dest('build/images'))
}

function clean() {
  return del(['build/*']);
}

exports.serve = serve;
exports.css = styles;
exports.js = scripts;
exports.img = images;
exports.clean = clean;
exports.sprites = sprites;
exports.default = series(clean, images, styles, scripts, serve);
