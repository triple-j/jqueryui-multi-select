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
            this.wrapper      = $('<span/>').addClass("ui-multi-select");
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

            this._refresh( false );
        },

        // called when created, and later when changing options
        _refresh: function( triggerChange ) {
            triggerChange = (typeof triggerChange === "undefined") ? true : triggerChange;
            
            var thisWidget = this,
                leftElm    = this.leftElement,
                rightElm   = this.rightElement;

            leftElm.children().remove();
            leftElm.append( this.element.children().clone() );
            leftElm.find('option:selected').prop('selected',false);
            
            this._on(leftElm.find('optgroup'), {click:"selectGroupOptions"});

            rightElm.children().remove();
            rightElm.append( this.element.children().clone() );
            rightElm.find('option:selected').prop('selected',false);
            
            this._on(rightElm.find('optgroup'), {click:"selectGroupOptions"});

            this.element.find('option').each(function(idx,elm) {
                var selected = $(elm).prop('selected');
                thisWidget.simularOption( elm, (selected ? leftElm : rightElm) ).remove();
            });

            // trigger a callback/event
            if ( triggerChange ) { this._trigger( "change" ); }
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
            if ( key == "toLeftText" ) { this.toLeftBtn.button('option', 'label', value); }
            if ( key == "toRightText" ) { this.toRightBtn.button('option', 'label', value); }
            this._super( key, value );
        },

        // find simular <option> element in given <select> element
        simularOption: function( optionElm, selectElm ) {
            selectElm = selectElm || this.element;

            var $found   = $([]),
                optValue = $(optionElm).attr('value');

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
            var thisWidget = this;
            this.rightElement.find('option:selected').each(function(idx,elm) {
                thisWidget.simularOption(elm).prop('selected',false);
            });
            this._refresh();
            return false;
        },

        // move selected <option>s from the left to the right
        moveToRight: function() {
            var thisWidget = this;
            this.leftElement.find('option:selected').each(function(idx,elm) {
                thisWidget.simularOption(elm).prop('selected',true);
            });
            this._refresh();
            return false;
        },
        
        // select all children <option>s of a group, but don't move them
        selectGroupOptions: function(event) {
            var optgroupElm = $(event.target),
                selectElm = optgroupElm.parent();
            
            // make sure it was the `<optgroup>` element that was clicked and not a child element
            if (!optgroupElm.is('optgroup')) {
                return false;
            }
            
            // deselect other options (if the `CTRL` key is not pressed)
            if (!event.ctrlKey) {
                selectElm.find('option:selected').each(function(idx,elm) {
                    $(elm).prop('selected',false);
                });
            }
            
            // select this group's options
            optgroupElm.find('option:not(:disabled)').each(function(idx,elm) {
                $(elm).prop('selected',true);
            });
            
            return false;
        }

    });

})( jQuery, window );
