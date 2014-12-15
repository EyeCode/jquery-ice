/**
 * JQuery Ice tool -- (I)nitialize (C)all to (E)vents
 * v1.0.0
 * GOAL: Provide a simple and robust method to listen and react to events
 *       on DOM regardless of whether it is static or dynamic
 *
 * Usage:
 *  Put data-ice="event|namespace" on DOM element to be listened
 *        Where:
 *          event: It is the listening event
 *          namespace: the namespace/method to call
 * Example:
 *  <a data-ice="click|alert" data-ice-params="HELLO WORLD!">click here</a>
 *  This will listen on click of the element and call alert() with declared params
 */

new $.Class({
    namespace: 'ice',

    // constant
    consts: {
        ICE: '[data-ice]',
        SPLITTER: '|'
    },

    // common base known events, no needs to register those manually
    events: ['click', 'change', 'focus', 'blur', 'submit'],

    /**
     * Initialization of action
     *    Call method configured in the data-action element
     *    see it.callback.action for methods definition
     */
    init: function () {
        this.registerIceEvents(this);
        this.startListeners(this.events);
    },

    /**
     * Start listeners for those events
     *
     * @param events
     */
    startListeners: function(events) {
        for (var x in events) {
            this.addListener(events[x]);
        }
    },

    /**
     * Add listener to an event
     * @param event
     */
    addListener: function(event) {
        $('body').on(event, this.buildStrListener(event), function (e) {
            e.preventDefault();
            var $element = $(this);
            if (typeof $element.prop('disabled') === "undefined") {
                ice.call($element, e.type);
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
        var calling = this.callable($(element), event),
            params = this.getArguments($(element))
            method = window;

        $.each(calling, function(index, value){
            if (typeof method[value] !== 'undefined') {
                method = method[value];
            }
        });

        method !== window ? $.proxy(method, null, params)() : null;
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
                self.events.push($(this).data('iceEvent'));
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
     * @param event string  The data-ice event to listen
     *
     * @return string       The event to listen
     */
    buildStrListener: function (event) {
        return this.ICE().replace(']', '^="'+ event +'"]');
    }
});