var path = require('path');
var gulp = require('gulp');

GLOBAL.SRC_BASE = path.join(__dirname, './src');
GLOBAL.OPT_BASE = path.join(__dirname, './output');
GLOBAL.OPT_STATIC_BASE = path.join(__dirname, './output/static');
GLOBAL.STAMP_SIZE = 6;
GLOBAL.DEV_MODE = false;
GLOBAL.imageMap = {};
GLOBAL.globalCSSPath = '';

gulp.task('devMode', function () {
	GLOBAL.DEV_MODE = true;
});

gulp.task('releaseMode', function () {
	GLOBAL.DEV_MODE = false;
});

gulp.task('image', require('./tasks/image.js'));
gulp.task('index', require('./tasks/index.js'));
gulp.task('less', ['image'], require('./tasks/less.js'));
gulp.task('template', ['less'], require('./tasks/template.js'));
gulp.task('global-css', ['less'], require('./tasks/global-css.js'));
gulp.task('js', require('./tasks/js.js'));
gulp.task('pack', ['js', 'template'], require('./tasks/pack.js'));

gulp.task('dev', ['devMode', 'image', 'index']);

gulp.task('release', ['releaseMode', 'image']);