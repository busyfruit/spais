/**
* copy image files to output fold,
* add md5 stamp if under release mode.
*/
var path = require('path');
var gulp = require('gulp');
var changed = require('gulp-changed');
var through2 = require('through2');
var util = require('./util.js');

var srcBase = process.env.SRC_BASE;
var optBase = process.env.OPT_BASE;
var optStaticBase = process.env.OPT_STATIC_BASE;
var imgBase = ['./src/**/*.png', './src/**/*.jpg', './src/**/*.gif'];

module.exports = function () {
	if (process.env.mode === 'development') {
		return gulp.src(imgBase, {
			base: srcBase
		})
		.pipe(changed(optBase))
		.pipe(gulp.dest(optBase));
	} else {
		// save the new file name of image for later usage.
		var imageMap = process.env.resourceMap.image = {};
		// add md5 stamp to image name.
		return gulp.src(imgBase, {
			base: srcBase
		})
		.pipe(through2.obj(function (file, enc, cb) {
			var stamp = util.md5(file, 6);
			var newpath = util.addStamp(file.path, stamp);
			newpath = newpath.replace(srcBase, optStaticBase);
			imageMap[file.path] = newpath;
			file.path = newpath;
			this.push(file);
			cb();
		}))
		.pipe(gulp.dest(optBase));
	}
};