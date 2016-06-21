import { default as eventAPI } from './event';
import { default as domAPI } from './dom';
import { default as virtualAPI } from './virtual';

function ScrollerBar(callback = null, opts) {
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

Object.assign(
    ScrollerBar.prototype,
    domAPI,
    eventAPI,
    virtualAPI
);

export default ScrollerBar;
