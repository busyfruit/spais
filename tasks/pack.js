var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var webpack = require('webpack');

var contextPath = path.join(GLOBAL.OPT_STATIC_BASE, '/js');

module.exports = function (cb) {
	var entryFileName = '[name].js';
	var libJSFileName = 'lib.js';
	var chunkFileName = 'p[id].js';
	var plugins = [];
	if (GLOBAL.DEV_MODE === false) {
		plugins.push(new webpack.optimize.UglifyJsPlugin());
		entryFileName = '[name]_[chunkhash].js';
		libJSFileName = 'lib_[chunkhash].js';
		chunkFileName = 'p[id]_[chunkhash].js';
	}
	plugins.push(new webpack.optimize.CommonsChunkPlugin('lib', libJSFileName));
	return webpack({
		context: contextPath,
		entry: {
			main: './main.js',
			lib: ['jquery', 'backbone', 'underscore']
		},
		output: {
			path: contextPath,
			publicPath: '/static/js/',
			filename: entryFileName,
			chunkFilename: chunkFileName
		},
		plugins: plugins,
		resolve: {
			alias: {
				'underscore': 'lodash'
			}
		}
	}, function (err, stats) {
		if (err) {
			cb(err);
		}
		cb();
	});
};