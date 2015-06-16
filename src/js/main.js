window.$ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

function render (View) {
	var view = new View();
	$('#wrapper').html(view.$el);
}

var Router = Backbone.Router.extend({
	routes: {
		'': 'index',
		'a': 'pageA',
		'b': 'pageB'
	},

	index: function () {
		require.ensure([], function (require) {
			var Index = require('../view/index/index.js');
			render(Index);
		});
	},

	pageA: function () {
		require.ensure([], function (require) {
			var PageA = require('../view/a/a.js');
			render(PageA);
		});
	},

	pageB: function () {
		require.ensure([], function (require) {
			var PageB = require('../view/b/b.js');
			render(PageB);
		});
	}
});

var router = new Router;
Backbone.history.start();