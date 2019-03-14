var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean');

//发布目录
var destDir = 'dist';

gulp.task('build', function () {
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest(destDir))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(destDir));
});

gulp.task('clean', function () {
	//gulp4的语法: allowEmpty默认为false
	return gulp.src(destDir, {read: false, allowEmpty: true})
		.pipe(clean());
});

//gulp4的语法
gulp.task('default', gulp.series('clean','build'));
