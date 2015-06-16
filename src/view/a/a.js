var template = require('./a.tmpl');
console.log(template);
module.exports = Backbone.View.extend({
	className: 'view-a',
	
	initialize: function () {
		var data = {
			title: 'a页面'
		};
		var html = template(data);
		this.$el.html(html);
	}
});