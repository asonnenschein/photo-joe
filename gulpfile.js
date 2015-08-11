var gulp = require('gulp')
  , less = require('gulp-less')
  , react = require('gulp-react')
;

gulp.task('build-less', function () {
  return gulp.src('./public/src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/dist/css/'))
  ;
});

gulp.task('build-react', function () {
  return gulp.src('./public/src/js/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('./public/dist/js/'))
});

gulp.task('copy', function () {
  return gulp.src('./public/src/index.html')
    .pipe(gulp.dest('./public/dist/'))
  ;
});

gulp.task('watch', function () {
  return gulp.watch(
    ['./public/src/less/*.less', './public/src/js/*.jsx'],
    ['build-less', 'build-react']);
});

gulp.task('default', ['watch', 'copy']);