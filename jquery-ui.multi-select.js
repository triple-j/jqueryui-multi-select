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


			//this.wrapper.addClass("ui-multi-select");
			this.element.wrap( this.wrapper );
			this.element.hide();

			this.wrapper = this.element.parent();

			this.buttonGrp.append( this.toRightBtn );
			this.buttonGrp.append( this.toLeftBtn );
			//buttonGrp.appendTo( wrapper );

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
			//var main  = this.element;
			var leftElm   = this.leftElement;
			var rightElm  = this.rightElement;
			/*var removeOpt = function($element, value, text) {
				$element.find('option').each(function(idx,elm) {
					var elmValue = $(elm).attr('value');
					var elmText  = $(elm).text;
					if ( elmValue == value && elmText == text ) {
						$(elm).remove();
					}
				});
			};*/

			leftElm.children().remove();
			leftElm.append( this.element.children().clone() );
			leftElm.find('option:selected').prop('selected',false);

			rightElm.children().remove();
			rightElm.append( this.element.children().clone() );
			rightElm.find('option:selected').prop('selected',false);

			//console.log('boo');

			this.element.find('option').each(function(idx,elm) {
				var elmValue = $(elm).attr('value');
				//var elmText  = $(elm).text;
				var selected = $(elm).prop('selected');
				//console.log(elm, selected);

				if ( selected ) {
					//removeOpt( leftElm, elmValue, elmText );
					thisWidget.simularOption( elm, leftElm ).remove();
				} else {
					//removeOpt( rightElm, elmValue, elmText );
					thisWidget.simularOption( elm, rightElm ).remove();
				}

			});


			// trigger a callback/event
			this._trigger( "change" );
		},

/*
		// a public method to change the color to a random value
		// can be called directly via .colorize( "random" )
		random: function( event ) {

		},
*/

		// events bound via _on are removed automatically
		// revert other modifications here
		_destroy: function() {
			// remove generated elements
			this.leftElement.remove();
			this.buttonGrp.remove();
			this.rightElement.remove();
			//this.element.parent().children('.select-right, .select-left, .button-group').remove();

			this.element.unwrap();
			this.element.show();
		},

/*
		// _setOptions is called with a hash of all options that are changing
		// always refresh when changing options
		_setOptions: function() {
			// _super and _superApply handle keeping the right this-context
			this._superApply( arguments );
			this._refresh();
		},
*/
		// _setOption is called for each individual option that is changing
		_setOption: function( key, value ) {
			if ( key == "toLeftText" ) this.toLeftBtn.button('option', 'label', value);
			if ( key == "toRightText" ) this.toRightBtn.button('option', 'label', value);
			this._super( key, value );
		},


		simularOption: function( optionElm, selectElm ) {
			selectElm = selectElm || this.element;

			var $found   = $([]);
			var optValue = $(optionElm).attr('value');
			//var optText  = $(optionElm).text();
			//	console.log("look",optionElm,optValue,optText);

			$(selectElm).find('option').each(function(idx,elm) {
				var elmValue = $(elm).attr('value');
				//var elmText  = $(elm).text();
				//console.log("see",elm,elmValue,elmText);
				if ( elmValue == optValue/* && elmText == optText */) {
					$found = $(elm);
					return false;
				}
			});

			return $found;
		},

		moveToLeft: function() {
			console.log("move to left");
			var thisWidget = this;
			this.rightElement.find('option:selected').each(function(idx,elm) {
				thisWidget.simularOption(elm).prop('selected',false);
			});
			this._refresh();
			return false;
		},

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
