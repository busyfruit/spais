var gulp = require('gulp');
var changed = require('gulp-changed');

module.exports = function () {
	return (
		gulp.src('./src/**/*.js', {
			base: GLOBAL.SRC_BASE
		})
		.pipe(gulp.dest(GLOBAL.OPT_STATIC_BASE))
	);
};