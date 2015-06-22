/**
* automatically replace "<link href=path/to/some.less> "as:
* "<style>the complied less file contents goes here...</style>"
* automatically replace img src from development env to deployment env.
* finally, pre-compile the html to js template function with commonJS module define.
*/

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var through2 = require('through2');
var template = require('lodash').template;
var chalk = require('chalk');
var util = require('./util.js');

var srcBase = GLOBAL.SRC_BASE;
var optBase = GLOBAL.OPT_BASE;
var optStaticBase = GLOBAL.OPT_STATIC_BASE;
var imageMap = GLOBAL.imageMap;
var tmplBase = './src/**/*.tmpl';
var cssRegExpStr = '<link[^>]+?href="([^>]+)"[^>]*?>';
var cssRegExp = new RegExp(cssRegExpStr);
var cssRegExpGlobal = new RegExp(cssRegExpStr, 'g');
var imgRegExp = /<img([^>]+?)src="([^>]+?)"([^>]*?)>/g;

module.exports = function () {
	return gulp.src(tmplBase, {
		base: srcBase
	})
	.pipe(through2.obj(function (file, enc, cb) {
		var contents = file.contents.toString('utf8');
		var dirname = path.dirname(file.path);
		var matches, less = [];

		while (null !== (matches = cssRegExpGlobal.exec(contents))) {
			less.push(matches[1]);
		}

		less.forEach(function (lessPath) {
			var cssPath = path.join(dirname, lessPath).replace(srcBase, optStaticBase).replace('.less', '.css');
			if (fs.existsSync(cssPath)) {
				var cssContent = fs.readFileSync(cssPath, 'utf8');
				cssContent = '<style type="text/css">' + cssContent + '</style>';
				contents = contents.replace(cssRegExp, function (s) {
					return cssContent;
				});
			} else {
				console.log(chalk.red('[warn] resource can not be found: "' + lessPath + '" in ' + file.path));
			}
		});

		contents = contents.replace(imgRegExp, function (s, s1, s2, s3) {
			var imgSrcPath = path.join(dirname, s2);
			var imgOptPath = imageMap[imgSrcPath];
			var imgUrl = util.convertPathToUrl(imgOptPath);
			return '<img' + s1 + 'src="' + imgUrl + '"' + s3 + '>';
		});
		file.contents = new Buffer(contents);
		this.push(file);
		cb();
	}))
	.pipe(through2.obj(function (file, enc, cb) {
		var contents = file.contents.toString('utf8');
		contents = template(contents).source;
		contents = 'module.exports=' + contents + ';';
		file.contents = new Buffer(contents);
		this.push(file);
		cb();
	}))
	.pipe(gulp.dest(optStaticBase));
};
