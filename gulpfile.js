'use strict';
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
//const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminSvgo = require('imagemin-svgo');
const sourcemaps = require('gulp-sourcemaps');

function styles() {
  return gulp.src('scss/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  //.pipe(autoprefixer({
  //  browsers: ['last 2 versions'],
  //  cascade: false
  //}))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
       server: {
           baseDir: "./"
       }
   })
   gulp.watch('images/*', images)
   gulp.watch('scss/style.scss', styles)
   gulp.watch('*.html').on('change', browserSync.reload)
}

function images() {
  return gulp.src('images/**')
        .pipe(imagemin([
          imagemin.svgo({
            plugins: [
              {removeViewBox: false},
              {cleanupIDs: false}
            ]
          })
        ]))
        .pipe(gulp.dest('build/images'))
}

function clean() {
  return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('del', clean);

gulp.task('build', gulp.series('del', 'images', 'styles'));
gulp.task('default', gulp.series('build', 'watch'));
