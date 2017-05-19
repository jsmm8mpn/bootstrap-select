var SmartPicklist = require('./smartPicklist');

var SmartPicklistSingle = SmartPicklist.extend({

	_init: function($element, options) {
		this._super($element, options);
		if (options.selectedOption) {
			this.select(options.selectedOption);
		}
	},

	select: function(value) {
		this._selectedOption = this.dataSource.getOption(value);
		if (this._options.dataSource.label) {
			this._labelEl.text(this._selectedOption[this._options.dataSource.label]);
		} else {
			this._labelEl.text(value);
		}
		this.emit('select', this._selectedOption);
	},

	selectByIndex: function(idx) {
		this._selectedOption = this.dataSource.getOptionByIndex(idx);
		if (this._options.dataSource.label) {
			this._labelEl.text(this._selectedOption[this._options.dataSource.label]);
		} else {
			this._labelEl.text(this._selectedOption);
		}
		this.emit('select', this._selectedOption);
	},

	getSelectedOption: function() {
		return this._selectedOption;
	}
});

module.exports = SmartPicklistSingle;