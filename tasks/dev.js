var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var template = require('lodash').template;
var base64 = require('base64-js');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var chalk = require('chalk');
var webpack = require('webpack');
var through2 = require('through2');

var srcBase = path.join(__dirname, '../src');
var optBase = path.join(__dirname, '../output/static');

gulp.task('copyImage', function () {
	return gulp.src(
		['./src/**/*.png', './src/**/*.jpg', './src/**/*.gif'], {
		base: srcBase
	})
	.pipe(changed(optBase))
	.pipe(gulp.dest(optBase));
});

gulp.task('compileLess', function () {
	return gulp.src('./src/**/*.less', {
		base: srcBase
	})
	.pipe(changed(optBase))
	.pipe(through2.obj(function (file, enc, cb) {
		var dirname = path.dirname(file.path);
		var regexp = /url\("([^\)]+)"\)/g;
		var contents = file.contents.toString('utf8');
		contents = contents.replace(regexp, function (s, s1) {
			if (s1.indexOf('?__inline') > -1) {
				s1 = s1.replace('?__inline', '');
				var extname = path.extname(s1).substr(1);
				var imgPath = path.join(dirname, s1);
				if (fs.existsSync(imgPath)) {
					var buffer = fs.readFileSync(path.join(dirname, s1));
					return 'url("data:image/' + extname + ';base64,' + base64.fromByteArray(buffer) + '")';
				} else {
					console.log(chalk.red('[Warning] resource can not be found: "' + s1 + '" in ' + file.path));
					return s;
				}

			} else {
				var imgPath ='/static' + path.join(dirname, s1).replace(srcBase, '').replace(/\\/g, '/');
				return 'url("' + imgPath + '")';
			}
		});
		file.path = file.path.replace('.less', '.css');
		file.contents = new Buffer(contents);
		this.push(file);
		cb();
	}))
	.pipe(less())
	.pipe(gulp.dest(optBase));
});

gulp.task('compileTmpl', ['compileLess'], function () {
	return gulp.src('./src/**/*.tmpl', {
		base: srcBase
	})
	// .pipe(changed(optBase))
	.pipe(through2.obj(function (file, enc, cb) {
		var contents = file.contents.toString('utf8');
		var cssRegStr = '<link[^>]+?href="([^>]+)"[^>]*?>';
		var cssRegGlobal = new RegExp(cssRegStr, 'g');
		var cssReg = new RegExp(cssRegStr);
		var imgReg = /<img([^>]+?)src="([^>]+)"([^>]*?)>/g;
		var dirname = path.dirname(file.path);
		var matches, less = [];
		while (null !== (matches = cssRegGlobal.exec(contents))) {
			less.push(matches[1]);
		}
		less.forEach(function (lessPath) {
			var cssPath = path.join(dirname, lessPath).replace(srcBase, optBase).replace('.less', '.css');
			if (fs.existsSync(cssPath)) {
				var cssContent = fs.readFileSync(cssPath, 'utf8');
				cssContent = '<style type="text/css">' + cssContent + '</style>';
				contents = contents.replace(cssReg, function (s) {
					return cssContent;
				});
			} else {
				console.log(chalk.red('[Warning] resource can not be found: "' + lessPath + '" in ' + file.path));
			}
		});
		contents = contents.replace(imgReg, function (s, s1, s2, s3) {
			var imgPath = path.join(dirname, s2).replace(srcBase, '').replace(/\\/g, '/');
			imgPath = path.join('/static', imgPath).replace(/\\/g, '/');
			return '<img' + s1 + 'src="' + imgPath + '"' + s3 + '>';
		});
		file.contents = new Buffer(contents);
		this.push(file);
		cb();
	}))
	.pipe(through2.obj(function (file, enc, cb) {
		var contents = file.contents.toString('utf8');
		contents = template(contents).source;
		contents = 'module.exports=' + contents;
		file.contents = new Buffer(contents);
		this.push(file);
		cb();
	}))
	.pipe(gulp.dest(optBase));
});

gulp.task('copyEntryFile', function () {
	gulp.src('./src/index.tpl').pipe(gulp.dest(path.join(__dirname, '../output')));
});

gulp.task('packCommonCSS', ['compileLess'], function () {
	return gulp.src([
		'./output/static/css/reset.css',
		'./output/static/css/common.css'
	])
	.pipe(concat('main.css'))
	.pipe(gulp.dest(optBase + '/css'));
});

gulp.task('copyJS', function () {
	gulp.src('./src/**/*.js')
	// .pipe(changed(optBase))
	.pipe(gulp.dest(optBase));
});

gulp.task('packJS', ['compileTmpl', 'copyJS'], function () {
	return webpack({
		context: path.join(optBase, '/js'),
		entry: {
			main: './main.js',
			lib: ['jquery', 'backbone', 'underscore']
		},
		output: {
			path: path.join(optBase, '/js'),
			publicPath: '/static/js/',
			filename: '[name].js',
			chunkFilename: 'chunk-[id].js'
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js')
		],
		resolve: {
			alias: {
				'underscore': 'lodash'
			}
		}
	}, function (err, stats) {
		if (err) {
			console.log('run webpack task failure, please try again...');
		}
	});
});

gulp.task('dev', ['copyImage', 'packCommonCSS', 'copyEntryFile', 'packJS'], function () {
	gulp.watch(['./src/**', 'gulpfile.js'], ['copyImage', 'packCommonCSS', 'copyEntryFile', 'packJS']);
});
