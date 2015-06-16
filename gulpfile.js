var path = require('path');
var gulp = require('gulp');

process.env.SRC_BASE = path.join(__dirname, './src');
process.env.OPT_BASE = path.join(__dirname, './output');
process.env.OPT_STATIC_BASE = path.join(__dirname, './output/static');
process.env.resourceMap = {};

gulp.task('devMode', function () {
	process.env.mode = 'development';
});

gulp.task('releaseMode', function () {
	process.env.mode = 'release';
});

gulp.task('image', require('./tasks/image.js'));
gulp.task('index', require('./tasks/index.js'));

gulp.task('dev', ['devMode', 'image', 'index']);

gulp.task('release', ['releaseMode', 'image']);