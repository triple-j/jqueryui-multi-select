(function( $, window, undefined ) {

	"use strict";

	$.widget( "custom.multiselect", {

		// default options
		options: {
			toLeftText:  "<<",
			toRightText: ">>",

			// callbacks
			change: null
		},

		// the constructor
		_create: function() {
			this.wrapper      = $('<div/>').addClass("ui-multi-select");
			this.leftElement  = $('<select/>',{multiple:true}).addClass("select-left");
			this.rightElement = $('<select/>',{multiple:true}).addClass("select-right");
			this.buttonGrp    = $('<span/>').addClass("button-group");
			this.toLeftBtn    = $('<button/>',{text:this.options.toLeftText}).addClass("move-to-left");
			this.toRightBtn   = $('<button/>',{text:this.options.toRightText}).addClass("move-to-right");

			this.element.wrap( this.wrapper );
			this.element.hide();

			this.wrapper = this.element.parent();  // make sure wrapper is pointing to the correct element

			this.buttonGrp.append( this.toRightBtn );
			this.buttonGrp.append( this.toLeftBtn );

			this.toLeftBtn.button();
			this.toRightBtn.button();

			this.wrapper.append( this.leftElement );
			this.wrapper.append( this.buttonGrp );
			this.wrapper.append( this.rightElement );

			this._on(this.toLeftBtn, {click:"moveToLeft"});
			this._on(this.toRightBtn, {click:"moveToRight"});
			this._on(this.element, {change:"_refresh"});

			this._refresh();
		},

		// called when created, and later when changing options
		_refresh: function() {
			console.log('refresh');

			var thisWidget = this;
			var leftElm   = this.leftElement;
			var rightElm  = this.rightElement;

			leftElm.children().remove();
			leftElm.append( this.element.children().clone() );
			leftElm.find('option:selected').prop('selected',false);

			rightElm.children().remove();
			rightElm.append( this.element.children().clone() );
			rightElm.find('option:selected').prop('selected',false);

			this.element.find('option').each(function(idx,elm) {
				var elmValue = $(elm).attr('value');
				var selected = $(elm).prop('selected');

				if ( selected ) {
					thisWidget.simularOption( elm, leftElm ).remove();
				} else {
					thisWidget.simularOption( elm, rightElm ).remove();
				}

			});

			// trigger a callback/event
			this._trigger( "change" );
		},

		// events bound via _on are removed automatically
		// revert other modifications here
		_destroy: function() {
			// remove generated elements
			this.leftElement.remove();
			this.buttonGrp.remove();
			this.rightElement.remove();

			this.element.unwrap();
			this.element.show();
		},
		
		// _setOption is called for each individual option that is changing
		_setOption: function( key, value ) {
			if ( key == "toLeftText" ) this.toLeftBtn.button('option', 'label', value);
			if ( key == "toRightText" ) this.toRightBtn.button('option', 'label', value);
			this._super( key, value );
		},

		// find simular <option> element in given <select> element
		simularOption: function( optionElm, selectElm ) {
			selectElm = selectElm || this.element;

			var $found   = $([]);
			var optValue = $(optionElm).attr('value');

			$(selectElm).find('option').each(function(idx,elm) {
				var elmValue = $(elm).attr('value');
				if ( elmValue == optValue ) {
					$found = $(elm);
					return false;
				}
			});

			return $found;
		},

		// move selected <option>s from the right to the left
		moveToLeft: function() {
			console.log("move to left");
			var thisWidget = this;
			this.rightElement.find('option:selected').each(function(idx,elm) {
				thisWidget.simularOption(elm).prop('selected',false);
			});
			this._refresh();
			return false;
		},

		// move selected <option>s from the left to the right
		moveToRight: function() {
			console.log("move to right");
			var thisWidget = this;
			this.leftElement.find('option:selected').each(function(idx,elm) {
				thisWidget.simularOption(elm).prop('selected',true);
			});
			this._refresh();
			return false;
		}

	});

})( jQuery, window );
