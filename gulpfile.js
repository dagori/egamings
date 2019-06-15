'use strict';
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");

gulp.task('styles', () => {
  return gulp.src('scss/a-style.scss')
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

gulp.task('watch', () => {
  browserSync.init({
       server: {
           baseDir: "./"
       }
   })
   gulp.watch('images/**', gulp.series('images'))
   gulp.watch('scss/a-style.scss', gulp.series('styles'))
   gulp.watch('*.html').on('change', browserSync.reload)
});

gulp.task('images', () => {
  return gulp.src('images/**', { allowEmpty: true })
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
  return del(['build/*']);
})

gulp.task('build', gulp.series('del', gulp.parallel('images', 'styles')));
gulp.task('default', gulp.series('del', 'styles', 'watch'));
