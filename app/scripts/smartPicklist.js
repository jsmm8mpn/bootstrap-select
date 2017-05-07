var Observable = require('./core/fpxObservable');

var wrapper = '<div class="btn-group bootstrap-select"/>';
var button = '<button type="button" class="btn dropdown-toggle btn-default"/>';
var label = '<span class="filter-option pull-left"></span>';
var caret = '<span class="bs-caret"><span class="icon-arrow-down"></span></span>';

var menuWrapper = '<div class="btn-group bootstrap-select open" style="position: absolute"/>';
var menu = '<div class="dropdown-menu open" style="overflow: hidden; min-height: 0px"/>';
var ul = '<ul class="dropdown-menu inner selectpicker" role="menu" style="overflow-y: auto; min-height: 0px"/>';

var SmartPicklist = Observable.extend({

	_init: function($element, options) {
		this.rootEl = $element;

		if (options.listeners) {
			for (var event in options.listeners) {
				this.on(event, options.listeners[event]);
			}
		}

		this._open = false;
		this._options = options;
		this._selectedOption = options.selectedOption || undefined;
		var noValueLabel = options.noValueLabel || '-- Select Option --';
//		if (options.valueProp && !options.labelProp) {
//			options.labelProp = options.valueProp;
//		}


		$element.addClass('btn-group bootstrap-select');
		this._labelEl = $(label);
		this._labelEl.text(noValueLabel);
		var buttonEl = $(button);
		buttonEl.append(this._labelEl);
		buttonEl.append(caret);
		$element.append(buttonEl);

		var me = this;

		if (options.options && options.options.length > 0) {
			$element.click(function() {
				me.openMenu();
			});
		}
		this.emit('initialized', this);
	},

	closeMenu: function() {
		this._menuEl.remove();
	},

	openMenu: function() {
		var me = this;
		if (this._open) {
			$('.bootstrap-select.open').remove();
			this._open = false;
		} else {

			var ulEl = $(ul);

			var picklistOptions = this._options.options;
			var labelProp = this._options.labelProp;
			for (var i = 0; i < picklistOptions.length; i++) {
				var label = (typeof picklistOptions[i] === 'object')?(picklistOptions[i][labelProp] || ''):picklistOptions[i];
				var li = '<li';
				if (picklistOptions[i] === this._selectedOption) { // TODO: Won't work, if user passed in value
					li += ' class="selected"';
				}
				li += ' ref="' + i + '"><a><span class="text">' + label + '</span></a></li>';
				ulEl.append(li);
			}

			ulEl.on('click', 'li', function() {
				var optionIdx = $(this).attr('ref');
				this._selectedOption = picklistOptions[optionIdx];
				var selectedLabel =  (typeof this._selectedOption === 'object')?(this._selectedOption.label || ''):this._selectedOption;
				me._labelEl.text(selectedLabel);
				me.closeMenu();
				me.emit('select', this._selectedOption);
			});

			var menuEl = $(menu);
			menuEl.append(ulEl);
			this._menuEl = $(menuWrapper);
			this._menuEl.append(menuEl);

			var height = this.rootEl[0].offsetHeight;
			var offset = this.rootEl.offset();

			this._menuEl.css({
				'top': offset.top + height,
				'left': offset.left,
				'width': this.rootEl[0].offsetWidth
			});

			var menuMaxHeight = $(window).height() - offset.top - height - 10;
		 menuEl.css({
			 'max-height': menuMaxHeight
		 });
			ulEl.css({
				'max-height': menuMaxHeight
			})

			$('body').append(this._menuEl);

			this._open = true;

			function onBodyClick(e) {
				if ($(e.target).closest(this._menuEl).length < 1) {
					me.closeMenu();
					me._open = false;
					$('html').off('click', onBodyClick);
				}

			}

			setTimeout(function() {
				$('html').on('click', onBodyClick);
			});
		}
	},

	select: function(value) {
		var picklistValues = this._options.options;
		var valueProp = this._options.valueProp;
		if (valueProp) {
			for (var i = 0; i < picklistValues; i++) {
				if (picklistValues[i][valueProp] === value) {
					this._selectedOption = picklistValues[i];
					this._labelEl.text(picklistValues[i][this._options.labelProp]);
					break;
				}
			}
		} else {
			this._selectedOption = value;
			this._labelEl.text(value);
		}
	}
});

module.exports = SmartPicklist;