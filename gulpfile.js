var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css');

gulp.task('default', ['miniJs','miniCss']);

gulp.task('miniJs', function() {
  return gulp.src('./public/js/*.js').pipe(uglify()).pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('miniCss', function() {
  return gulp.src('./public/css/*.css').pipe(minifyCss()).pipe(gulp.dest('./public/stylesheets/'));
});
