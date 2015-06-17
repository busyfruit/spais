var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var chalk = require('chalk');
var through2 = require('through2');
var util = require('./util.js');

var srcBase = GLOBAL.SRC_BASE;
var optBase = GLOBAL.OPT_BASE;
var optStaticBase = GLOBAL.OPT_STATIC_BASE;

module.exports = function () {
	var stream = gulp.src([
		path.join(optStaticBase, 'css/reset.css'),
		path.join(optStaticBase, 'css/common.css')
	])
	.pipe(concat('global.css'))
	.pipe(through2.obj(function (file, enc, cb) {
		var newpath = file.path;
		if (GLOBAL.DEV_MODE === false) {
			var stamp = util.md5(file, GLOBAL.STAMP_SIZE);
			newpath = util.addStamp(newpath, stamp);
		}
		GLOBAL.globalCSSPath = newpath;
		file.path = newpath;
		this.push(file);
		cb();
	}))
	.pipe(gulp.dest(optStaticBase + '/css'));
};