var template = require('./b.tmpl');

module.exports = Backbone.View.extend({
	className: 'view-b',
	
	initialize: function () {
		var data = {
			title: 'b页面'
		};
		var html = template(data);
		this.$el.html(html);
	}
});