'use strict';

var jQuery = require('jquery');
var SmartPicklist = require('./smartPicklist');
var utilities = require('./core/fpxUtilities');

(function ( $ ) {

	$.fn.smartPicklist = function (options) {
		var optionsWithDefaults = utilities.extend({}, $.fn.smartPicklist.defaults, options);
		var picklist = new SmartPicklist();
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

	};

	//$.fn.smartGrid.registerExtension(pagerExt);

}(jQuery));

module.exports = jQuery.fn.smartPicklist;