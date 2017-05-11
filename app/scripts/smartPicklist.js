var Observable = require('./core/fpxObservable');
var DataSource = require('./data/datasource');

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

		this.dataSource = new DataSource(options.dataSource);


		$element.addClass('btn-group bootstrap-select');
		this._labelEl = $(label);
		this._labelEl.text(noValueLabel);
		var buttonEl = $(button);
		buttonEl.append(this._labelEl);
		buttonEl.append(caret);
		$element.append(buttonEl);

		var me = this;

		$element.click(function() {
			if (me._open) {
				me.closeMenu();
			} else {
				me.openMenu();
			}
		});

		$.each($.fn.smartPicklist._extensions, function(name, ext) {
			if (options[name] && options[name].enabled) {
				new ext(me, options[name]);
			}
		});

		this.emit('initialized', this);
	},

	closeMenu: function() {
		this.emit('closeMenuPre');
		this._open = false;
		this._menuEl.remove();
		this.emit('closeMenuPost');
	},

	openMenu: function() {
		this.emit('openMenuPre');

		var me = this;

		var ulEl = $(ul);

		if (!this.dataSource.hasOptions()) {
			throw 'Do not yet support picklists without options';
		}

		var picklistOptions = this.dataSource.getOptions();
		var labelProp = this._options.dataSource.label;
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
			me.selectByIndex(optionIdx);
			me.closeMenu();
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
			if ($(e.target).closest(me._menuEl).length < 1 && $(e.target).closest(me.rootEl).length < 1) {
				me.closeMenu();
				$('html').off('click', onBodyClick);
			}

		}

		setTimeout(function() {
			$('html').on('click', onBodyClick);
		});

		this.emit('openMenuPost');
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

module.exports = SmartPicklist;