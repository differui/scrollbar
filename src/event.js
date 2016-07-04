import { raf, caf } from './util';

export default {
    doRefine() {
        let { h1, h2, h3, t2, t3 } = this;

        t2 = Math.max(t2, h1 - h2);
        t2 = Math.min(0, t2);
        t3 = Math.max(t3, 0)
        t3 = Math.min(h1 - h3, t3);

        this.t2 = t2;
        this.t3 = t3;
    },

    doNotify() {
        let {
            w1, h1, l1, t1,
            w2, h2, l2, t2,
            w3, h3, l3, t3
        } = this;

        this.__callback(
            w1, h1, l1, t1,
            w2, h2, l2, t2,
            w3, h3, l3, t3
        );
    },

    doMove() {
        this.v2 *= this.__friction;
        this.v3 = this.v2 * this.h1 / this.h2 * -1;

        if (Math.abs(this.v2) < 1 && Math.abs(this.v3) < 1) {
            return;
        }

        this.t2 += this.v2;
        this.t3 += this.v3;

        this.doRefine();
        this.doNotify();
    },

    doLoop() {
        this.doMove();
        caf(this._handler);
        this._handler = raf(this.doLoop.bind(this));
    },

    doScrollTo(x, y) {
        const deltaT = y * -1 - this.t2;
        const direction = deltaT / Math.abs(deltaT)

        this.v2 = deltaT * (1 - this.__friction) / this.__friction + direction;
    },

    doScrollBy(x = 0, y = 0) {
        this.doScrollTo(x, y + this.t2 * -1);
    },

    doMouseDown(x, y, timeStamp) {
        const withinBar = this._withinBar(x, y);

        if (withinBar) {
            this.__drag = true;
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

        let { h1, h2, _t3 } = this;

        let xDelta = x - this.mx;
        let yDelta = y - this.my;

        this.t3 = yDelta + _t3;
        this.t2 = this.t3 * h2 / h1 * -1;

        this.doRefine();
        this.doNotify();
    },

    doMouseUp(timeStamp) {
        this.__drag = false;
    },

    doMouseWheel(delta, x, y, timeStamp) {
        let { h2, h3 } = this;

        this.v2 += delta * this.__step;
    }
};
