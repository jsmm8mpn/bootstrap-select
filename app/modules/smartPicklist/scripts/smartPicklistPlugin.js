'use strict';

var jQuery = require('jquery');
var SmartPicklist = require('./smartPicklist');
var SmartPicklistMulti = require('./smartPicklistMulti');
var SmartPicklistSingle = require('./smartPicklistSingle');
var utilities = require('./core/fpxUtilities');
var searchExt = require('./coreExtensions/search');

(function ( $ ) {

	$.fn.smartPicklist = function (options) {
		var optionsWithDefaults = utilities.extend({}, $.fn.smartPicklist.defaults, options);
		var picklist;
		if (optionsWithDefaults.multi.enabled) {
			picklist = new SmartPicklistMulti();
		} else {
			picklist = new SmartPicklistSingle();
		}
		picklist._init($(this), optionsWithDefaults);
		return picklist;
	};

	$.fn.smartPicklist._extensions = {};
	$.fn.smartPicklist.registerExtension = function(extension) {
		$.fn.smartPicklist._extensions[extension.extensionName] = extension;
	};

	$.fn.smartPicklist.getExtension = function(extensionName) {
		return $.fn.smartPicklist._extensions[extensionName];
	};

	$.fn.smartPicklist.defaults = {
		dataSource: {},
		multi: {
			enabled: false,
			checkIcon: '',
			label: function(selectedItems) {
				if (selectedItems.length > 3) {
					return selectedItems.length + ' items selected';
				} else if (selectedItems.length === 0) {
					return 'Nothing selected';
				} else {
					return selectedItems.join();
				}
			}
		},
		dropUp: 'auto',
		height: 'auto',
		title: undefined,
		width: 'auto',
		search: {
			enabled: false,
			placeholder: 'Search for items...',
			mode: 'contains' // startswith
		}
	};

	$.fn.smartPicklist.registerExtension(searchExt);

}(jQuery));

module.exports = jQuery.fn.smartPicklist;