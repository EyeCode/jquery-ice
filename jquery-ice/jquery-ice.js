/**
 * JQuery Ice tool -- (I)nitialize (C)all to (E)vents
 * v2.0.0
 * GOAL: Provide a simple and robust method to listen and react to events
 *       on DOM regardless of whether it is static or dynamic
 *
 * Usage:
 *  By default some html tag have a default event attached when data-ice is present:
 *      Put data-ice="namespace" on DOM element to be listened
 *      Where:
 *          namespace: the namespace/method to call
 *  Basic example:
 *      <a data-ice="alert" data-ice-params="HELLO WORLD!">click here</a>
 *      This will listen on click of the element and call alert() with declared params
 *      <form data-ice="validate">...</form>
 *      This will listen on submit of the form and call validate()
 *  For the already attached event list see <events> below
 *
 *  You can add more than one event listener to a html tag, just follow this example:
 *      Put data-ice-[event]="namespace" on DOM element to be listened
 *      Where:
 *          event: the new event to register
 *          namespace: the namespace/method to call
 *  Basic example:
 *      <a
 *          data-ice="alert"
 *          data-ice-dblclick="confirm"
 *          data-ice-custom-event="doSomething"
 *          data-ice-params="HELLO WORLD!"
 *      >
 *          click here
 *      </a>
 *      Ok, we have now 3 registered events for a single html tag:
 *          1. This will listen on click and call alert("HELLO WORLD!") / because it's a default listener to <a/>
 *          2. This will listen on dbclick and call confirm("HELLO WORLD!")
 *          3. This will also listen on custom.event and call doSomething("HELLO WORLD!"),
 *             where the "custom.event" is created and registred on the fly.
 */

$.Class({
    namespace: 'ice',

    /**
     *  Events container
     */
    events: {
        click: {
            event: 'click',
            strListener: 'a[data-ice], div[data-ice], button[data-ice]'
        },
        change: {
            event: 'change',
            strListener: 'input[data-ice], select[data-ice], textarea[data-ice]'
        },
        submit: {
            event: 'submit',
            strListener: 'form[data-ice]'
        }
    },

    /**
     * Initialization of action
     *    Call method configured in the data-action element
     *    see it.callback.action for methods definition
     */
    init: function () {
        this.addHelpers();
        this.registerEvents(this);
        this.startListeners(this);
    },

    /**
     * Extract Custom events to listen from dom elements
     *
     * @param self
     */
    registerEvents: function(self) {
        $(":hasAttr(^data-ice.*$)").each(function() {
            $.each($(this).data(), function(key, value) {
                if (key.indexOf('ice') === 0) {
                    switch (key) {
                        case "ice": case "iceParams": case "iceCallback":
                        // do nothing...
                        break;
                        default:
                            if (typeof self.events[key] === 'undefined') {
                                self.events[key] = {
                                    event: key.replace('ice', '').unCamelize('.'),
                                    strListener: '[data-' + key.unCamelize('-') + ']'
                                };
                            }
                            break;
                    }
                }
            });
        })
    },

    /**
     * Start listeners for those events
     *
     * @param self
     */
    startListeners: function(self) {
        $.each(self.events, function(key, value) {
            $('body').on(value.event, value.strListener, function (e) {
                var $element = $(this);
                if (!$element.prop('disabled') && !$element.attr('disabled')) {
                    ice.call($element, e);
                }
            });
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
        return $element.data('ice' + event.camelize())
            ? $element.data('ice' + event.camelize()).split('.')
            : (
            $element.data('ice')
                ? $element.data('ice').split('.')
                : null
        )
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
     * Add Helpers
     */
    addHelpers: function() {
        /**
         * Add :hasAttr(regex) to css selector
         * Thanks to Shawn Chin <http://stackoverflow.com/users/115845/shawn-chin>
         * Ref: http://stackoverflow.com/questions/12199008/find-html-based-on-partial-attribute
         */
        $.expr[':'].hasAttr = $.expr.createPseudo(function(regex) {
            var re = new RegExp(regex);
            return function(obj) {
                var attrs = obj.attributes
                for (var i = 0; i < attrs.length; i++) {
                    if (re.test(attrs[i].nodeName)) return true;
                };
                return false;
            };
        });

        String.prototype.unCamelize = function (splitter) {
            splitter = splitter || ".";
            return this.replace(/[A-Z]/g, function (letter, position) {
                return (position > 0 ? splitter : '') + letter.toLowerCase();
            });
        };

        String.prototype.camelize = function () {
            return this.replace (/(?:^|[-_\.])(\w)/g, function (_, letter) {
                return letter ? letter.toUpperCase () : '';
            })
        };
    }
});