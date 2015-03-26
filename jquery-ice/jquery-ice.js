/**
 * JQuery Ice tool -- (I)nitialize (C)all to (E)vents
 * v1.1.0
 * GOAL: Provide a simple and robust method to listen and react to events
 *       on DOM regardless of whether it is static or dynamic
 *
 * Usage:
 *  Put data-ice="event|namespace" on DOM element to be listened
 *        Where:
 *          event: It is the listening event
 *          namespace: the namespace/method to call
 * Basic example:
 *  <a data-ice="click|alert" data-ice-params="HELLO WORLD!">click here</a>
 *  This will listen on click of the element and call alert() with declared params
 */

$.Class({
    namespace: 'ice',

    // constant
    consts: {
        ICE: '[data-ice]',
        SPLITTER: '|'
    },

    // common base known events for dom node, no needs to register those manually
    events:  {
        'click' : ['a', 'button', 'div', 'p'],
        'change': ['input', 'select', 'textarea'],
        'submit': ['form']
    },

    customEvents: [],

    /**
     * Initialization of action
     *    Call method configured in the data-action element
     *    see it.callback.action for methods definition
     */
    init: function () {
        this.registerIceEvents(this);
        this.startListeners(this);
    },

    /**
     * Start listeners for those events
     *
     * @param events
     */
    startListeners: function(self) {
        $.each(self.events, function(event, selectors) {
            self.addDefaultListener(event, selectors);
        });

        $.each(self.customEvents, function(idx, event) {
            self.addListener(event);
        });
    },

    /**
     * Add default listener to an event
     * @param event
     * @param selectors
     */
    addDefaultListener: function(event, selectors) {
        $('body').on(event, this.buildPreStrListener(selectors), function (e) {
            var $element = $(this);
            if (!$element.prop('disabled') && !$element.attr('disabled')) {
                ice.call($element, e);
            }
        });
    },

    /**
     * Add listener to an event
     * @param event
     */
    addListener: function(event) {
        $('body').on(event, this.buildStrListener(event), function (e) {
            var $element = $(this);
            if (!$element.prop('disabled') && !$element.attr('disabled')) {
                ice.call($element, e);
            }
        });
    },

    /**
     * Call to defined ice method
     *
     * @param element The element who make the call
     * @param event   The event raised
     */
    call: function (element, event) {
        var calling = this.callable($(element), event.type),
            params = this.getArguments($(element)),
            method = context = window;

        $.each(calling, function(index, value){
            if (typeof method.getType !== 'undefined' && method.getType() === 'Class') {
                context = method;
            }
            if (typeof method[value] !== 'undefined') {
                method = method[value];
            }
        });

        method !== window ? $.proxy(method, context, params, $(element), event)() : null;
    },

    /**
     * Call the callback for the defined element
     *
     * @param element
     * @param params
     */
    callback: function (element, params) {
        var method = context = window;
        if ($(element).data('iceCallback')) {
            $.each($(element).data('iceCallback').split('.'), function (index, value) {
                if (typeof method.getType !== 'undefined' && method.getType() === 'Class') {
                    context = method;
                }
                if (typeof method[value] !== 'undefined') {
                    method = method[value];
                }
            });
            $.proxy(method, context, params, $(element))();
        }
    },

    /**
     * Extract callable method from element
     *
     * @param $element The element who make the call
     * @param event    The event raised
     *
     * @return array  Callable
     */
    callable: function($element, event) {
        return $element.data('ice').replace(event + this.SPLITTER(), '').split('.') || null;
    },

    /**
     * Extract arguments needed for calls
     *
     * @param $element
     *
     * @return mixed Extracted params
     */
    getArguments: function($element) {
        return $element.data('iceParams') || null;
    },

    /**
     * Extract new events to listen from dom elements
     *
     * @param self
     */
    registerIceEvents: function(self) {
        $(this.ICE().replace(']', '-event]')).each(function() {
            if ($.inArray($(this).data('iceEvent'), self.events) == -1) {
                self.customEvents.push($(this).data('iceEvent'));
            }
        });
    },

    /**
     * Register new event if not already registered
     *
     * @param event The event to register
     */
    registerEvent: function (event) {
        if ($.inArray(event, this.events) == -1) {
            this.events.push(event);
            this.addListener(event);
        }
    },

    /**
     * Build string [data-ice^=""] to provide something to listen
     *
     * @param event     The data-ice event to listen
     *
     * @return string       The event to listen
     */
    buildStrListener: function (event) {
        return this.ICE().replace(']', '^="'+ event +'"]');
    },

    /**
     * Build string [data-ice] to provide something to listen
     * @param selectors CSS selectors related to event
     *
     * @return string       The event to listen
     */
    buildPreStrListener: function (selectors) {
        var domSelector = [];

        for (var x in selectors) {
            domSelector.push(selectors[x] + this.ICE());
        }

        return domSelector.join(', ');
    }
});