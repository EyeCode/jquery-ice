# jQuery-ICE (Initialize Callable Events)

## Goal
> Provide a simple and robust method to listen and react to events on DOM regardless of whether it is static or dynamic
> Set your template and let jquery-ICE call methods from raised events

Prerequisite:

* [jQuery](https://github.com/jquery/jquery)
* [jQuery-Class](https://github.com/EyeCode/jquery-class)

## Install

> You can dowmload it from here or install via bower with the following package:

	"jquery-ice": "~2.0.0"

## How To Use

1) Include `jquery-ice.js` in the page (or use the minified version) with there dependency (jquery and jquery-class)

2) Now play with the dom:

### Example 1:
Default event - Some html tag have already default event attached to it. So only data-ice="callable" is necessary
 - <a/> listen on click
 - <form/> on submit
 - <input/> on change
 - etc. (take a look at source file for already attached event)

```html
<a data-ice="alert" data-ice-params="Hello World!">
    Call this
</a>
```

### Example 2:
Register event - You can register multiple events on the fly and attach a callable.
(data-ice-[any-event]="callable")

```html
<a
    data-ice="alert" // default click event
    data-ice-mousedown="log.mouseDown"
    data-ice-mouseup="log.mouseUp"
    data-ice-params="Hello World!"
>
    Call this
</a>
```

### Syntax

<%html% data-ice[-event]="callable" [data-ice-params=""] [data-ice-callback=""]>
__html:__
>any html tag is able to run this (a, div, button, etc...)
__data-ice[-event]="callable":__
> [-event] : can be replaced with any known event such as dblclick, mousedown, keypress or any custom event (ex: raised.custom.event become data-ice-raised-custom-event) that can be triggered 
> callable : any reachable namespace/method, the callable will receive 3 arguments:
> - params : Params setted in data-ice-params
> - element : The element that raised the event
> - event : The raised event

__data-ice-params:__
> [Optional(mixed)] This is optional, string, integer or object can be contained here, but becareful to write well defined object if used.

__data-ice-event:__
> [Optional(string] This is also optional, but allows, directly from the dom, to register an event.

__data-ice-callback:__
> [Optional(string) method or namespace] This is also optional, allow callback to a function, you just have to call ice.callback(input, params) to raise the callback in method called previously. Useful to react after ajax call.

Complete Doc : http://eyecode.github.io/jquery-ice/


