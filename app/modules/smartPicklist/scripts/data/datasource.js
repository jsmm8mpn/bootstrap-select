var utilities = require('../core/fpxUtilities');
var Observable = require('../core/fpxObservable');

var DataSource = Observable.extend({
	init: function(options) {
		this._super(options);
		if (options) {
			this._labelProperty = options.label;
			this._valueProperty = options.value;
			this._options = options.options;
		}
	},

	setOptions: function(options) {
		this._options = options;
		this.emit('changed');
	},

	getOptions: function() {
		return this._options;
	},

	hasOptions: function() {
		return this._options?true:false;
	},

	clearOptions: function() {
		delete this._options;
		this.emit('changed');
	},

	getOption: function(value) {
		var options = this.getOptions();
		if (!options || !options.length) {
			return;
		}
		if (this._valueProperty) {
			for (var i = 0; i < options.length; i++) {
				var checkId = utilities.getNestedValue(options[i], this._valueProperty);
				if (checkId === value) {
					return options[i];
				}
			}
		} else {
			for (var i = 0; i < options.length; i++) {
				if (options[i] === value) {
					return options[i];
				}
			}
		}
	},

	getOptionByIndex: function(idx) {
		var records = this.getOptions();
		return records[idx];
	},

	search: function(text) {
		if (this.hasOptions()) {
			this._filteredOptions = this._options.filter(function() {

			});
		}
	}
});

module.exports = DataSource;
