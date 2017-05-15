var Observable = require('../core/fpxObservable');

var searchBox = '<div class="bs-searchbox"></div>';
var searchBoxInput = '<input type="text" class="form-control">';

var matchFunctions = {
	contains: function(item, search) {
		return item.indexOf(search) >= 0;
	},
	startswith: function(item, search) {
		return item.indexOf(search) === 0;
	}
};

var SearchExtension = Observable.extend({

	init: function (picklist, options) {

		var matchFn = matchFunctions[options.mode];
		if (!matchFn) {
			throw 'Invalid search mode';
		}

		picklist.on('openMenuPost', function (menuEl) {

			var items = menuEl.find('li');

			var searchBoxEl = $(searchBoxInput);
			searchBoxEl.on('input', function() {
				var searchText = $(this).val().trim().toLowerCase();

				if (searchText) {
					items.hide();
					var matches = items.filter(function () {
						var a = $(this).find('a');
						var itemText = a.text().toLowerCase();
						return matchFn(itemText, searchText);
					});
					matches.show();
				} else {
					items.show();
				}
			});

			var mainEl = $(searchBox);
			mainEl.append(searchBoxEl);

			menuEl.prepend(mainEl);
		});
	}

});

SearchExtension.extensionName = 'search';

module.exports = SearchExtension;