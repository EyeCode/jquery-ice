# jQuery-ICE (Initialize Callable Events)

> Set your template and let jquery-ICE call methods from raised events

Prerequisite:

* [jQuery](https://github.com/jquery/jquery)
* [jQuery-Class](https://github.com/EyeCode/jquery-class)

## Install

> You can dowmload it from here or install via bower with the following package:

	"jquery-ice": "1.0.*"

## How To Use

1) Include `jquery-ice.js` in the page (or use the minified version) with there dependency (jquery and jquery-class)

2) Now play with the dom:

```html
<a data-ice="click|alert" data-ice-params="Hello World!"
    Call this
</a>
```

### Syntax

<@tag data-ice="" [data-ice-params=""] [data-ice-event=""]>
* @tag: any html tag is able to run this (a, div, button, etc...)
* data-ice: [event|method or event|namespace] Event following by the method to call, you just have to separate event from callable with a pipe.
* data-ice-params: [Optional(mixed)] This is optional, string, integer or object can be contained here, but becareful to write well defined object if used.
* data-ice-event: [Optional(string] This is also optional, but allows, directly from the dom, to register an event.

Complete Doc : http://eyecode.github.io/jquery-ice/


