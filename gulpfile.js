'use strict';
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');

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

gulp.task('sprite', () => {
  return gulp.src('images-dev/icon/icon-*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('images-dev/icon'));
});

gulp.task('styles', () => {
  return gulp.src('scss/a-style.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    overrideBrowserList: ['last 2 versions', '>1%'],
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(sourcemaps.write())
  .pipe(rename(function (path) {
    path.basename = path.basename.slice(2);
    path.basename += ".min";
  }))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream())
});

gulp.task('js', () => {
  return gulp.src('js/slider.js')
  .pipe(plumber())
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.stream())
});

gulp.task('watch', () => {
  browserSync.init({
       server: {
           baseDir: "./"
       }
   })
   gulp.watch('images-dev/**', gulp.series('images'))
   gulp.watch('scss/*.scss', gulp.series('styles'))
   gulp.watch('js/*.js', gulp.series('js'))
   gulp.watch('*.html').on('change', browserSync.reload)
});

gulp.task('images', () => {
  return gulp.src('images-dev/**', { allowEmpty: true })
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
    .pipe(gulp.dest('build/images'))
});

gulp.task('del', () =>  {
  return del(['build/']);
})

gulp.task('build', gulp.series('del', gulp.series('images', 'styles', 'js')));
gulp.task('default', gulp.series('build', 'watch'));
