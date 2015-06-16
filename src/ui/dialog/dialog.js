var template = require('./dialog.tmpl');

module.exports = {
	init: function (opts) {
		var div = document.createElement('div');
		div.className = 'ui-dialog';
		var html = template({msg: opts.msg});
		div.innerHTML = html;
		document.body.appendChild(div);
		this.$el = $(div);
		this.isHide = true;
		return this;
	},

	show: function () {
		this.$el.show();
		this.isHide = false;
	},

	hide: function () {
		this.$el.hide();
		this.isHide = true;
	},

	toggle: function () {
		if (this.isHide) {
			this.show();
		} else {
			this.hide();
		}
	}
};