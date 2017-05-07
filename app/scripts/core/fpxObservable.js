var Class = require('./fpxClass');

var FpxObservable = Class.extend({
	init: function() {
		this._registeredEvents = {};
	},
	on: function(event, fn) {
		if (!this._registeredEvents[event]) {
			this._registeredEvents[event] = [];
		}
		this._registeredEvents[event].push(fn);
	},
	emit: function(event) {
		var params = Array.prototype.slice.call(arguments, 1);
		var responses = [];
		if (this._registeredEvents[event]) {
			$.each(this._registeredEvents[event], function (idx, fn) {
				var response = fn.apply(this, params);
				if (typeof response !== 'undefined') {
					responses.push(response);
				}
			});
		}
		return responses;
	}
});

module.exports = FpxObservable;