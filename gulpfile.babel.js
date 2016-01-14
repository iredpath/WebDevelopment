import gulp from 'gulp';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import help from 'gulp-help';
import supervisor from 'gulp-supervisor';

// Initialize help
help(gulp, { description: 'Help listing' });

// paths to relevant code bundles
const paths = {
	js: ['src/**/*.js']
}

// Build task
// Run as a build action hook by openshift
gulp.task('build', 'Babelify, concatenate, and uglify source into dist/app.min.js', () => {
	return gulp.src(paths.js)
		.pipe(babel())
		.on('error', notify.onError("Error running babel(): <%= error.message %>"))
		.pipe(concat('app'))
		.on('error', notify.onError("Error running concat(): <%= error.message %>"))
		.pipe(uglify())
		.on('error', notify.onError("Error running uglify(): <%= error.message %>"))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('dist'));
});

// Supervisor task
// Pseudo hot-relodaing
gulp.task('supervisor', 'supervise app.min.js, reload upon changes', () => {
	supervisor('dist/app.min.js');
})

// Watch task
// Used for local development.  Builds codebase, watches for changes, rebuilds
gulp.task('watch', 'rebuilds source on change', () => {
	watch(paths.js, () => gulp.start('build'));
});

// Default
gulp.task('default', ['supervisor', 'build', 'watch'])