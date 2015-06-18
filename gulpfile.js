var path = require('path');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk');

GLOBAL.SRC_BASE = path.join(__dirname, './src');
GLOBAL.OPT_BASE = path.join(__dirname, './output');
GLOBAL.OPT_STATIC_BASE = path.join(__dirname, './output/static');
GLOBAL.OPT_STATIC_CSS_BASE = path.join(OPT_STATIC_BASE, './css');
GLOBAL.OPT_STATIC_JS_BASE = path.join(OPT_STATIC_BASE, './js');
GLOBAL.SERVER_CONF = path.join(__dirname, 'server.conf');
GLOBAL.STAMP_SIZE = 6;
GLOBAL.DEV_MODE = true;
GLOBAL.imageMap = {};

gulp.task('devMode', function () {
	GLOBAL.DEV_MODE = true;
});

gulp.task('releaseMode', function () {
	GLOBAL.DEV_MODE = false;
});

gulp.task('image', require('./tasks/image.js'));
gulp.task('less', ['image'], require('./tasks/less.js'));
gulp.task('template', ['less'], require('./tasks/template.js'));
gulp.task('js', require('./tasks/js.js'));
gulp.task('pack', ['js', 'template'], require('./tasks/pack.js'));
gulp.task('index', ['pack', 'less'], require('./tasks/index.js'));

gulp.task('devserver', require('./tasks/server.js'));

gulp.task('dev', ['devMode', 'index'], function () {
	var watcher = gulp.watch('./src/**', ['index']);
	watcher.on('change', function () {
		console.log(chalk.green('============================================'));
	});
});

gulp.task('release', ['clean', 'releaseMode', 'index'], function () {
	console.log(chalk.green('================Release Done!================'));
});

gulp.task('clean', function () {
	del(['./output/**']);
});