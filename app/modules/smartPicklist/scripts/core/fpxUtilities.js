var utilities = {
	formatMessage: function(str) {
		var args = [].slice.call(arguments, 1);
		if (args.length === 0) {
			return str; // if there are no params in string, just return string
		}
		var pattern = new RegExp('{([0-' + (args.length-1) + '])}','g');
		return str.replace(pattern, function(match, index) { return args[index]; });
	},
	
	getNestedValue: function(obj, key) {
		var value = obj,
			keys = key.split('.');
		for (var i = 0; i < keys.length; i++) {
			if (typeof(value) !== 'undefined' && value !== null) {
				value = value[keys[i]];
			}
		}
		return value;
	},

	/**
	 * Implementing our own extend method because the jquery extend function doesn't handle arrays correctly.
	 * JQuery will merge the arrays, where we want to replace the arrays.
	 */
	extend: function(target) {
		var object, key, value, targetValue, targetObject;
		for (var i = 1; i < arguments.length; i++) {
			object = arguments[i];
			for (key in object) {
				var value = object[key];
				var targetValue = target[key];

				// Prevent never-ending loop
				if ( target === value ) {
					continue;
				}

				if (value && jQuery.isPlainObject(value)) {
					targetObject = targetValue && jQuery.isPlainObject(targetValue) ? targetValue : {};
					target[key] = this.extend(targetObject, value);
				} else if (typeof value !== 'undefined') {
					target[key] = value;
				}
			}
		}
		return target;
	}
};

module.exports = utilities;
