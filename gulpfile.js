var gulp = require('gulp'),
	bump = require('gulp-bump'),
	eol = require('gulp-eol');

gulp.task('bump', function () {
	delete require.cache[require.resolve('./nejs')];
	var v = require('./nejs').VERSION.join('.');

	gulp.src('./*.json')
		.pipe(bump({version: v}))
		.pipe(eol())
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['bump']);
