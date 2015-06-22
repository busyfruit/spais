var crypto = require('crypto');
var path = require('path');
var chalk = require('chalk');

module.exports = {
	md5: function (file, size) {
		var md5 = crypto.createHash('md5');
		md5.update(file.contents, 'utf8');
		var size = size | 0;
		return size > 0 ? md5.digest('hex').slice(0, size) : md5.digest('hex');
	},

	// add stamp to file name. 
	// eg: path/to/demo.jpg => path/to/demo_ds43f2.jpg
	addStamp: function (filePath, stamp) {
		var extname = path.extname(filePath);
		var basename = path.basename(filePath, extname);
		var dirname = path.dirname(filePath);
		return path.join(dirname, basename) + '_' + stamp + extname;
	},

	convertPathToUrl: function (filePath) {
		var prefix = GLOBAL.DEV_MODE ? '/static' : GLOBAL.STATIC_URL_PREFIX;
		var relativePath = filePath.replace(GLOBAL.OPT_STATIC_BASE, '');
		var useCDN = false;
		if (prefix.indexOf('http://') === 0) {
			prefix = prefix.replace('http://', '');
			useCDN = true;
		}
		return (useCDN ? 'http://' : '') + path.join(prefix, relativePath).replace(/\\/g, '/');
	}
};