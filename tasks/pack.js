var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var webpack = require('webpack');

var contextPath = path.join(GLOBAL.OPT_STATIC_BASE, '/js');

module.exports = function (cb) {
	var plugins = [new webpack.optimize.CommonsChunkPlugin('lib', 'lib_[chunkhash].js')];
	if (GLOBAL.DEV_MODE === false) {
		plugins.push(new webpack.optimize.UglifyJsPlugin());
	}
	return webpack({
		context: contextPath,
		entry: {
			main: './main.js',
			lib: ['jquery', 'backbone', 'underscore']
		},
		output: {
			path: contextPath,
			publicPath: '/static/js/',
			filename: '[name]_[chunkhash].js',
			chunkFilename: 'p[id]_[chunkhash].js'
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