var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence');

// SERVER
gulp.task('clean', function(){
    return del('dist')
});

gulp.task('build:server', function () {
	var tsProject = ts.createProject('server/tsconfig.json');
    var tsResult = gulp.src('server/**/*.ts')
		.pipe(sourcemaps.init())
        .pipe(ts(tsProject))
	return tsResult.js
        .pipe(concat('server.js'))
        .pipe(sourcemaps.write()) 
		.pipe(gulp.dest('dist'))
});

gulp.task('build:index', function(){
    var html = gulp.src('public/index.html')
        .pipe(gulp.dest('dist'))
    var css = gulp.src('public/css/*.css')
        .pipe(gulp.dest('dist/css'))
    return [html, css]
});

gulp.task('build:assignment', function() {
    var tsProject = ts.createProject('public/tsconfig.json');
    var tsResult = gulp.src('public/assignment/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assignment'))
    var html = gulp.src('public/assignment/**/*.html')
        .pipe(gulp.dest('dist/assignment'))
    var css = gulp.src('public/assignment/**/*.css')
        .pipe(gulp.dest('dist/assignment'))
    return [ tsResult, html, css ]
})

gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:index', 'build:assignment', callback);
});

gulp.task('default', ['build']);