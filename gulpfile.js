var path = require('path');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk');

// 源码根目录
GLOBAL.SRC_BASE = path.join(__dirname, './src');
// 编译产出根目录
GLOBAL.OPT_BASE = path.join(__dirname, './output');
// 静态资源产出根目录
GLOBAL.OPT_STATIC_BASE = path.join(__dirname, './output/static');
// css文件产出根目录
GLOBAL.OPT_STATIC_CSS_BASE = path.join(OPT_STATIC_BASE, './css');
// js文件产出根目录
GLOBAL.OPT_STATIC_JS_BASE = path.join(OPT_STATIC_BASE, './js');
// 静态资源路径前缀，比如：cdndomian/static或者/static/some_sub_dir
GLOBAL.STATIC_URL_PREFIX = '/static'; 
// url配置文件
GLOBAL.SERVER_CONF = path.join(__dirname, 'server.conf');
// md5戳长度
GLOBAL.STAMP_SIZE = 6;
// 是否是开发模式，false时会进行文件压缩混淆等
GLOBAL.DEV_MODE = true;
// 图片编译前后存放位置的映射，用于对css、模板中的图片引用进行定位
GLOBAL.imageMap = {};

gulp.task('devMode', ['clean'], function () {
	GLOBAL.DEV_MODE = true;
});

gulp.task('releaseMode', ['clean'], function () {
	GLOBAL.DEV_MODE = false;
});

gulp.task('image', require('./tasks/image.js'));
gulp.task('less', ['image'], require('./tasks/less.js'));
gulp.task('template', ['less'], require('./tasks/template.js'));
gulp.task('js', require('./tasks/js.js'));
gulp.task('pack', ['js', 'template'], require('./tasks/pack.js'));
gulp.task('index', ['pack', 'less'], require('./tasks/index.js'));

gulp.task('server', require('./tasks/server.js'));

gulp.task('dev', ['devMode', 'index'], function () {
	var watcher = gulp.watch('./src/**', ['index']);
	watcher.on('change', function () {
		console.log(chalk.green('============================================'));
	});
});

gulp.task('release', ['releaseMode', 'index'], function () {
	console.log(chalk.green('================Release Done!================'));
});

gulp.task('clean', function () {
	del.sync(['./output/**']);
});