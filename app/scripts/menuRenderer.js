var Observable = require('./core/fpxObservable');

var menuWrapper = '<div class="btn-group bootstrap-select open" style="position: absolute"/>';
var menu = '<div class="dropdown-menu open" style="overflow: hidden; min-height: 0px"/>';
var ul = '<ul class="dropdown-menu inner selectpicker" role="menu" style="overflow-y: auto; min-height: 0px"/>';

var MenuRenderer = Observable.extend({

	init: function (picklist) {
		this.picklist = picklist;
		this.dataSource = this.picklist.dataSource;
		this._open = false;
	},

	closeMenu: function() {
		this.picklist.emit('closeMenuPre');
		this._open = false;
		this._menuEl.remove();
		this.picklist.emit('closeMenuPost');
	},

	openMenu: function() {
		this.picklist.emit('openMenuPre');

		var me = this;

		var ulEl = $(ul);

		if (!this.dataSource.hasOptions()) {
			throw 'Do not yet support picklists without options';
		}

		var picklistOptions = this.dataSource.getOptions();
		var labelProp = this.picklist._options.dataSource.label;
		for (var i = 0; i < picklistOptions.length; i++) {
			var label = (typeof picklistOptions[i] === 'object')?(picklistOptions[i][labelProp] || ''):picklistOptions[i];
			var li = '<li';
			if (picklistOptions[i] === this.picklist._selectedOption) { // TODO: Won't work, if user passed in value
				li += ' class="selected"';
			}
			li += ' ref="' + i + '"><a><span class="text">' + label + '</span></a></li>';
			ulEl.append(li);
		}

		ulEl.on('click', 'li', function() {
			var optionIdx = $(this).attr('ref');
			me.picklist.selectByIndex(optionIdx);
			me.closeMenu();
		});

		var menuEl = $(menu);
		menuEl.append(ulEl);
		this._menuEl = $(menuWrapper);
		this._menuEl.append(menuEl);

		var height = this.picklist.rootEl[0].offsetHeight;
		var offset = this.picklist.rootEl.offset();

		this._menuEl.css({
			'top': offset.top + height,
			'left': offset.left,
			'width': this.picklist.rootEl[0].offsetWidth
		});

		var menuMaxHeight = $(window).height() - offset.top - height - 10;
		menuEl.css({
			'max-height': menuMaxHeight
		});
		ulEl.css({
			'max-height': menuMaxHeight
		});

		$('body').append(this._menuEl);

		this._open = true;

		function onBodyClick(e) {
			if ($(e.target).closest(me._menuEl).length < 1 && $(e.target).closest(me.picklist.rootEl).length < 1) {
				me.closeMenu();
				$('html').off('click', onBodyClick);
			}

		}

		setTimeout(function() {
			$('html').on('click', onBodyClick);
		});

		this.picklist.emit('openMenuPost');
	}

});

module.exports = MenuRenderer;