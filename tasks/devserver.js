var path = require('path');
var gulp = require('gulp');
var server = require('spable-server');

gulp.task('devserver', function () {
	server({
		webroot: path.join(__dirname, '../output'),
		entry: './index.tpl',
		conf: path.join(__dirname, '../server.conf')
	});
});