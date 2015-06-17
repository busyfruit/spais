/**
* copy image files to output fold,
* add md5 stamp if under release mode.
*/
var gulp = require('gulp');
var changed = require('gulp-changed');
var through2 = require('through2');
var util = require('./util.js');

var srcBase = GLOBAL.SRC_BASE;
var optBase = GLOBAL.OPT_BASE;
var optStaticBase = GLOBAL.OPT_STATIC_BASE;
var imageMap = GLOBAL.imageMap;
var imgBase = ['./src/**/*.png', './src/**/*.jpg', './src/**/*.gif'];

module.exports = function () {
	// save the new file name of image for later use.
	return (
		gulp
		.src(imgBase, {
			base: srcBase
		})
		.pipe(changed(optBase))
		.pipe(through2.obj(function (file, enc, cb) {
			var newpath = file.path.replace(srcBase, optStaticBase);
			if (GLOBAL.DEV_MODE === false) {
				// add md5 stamp to image name.
				var stamp = util.md5(file, GLOBAL.STAMP_SIZE);
				newpath = util.addStamp(newpath, stamp);
			}
			imageMap[file.path] = newpath;
			file.path = newpath;
			this.push(file);
			cb();
		}))
		.pipe(gulp.dest(optBase))
	);
};