var gulp = require('gulp');
var server = require('spable-server');

module.exports = function () {
	server({
		webroot: GLOBAL.OPT_BASE,
		entry: './index.tpl',
		conf: GLOBAL.SERVER_CONF
	});
};