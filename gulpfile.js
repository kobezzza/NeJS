var gulp = require('gulp'),
	bump = require('gulp-bump');

gulp.task('bump', function () {
	delete require.cache[require.resolve('./nejs')];
	var v = require('./nejs').VERSION.join('.');

	gulp.src('./*.json')
		.pipe(bump({version: v}))
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['bump']);
