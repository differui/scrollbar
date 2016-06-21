export default {

    // set virtual dimension
    setDimension(x, y, w1, h1, w2, h2, w3, h3) {
        this.x = x;
        this.y = y;
        this.w1 = w1;
        this.h1 = h1;
        this.w2 = w2;
        this.h2 = h2;
        this.w3 = this.__enableHorizontal ? w1 * w1 / w2 : w3;
        this.h3 = this.__enableVertical ? h1 * h1 / h2 : h3;
    },

    _withinBar(x, y) {
        const { w1, h1, t3, w3, h3 } = this;

        return x <= w1 &&
            x >= (w1 - w3) &&
            y >= t3 &&
            y <= (t3 + h3);
    }
};
