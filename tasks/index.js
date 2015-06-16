/**
* copy the entry file(index.tpl) to output folder,
* relpace static resource url if under release mode.//TODO
*/
var optBase = process.env.OPT_BASE;

module.exports = function () {
	gulp.src('./src/index.tpl').pipe(gulp.dest(optBase));
};