var template = require('./index.tmpl');
var dialog = require('../../ui/dialog/dialog.js');

module.exports = Backbone.View.extend({
	className: 'view-index',
	
	events: {
		'click button': 'toggleDialog'
	},

	initialize: function () {
		var data = {
			title: '首页'
		};
		dialog.init({msg: 'dialog component...'});
		var html = template(data);
		this.$el.html(html);
	},

	toggleDialog: function (e) {
		dialog.toggle();
	}
});