var Observable = require('../core/fpxObservable');

var searchBox = '<div class="bs-searchbox"></div>';
var searchBoxInput = '<input type="text" class="form-control">';

$.expr.pseudos.icontains = function (obj, index, meta) {
	var $obj = $(obj).find('a');
	var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
	return haystack.includes(meta[3].toUpperCase());
};

var SearchExtension = Observable.extend({

	init: function (picklist, options) {
		picklist.on('openMenuPost', function (menuEl) {

			var searchBoxEl = $(searchBoxInput);
			searchBoxEl.on('input', function() {
				var searchText = $(this).val();//.toLowerCase();

				var ulEl = menuEl.find('ul');
				ulEl.find('li').show();

				var matches = ulEl.find('li:not(:icontains(\'' + searchText + '\'))');

				matches.hide();

				// if (picklist._options.dataSource.label) {
				// 	var labelProp = picklist._options.dataSource.label;
				// 	filteredOptions = allOptions.filter(function (option) {
				// 		return option[labelProp].toLowerCase().indexOf(searchText) >= 0;
				// 	});
				// } else {
				// 	filteredOptions = allOptions.filter(function (option) {
				// 		return option.toLowerCase().indexOf(searchText) >= 0;
				// 	});
				// }


				//picklist.dataSource.setOptions(filteredOptions);
			});

			var mainEl = $(searchBox);
			mainEl.append(searchBoxEl);

			menuEl.prepend(mainEl);
		});
	}

});

SearchExtension.extensionName = 'search';

module.exports = SearchExtension;