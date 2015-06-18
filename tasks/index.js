/**
* copy the entry file(index.tpl) to output folder,
* relpace static resource url if under release mode.//TODO
*/
var fs = require('fs');
var gulp = require('gulp');
var through2 = require('through2');
var template = require('lodash').template;
var changed = require('gulp-changed');
var util = require('./util.js');

var optBase = GLOBAL.OPT_BASE;

module.exports = function () {
	return (
		gulp
		.src('./src/index.tpl')
		.pipe(changed(optBase))
		.pipe(through2.obj(function (file, enc, cb) {
			var contents = file.contents.toString('utf8');
			var data = {};
			if (GLOBAL.DEV_MODE) {
				data = {
					globalCSS: '/static/css/global.css',
					libJS: '/static/js/lib.js',
					entryJS: '/static/js/main.js'
				};
			} else {
				fs.readdirSync(GLOBAL.OPT_STATIC_CSS_BASE).forEach(function (fileName) {
					if (fileName.indexOf('global_') === 0) {
						data.globalCSS = '/static/css/' + fileName;
					}
				});
				fs.readdirSync(GLOBAL.OPT_STATIC_JS_BASE).forEach(function (fileName) {
					if (fileName.indexOf('lib_') === 0) {
						data.libJS = '/static/js/' + fileName;
					} else if (fileName.indexOf('main_') === 0) {
						data.entryJS = '/static/js/' + fileName;
					}
				});
			}
			var compiled = template(contents);
			contents = compiled(data);
			file.contents = new Buffer(contents);
			this.push(file);
			cb();
		}))
		.pipe(gulp.dest(optBase))
	);
};