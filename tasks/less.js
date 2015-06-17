/**
* automatically replace image url from development env to deployment env.
* automatically replace image url with base64 if the url has a "?__inline" suffix.
* finally, parse less to css.
* minify the css file if under release mode.
*/
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var changed = require('gulp-changed');
var less = require('gulp-less');
var cssMinify = require('gulp-minify-css');
var base64 = require('base64-js');
var chalk = require('chalk');
var through2 = require('through2');
var util = require('./util.js');

var srcBase = GLOBAL.SRC_BASE;
var optBase = GLOBAL.OPT_BASE;
var optStaticBase = GLOBAL.OPT_STATIC_BASE;
var imageMap = GLOBAL.imageMap;
var lessBase = './src/**/*.less';
var urlRegExp = /url\("([^\)]+)"\)/g;

module.exports = function () {
	var stream = gulp.src(lessBase, {
		base: srcBase
	})
	.pipe(changed(optBase))
	.pipe(through2.obj(function (file, enc, cb) {
		var dirname = path.dirname(file.path);
		var contents = file.contents.toString('utf8');
		contents = contents.replace(urlRegExp, function (s, s1) {
			if (s1.indexOf('?__inline') > -1) {
				s1 = s1.replace('?__inline', '');
				var extname = path.extname(s1).substr(1);
				var imgPath = path.join(dirname, s1);
				if (fs.existsSync(imgPath)) {
					var buffer = fs.readFileSync(path.join(dirname, s1));
					var code = base64.fromByteArray(buffer);
					return 'url("data:image/' + extname + ';base64,' + code + '")';
				} else {
					console.log(chalk.red('[warn] resource can not be found: "' + s1 + '" in ' + file.path));
					return s;
				}

			} else {
				var imgSrcPath = path.join(dirname, s1);
				var imgOptPath = imageMap[imgSrcPath];
				var imgUrl = util.convertPathToUrl(imgOptPath);
				return 'url("' + imgUrl + '")';
			}
		});
		file.path = file.path.replace('.less', '.css');
		file.contents = new Buffer(contents);
		this.push(file);
		cb();
	}))
	.pipe(less());

	if (GLOBAL.DEV_MODE) {
		return stream.pipe(gulp.dest(optStaticBase));
	} else {
		return stream.pipe(cssMinify()).pipe(gulp.dest(optStaticBase));
	}
};