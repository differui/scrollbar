'use strict';

var eventAPI = {
    doMouseDown: function doMouseDown(x, y, timeStamp) {
        var withinBar = this._withinBar(x, y);

        if (withinBar) {
            this.__drag = true;
            this._t1 = this.t1;
            this._t2 = this.t2;
            this._t3 = this.t3;
            this.mx = x;
            this.my = y;
        }

        return withinBar;
    },
    doMouseMove: function doMouseMove(x, y, timeStamp) {
        if (!this.__drag) {
            return;
        }

        var h1 = this.h1;
        var h2 = this.h2;
        var h3 = this.h3;
        var t3 = this.t3;
        var _t3 = this._t3;


        var xDelta = x - this.mx;
        var yDelta = y - this.my;

        t3 = _t3 + yDelta;
        t3 = Math.max(t3, 0);
        t3 = Math.min(t3, h1 - h3);

        this.t2 = t3 * h2 / h1 * -1;
        this.t3 = t3;
        this.doNotify();
    },
    doMouseUp: function doMouseUp(timeStamp) {
        this.__drag = false;
    },
    doMouseWheel: function doMouseWheel(delta, timeStamp) {
        var t2 = this.t2;
        var h1 = this.h1;
        var h2 = this.h2;


        t2 += delta / 10;

        if (!this.__enableDebounce) {
            t2 = Math.max(t2, h1 - h2);
            t2 = Math.min(t2, 0);
        }

        this.t2 = t2;
        this.t3 = t2 * h1 / h2 * -1;
        this.doNotify();
    },
    doNotify: function doNotify() {
        var t2 = this.t2;
        var w2 = this.w2;
        var h2 = this.h2;
        var t3 = this.t3;
        var w3 = this.w3;
        var h3 = this.h3;


        this.__callback(t2, w2, h2, t3, w3, h3);
    }
};

function bindAll(context) {
    for (var i = 1; i < arguments.length; i += 1) {
        var name = arguments[i];
        var method = context[name];

        context[name] = method.bind(context);
    }
};

var domAPI = {
    setNode: function setNode() {
        var node = arguments.length <= 0 || arguments[0] === undefined ? document.querySelector('body') : arguments[0];

        this.n1 = node.querySelector(this.wrapper);
        this.n2 = node.querySelector(this.scroller);
        this.n3 = node.querySelector(this.bar);

        var bounding = this.n1.getBoundingClientRect();

        this.setDimension(bounding.top, bounding.left, this.n1.clientWidth, this.n1.clientHeight, this.n2.clientWidth, this.n2.clientHeight, this.n3.clientWidth, this.n3.clientHeight);
        this.doNotify();

        this._installListener();
    },
    _installListener: function _installListener() {
        bindAll(this, '_onMouseUp', '_onMouseDown', '_onMouseMove', '_onMouseWheel');

        window.addEventListener('mouseup', this._onMouseUp);
        window.addEventListener('mousemove', this._onMouseMove);
        this.n1.addEventListener('mousedown', this._onMouseDown);
        this.n1.addEventListener('mousewheel', this._onMouseWheel);
        this.n1.addEventListener('DOMMouseScroll', this._onMouseWheel);
    },
    _uninstallListener: function _uninstallListener() {
        window.removeEventListener('mouseup', this._onMouseUp);
        window.removeEventListener('mousemove', this._onMouseMove);
        this.n1.removeEventListener('mousedown', this._onMouseDown);
        this.n1.removeEventListener('mousewheel', this._onMouseWheel);
        this.n1.removeEventListener('DOMMouseScroll', this._onMouseWheel);
    },
    _antiBoundingX: function _antiBoundingX(x) {
        return x - this.x;
    },
    _antiBoundingY: function _antiBoundingY(y) {
        return y - this.y;
    },
    _onMouseUp: function _onMouseUp(ev) {
        this.doMouseUp(ev.timeStamp);
    },
    _onMouseDown: function _onMouseDown(ev) {
        var withinBar = this.doMouseDown(this._antiBoundingX(ev.clientX), this._antiBoundingY(ev.clientY), ev.timeStamp);

        if (withinBar) {
            ev.preventDefault();
        }
    },
    _onMouseMove: function _onMouseMove(ev) {
        this.doMouseMove(this._antiBoundingX(ev.clientX), this._antiBoundingY(ev.clientY), ev.timeStamp);
    },
    _onMouseWheel: function _onMouseWheel(ev) {
        ev.preventDefault();

        this.doMouseWheel(ev.detail ? ev.detail : ev.wheelDelta / 120, this._antiBoundingX(ev.clientX), this._antiBoundingY(ev.clientY), ev.timeStamp);
    }
};

var virtualAPI = {

    // set virtual dimension

    setDimension: function setDimension(x, y, w1, h1, w2, h2, w3, h3) {
        this.x = x;
        this.y = y;
        this.w1 = w1;
        this.h1 = h1;
        this.w2 = w2;
        this.h2 = h2;
        this.w3 = this.__enableHorizontal ? w1 * w1 / w2 : w3;
        this.h3 = this.__enableVertical ? h1 * h1 / h2 : h3;
    },
    _withinBar: function _withinBar(x, y) {
        var w1 = this.w1;
        var h1 = this.h1;
        var t3 = this.t3;
        var w3 = this.w3;
        var h3 = this.h3;


        return x <= w1 && x >= w1 - w3 && y >= t3 && y <= t3 + h3;
    }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function ScrollerBar() {
    var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var opts = arguments[1];

    this.x = 0; // bounding x
    this.y = 0; // bounding y

    this.w1 = 0; // wrapper width
    this.w2 = 0; // scroller width
    this.w3 = 0; // bar width

    this.h1 = 0; // wrapper height
    this.h2 = 0; // scroller height
    this.h3 = 0; // bar height

    this.t1 = 0; // wrapper top offest
    this.t2 = 0; // scroller top offset
    this.t3 = 0; // bar top offset

    this._t1 = 0; // snapshot t1
    this._t2 = 0; // snapshot t2
    this._t3 = 0; // snapshot t2

    this.mx = 0; // mouse position x
    this.my = 0; // mouse posiiton y

    this.n1 = null; // wrapper node
    this.n2 = null; // scroller node
    this.n3 = null; // bar node

    this.wrapper = '.wrapper'; // wrapper querier
    this.scroller = '.scroller'; // scroller querier
    this.bar = '.bar'; // bar querier

    this.__drag = false; // dragging bar?
    this.__callback = callback; // notify callback

    this.__enableVertical = true; // enable vertical scroll
    this.__enableHorizontal = false; // enable horizontal scroll
    this.__enableDebounce = false; // enable  debounce animate
}

_extends(ScrollerBar.prototype, domAPI, eventAPI, virtualAPI);

module.exports = ScrollerBar;