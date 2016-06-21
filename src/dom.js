import { bindAll } from './util';

export default {
    setNode(node = document.querySelector('body')) {
        this.n1 = node.querySelector(this.wrapper);
        this.n2 = node.querySelector(this.scroller);
        this.n3 = node.querySelector(this.bar);

        const bounding = this.n1.getBoundingClientRect();

        this.setDimension(
            bounding.top,
            bounding.left,
            this.n1.clientWidth,
            this.n1.clientHeight,
            this.n2.clientWidth,
            this.n2.clientHeight,
            this.n3.clientWidth,
            this.n3.clientHeight
        );
        this.doNotify();

        this._installListener();
    },

    _installListener() {
        bindAll(this,
            '_onMouseUp',
            '_onMouseDown',
            '_onMouseMove',
            '_onMouseWheel'
        );

        window.addEventListener('mouseup', this._onMouseUp);
        window.addEventListener('mousemove', this._onMouseMove);
        this.n1.addEventListener('mousedown', this._onMouseDown);
        this.n1.addEventListener('mousewheel', this._onMouseWheel);
        this.n1.addEventListener('DOMMouseScroll', this._onMouseWheel);
    },

    _uninstallListener() {
        window.removeEventListener('mouseup', this._onMouseUp);
        window.removeEventListener('mousemove', this._onMouseMove);
        this.n1.removeEventListener('mousedown', this._onMouseDown);
        this.n1.removeEventListener('mousewheel', this._onMouseWheel);
        this.n1.removeEventListener('DOMMouseScroll', this._onMouseWheel);
    },

    _antiBoundingX(x) {
        return x - this.x;
    },

    _antiBoundingY(y) {
        return y - this.y;
    },

    _onMouseUp(ev) {
        this.doMouseUp(ev.timeStamp);
    },

    _onMouseDown(ev) {
        const withinBar = this.doMouseDown(
            this._antiBoundingX(ev.clientX),
            this._antiBoundingY(ev.clientY),
            ev.timeStamp
        );

        if (withinBar) {
            ev.preventDefault();
        }
    },

    _onMouseMove(ev) {
        this.doMouseMove(
            this._antiBoundingX(ev.clientX),
            this._antiBoundingY(ev.clientY),
            ev.timeStamp
        );
    },

    _onMouseWheel(ev) {
        ev.preventDefault();

        this.doMouseWheel(
            ev.detail ? ev.detail * -120: ev.wheelDelta,
            this._antiBoundingX(ev.clientX),
            this._antiBoundingY(ev.clientY),
            ev.timeStamp
        );
    }
};
