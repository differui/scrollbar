export default {
    doMouseDown(x, y, timeStamp) {
        const withinBar = this._withinBar(x, y);

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

    doMouseMove(x, y, timeStamp) {
        if (!this.__drag) {
            return;
        }

        let { h1, h2, h3, t3, _t3 } = this;

        let xDelta = x - this.mx;
        let yDelta = y - this.my;

        t3 = _t3 + yDelta;
        t3 = Math.max(t3, 0);
        t3 = Math.min(t3, h1 - h3);

        this.t2 = t3 * h2 / h1 * -1;
        this.t3 = t3;
        this.doNotify();
    },

    doMouseUp(timeStamp) {
        this.__drag = false;
    },

    doMouseWheel(delta, timeStamp) {
        let { t2, h1, h2 } = this;

        t2 += delta / 10;

        if (!this.__enableDebounce) {
            t2 = Math.max(t2, h1 - h2);
            t2 = Math.min(t2, 0);
        }

        this.t2 = t2;
        this.t3 = t2 * h1 / h2 * -1;
        this.doNotify();
    },

    doNotify() {
        const {
            t2, w2, h2,
            t3, w3, h3
        } = this;

        this.__callback(
            t2, w2, h2,
            t3, w3, h3
        );
    }
};
