var SmartPicklist = require('./smartPicklist');

var SmartPicklistMulti = SmartPicklist.extend({

	_init: function($element, options) {
		this._selectedOptions = [];
		this._super($element, options);
	},

	toggleByIndex: function(idx, itemEl) {
		var option = this.dataSource.getOptionByIndex(idx);
		// for (var i = 0; i < this._selectedOptions.length; i++) {
		// 	if (this._selectedOptions[i] === option) {
		//
		// 	}
		// }
		var selectedIdx = this._selectedOptions.indexOf(option);
		if (selectedIdx < 0) {
			this._selectedOptions.push(option);
			itemEl.find('a').append('<i class="icon-arrow-left check-mark"/>');
		} else {
			this._selectedOptions.splice(selectedIdx, 1);
			itemEl.find('i').remove();
		}

		if (this._selectedOptions.length === 0) {
			this._labelEl.text('-- Select Option --');
		} else if (this._options.dataSource.label) {
			this._labelEl.text(this._selectedOptions.length + ' items selected');
		} else {
			this._labelEl.text(this._selectedOptions.join());
		}
	},

	getSelectedOptions: function() {
		return this._selectedOptions;
	}
});

module.exports = SmartPicklistMulti;