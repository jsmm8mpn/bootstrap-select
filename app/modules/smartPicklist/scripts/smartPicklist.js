var Observable = require('./core/fpxObservable');
var DataSource = require('./data/datasource');

var button = '<button type="button" class="btn dropdown-toggle btn-default"/>';
var label = '<span class="picklistLabel"></span>';
var caret = '<span class="picklistArrow"><span class="icon-arrow-down"></span></span>';

//var menuWrapper = '<div class="btn-group bootstrap-select" style="position: absolute"/>';
var menu = '<div class="smartPicklistMenu" style="overflow: hidden; min-height: 0px"/>';
var ul = '<ul class="menuList" style="overflow-y: auto; min-height: 0px"/>';

var SmartPicklist = Observable.extend({

	_init: function($element, options) {
		this.rootEl = $element;

		if (options.listeners) {
			for (var event in options.listeners) {
				this.on(event, options.listeners[event]);
			}
		}

		//this._selectedOptions = [];
		this._open = false;
		this._options = options;
		//this._selectedOption = options.selectedOption || undefined;
		var noValueLabel = options.noValueLabel || '-- Select Option --';
//		if (options.valueProp && !options.labelProp) {
//			options.labelProp = options.valueProp;
//		}

		this.dataSource = new DataSource(options.dataSource);


		$element.addClass('btn-group smartPicklist');
		this._labelEl = $(label);
		//this._labelEl.text(noValueLabel);
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
			li += ' ref="' + i + '"><a>' + label + '</a></li>';
			ulEl.append(li);
		}

		ulEl.on('click', 'li', function() {
			var optionIdx = $(this).attr('ref');

			if (me._options.multi.enabled) {
				me.toggleByIndex(optionIdx, $(this));
			} else {
				me.selectByIndex(optionIdx);
				me.closeMenu();
			}
		});

		var menuEl = $(menu);
		menuEl.append(ulEl);
		this._menuEl = menuEl;
		//this._menuEl = $(menuWrapper);
		//this._menuEl.append(menuEl);

		$('body').append(this._menuEl);

		function reposition() {



			var height = me.rootEl[0].offsetHeight;
			var offset = me.rootEl.offset();
			var windowHeight = $(window).height();

			var dropUp = false;
			var bottomSpace = windowHeight - offset.top - height - 10;
			var menuHeight = this._menuHeight = this._menuHeight || menuEl.outerHeight();

			if (offset.top > bottomSpace) {
				// more room above picklist

				if (menuHeight > bottomSpace) {
					dropUp = true;
				}
			}

			if (dropUp) {
				var top = offset.top - menuHeight - 5;
				if (top < 10) {
					top = 10;
				}
				me._menuEl.css({
					'top': top,
					'left': offset.left,
					'min-width': me.rootEl[0].offsetWidth
				});

				var menuMaxHeight = offset.top - 15;
				menuEl.css({
					'max-height': menuMaxHeight
				});
				ulEl.css({
					'max-height': menuMaxHeight
				});

			} else {
				me._menuEl.css({
					'top': offset.top + height,
					'left': offset.left,
					'min-width': me.rootEl[0].offsetWidth
				});

				var menuMaxHeight = windowHeight - offset.top - height - 10;
				menuEl.css({
					'max-height': menuMaxHeight
				});
				ulEl.css({
					'max-height': menuMaxHeight
				});
			}


		}

		reposition();



		this._open = true;

		function onBodyClick(e) {
			if ($(e.target).closest(me._menuEl).length < 1 && $(e.target).closest(me.rootEl).length < 1) {
				me.closeMenu();
				$('html').off('click', onBodyClick);
			}

		}

		setTimeout(function() {
			$('html').on('click', onBodyClick);

			$(window).on('resize', function() {
				reposition();
			});
		});

		this.emit('openMenuPost', menuEl);
	}

	// toggleByIndex: function(idx, itemEl) {
	// 	var option = this.dataSource.getOptionByIndex(idx);
	// 	// for (var i = 0; i < this._selectedOptions.length; i++) {
	// 	// 	if (this._selectedOptions[i] === option) {
	// 	//
	// 	// 	}
	// 	// }
	// 	var selectedIdx = this._selectedOptions.indexOf(option);
	// 	if (selectedIdx < 0) {
	// 		this._selectedOptions.push(option);
	// 		itemEl.find('a').append('<i class="icon-arrow-left check-mark"/>');
	// 	} else {
	// 		this._selectedOptions.splice(selectedIdx, 1);
	// 		itemEl.find('i').remove();
	// 	}
	//
	// 	if (this._selectedOptions.length === 0) {
	// 		this._labelEl.text('-- Select Option --');
	// 	} else if (this._options.dataSource.label) {
	// 		this._labelEl.text(this._selectedOptions.length + ' items selected');
	// 	} else {
	// 		this._labelEl.text(this._selectedOptions.join());
	// 	}
	// },
	//
	// select: function(value) {
	// 	if (this._options.multi) {
	//
	// 	} else {
	// 		this._selectedOption = this.dataSource.getOption(value);
	// 		if (this._options.dataSource.label) {
	// 			this._labelEl.text(this._selectedOption[this._options.dataSource.label]);
	// 		} else {
	// 			this._labelEl.text(value);
	// 		}
	// 		this.emit('select', this._selectedOption);
	// 	}
	// },
	//
	// selectByIndex: function(idx) {
	// 	this._selectedOption = this.dataSource.getOptionByIndex(idx);
	// 	if (this._options.dataSource.label) {
	// 		this._labelEl.text(this._selectedOption[this._options.dataSource.label]);
	// 	} else {
	// 		this._labelEl.text(this._selectedOption);
	// 	}
	// 	this.emit('select', this._selectedOption);
	// },
	//
	// getSelectedOption: function() {
	// 	return this._selectedOption;
	// }
});

module.exports = SmartPicklist;